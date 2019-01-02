"use strict";
var express = require('express');
var bodyParse = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
var Mongoose = require('mongoose');
//requires to authorization
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var path = require('path');
var fs = require('fs');
//to upload files
const multer = require('multer');
const sharp = require('sharp');
var sys = require('sys')
var exec = require('child_process').exec;
var fs = require('fs');

Mongoose.connect('mongodb://localhost:27017/test');
//Mongoose.connect('mongodb://sergioDev:sergio123@172.16.107.2:27017/test');
Mongoose.set('useFindAndModify', false);
var app = express()
app.use("/uploads", express.static(path.join("/home/sergio/E10/adventure-book", "uploads")))
app.use(morgan('combined'))

app.use(bodyParse.urlencoded({
    extended: true
}));
app.use(bodyParse.json())
//control de acceso (CORS)
app.use(cors())


/* Creando los esquemas de los datos */
var Schema = Mongoose.Schema;
var UserDataSchema = new Schema({
    name: String,
    password: String,
    mail: String,
    visited_places: Array,
    wished_places: Array,
    uploadsphotos: Array,
    groupsTravel: Array
}, { collection: 'userData' });

var UserData = Mongoose.model('UserData', UserDataSchema);

var PlaceDataSchema = new Schema({
    place: String,
    author_id: String,
    author_name: String,
    photos: Array,
    date: Date
}, { collection: 'placeData' });

var PlaceData = Mongoose.model('PlaceData', PlaceDataSchema);


var SitesDataSchema = new Schema({
    place: String,
    id_num: Number
}, { collection: 'sitesData' });

var SitesData = Mongoose.model('SitesData', SitesDataSchema);

var GroupTravelSchema = new Schema({
    place: String,
    members: Array,
    author_name: String,
    comments: Array,
    photos: String,
    date: Date
}, { collection: 'groupTravelData' });

var GroupTravel = Mongoose.model('groupTravelData', GroupTravelSchema);

/*
var comunidades = ['ANDALUCIA','ARAGÓN','PRINCIPADO DE ASTURIAS','ISLAS BALEARES','PAIS VASCO','ISLAS CANARIAS',
                    'GALICIA','LA RIOJA','CANTABRIA',
                    'CASTILLA Y LEÓN','CATALUÑA','COMUNIDAD VALENCIANA',
                    'CASTILLA LA MANCHA','EXTREMADURA','REGIÓN DE MURCIA','COMUNIDAD DE MADRID',
                    'CEUTA','MELILLA','COMUNIDAD FORAL DE NAVARRA'];

comunidades = comunidades.sort();


for(var i = 0; i < comunidades.length; i++){   

    var data = SitesData({
        place: comunidades[i],
        id_num: i
    });
    data.save()
} */


/*Aquí empieza la aplicación*/


app.get('/', (req, res) => {
    var directorio = __dirname;
    var aux = __dirname.split('server');
    console.log(aux[0]);
    res.sendFile(aux[0] + '/client/' + 'index.html');
});


app.post('/signup', (req, res) => {
    /*curl -X POST -H 'Content-Type: application/json' --data '{"name":"sergio","pass":"12345"}' http://localhost:8081/registrar*/
    var userr = req.body.name;
    var passw = req.body.pass;
    var mail = req.body.mail;

    var data = new UserData({
        name: userr,
        password: bcrypt.hashSync(passw, 8),
        mail: mail
    });

    //Introducing the user in our database
    data.save().then(function (info, err) {

        if (err) {
            console.log("error 1");
            return res.status(500).send("Hubo un problema en el registro de usuario")
        }
        //If the user is registered successfully we create his token
        UserData.findOne({ 'name': data.name }, function (err, user) {
            if (err) {
                console.log("error 2");
                console.log(err);
                return res.status(500).send("Problema para encontrar el usuario")
            }
            //create the authentication token for the user with the jwt package
            //the token expires in 24 hours -> 86400seconds
            let token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 10 });



            res.status(200).send({ auth: true, token: token, user: user });
        })
    });
});


app.post('/login', (req, res) => {
    console.log(req.body.name)
    UserData.findOne({ 'name': req.body.name }, function (err, user) {

        //Server error
        if (err) {
            console.log(err);
            return res.status(500).send("Problema para encontrar el usuario");
        }
        //user not found
        if (!user) {
            console.log("usuario no registrado");
            return res.status(404).send("Usuario no registrado");
        }
        console.log("vamos a mostrar el password valid")
        //Useing bcrypt to compare our hashed password with the user supplied password
        let passwordIsValid = bcrypt.compareSync(req.body.pass, user.password);
        console.log(passwordIsValid);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null });
        }
        //create the authentication token for the user with the jwt package
        //the token expires in 24 hours -> 86400seconds
        let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 10 });

        res.status(200).send({ auth: true, token: token, user: user });
    });
})


app.post('/waiting', (req, res) => {
    var token = req.body.token
    if ((token == null) || (token == 'undefined')) {
        console.log(token)
        console.log("usuario sin token")
        res.send({ path: '/login' })
    }
    else {
        console.log("el token tiene algo" + token);
        res.status(200).send({ path: '/userboard' }) //Aqui hay que pasar el user
    }
})


/*await fs.readdirSync(dir + "/" + doc.visited_places[i]).forEach(function(file){
                                response.push(dir + "/" + doc.visited_places[i] + "/" + file) //Esto es lo que necesito para 
                                //devolver todas las fotos de un sitio
                                });*/

app.get('/userboard/:name', (req, res) => {

    var aux = [];
    var wi;
    var response = [];

    var dir = __dirname.split('server')[0] + 'static/uploads/' + req.params.name;
    console.log(dir);
    UserData.findOne({ 'name': req.params.name }, async function (err, doc) {
        for (var i = 0; i < doc.visited_places.length; i++) {
            console.log(doc.visited_places[i])
            try {
                await PlaceData.findOne({ "place": doc.visited_places[i] },
                    function (err, docs) {
                        if (docs == null)
                            res.send("No hay lugares visitados");
                        else {
                            console.log("entro en el else");
                            var url = dir + "/" + doc.visited_places[i] + "/" + (fs.readdirSync(dir + "/" + doc.visited_places[i])[0])
                            aux.push(url.split("adventure-book")[1]);
                        }
                    });
            } catch (err) { console.log(err) };
        }
        console.log(response);
        response.push(doc.visited_places);
        response.push(aux)
        response.push(doc.wished_places);
        const enviar = response;
        res.send(enviar);
    });
});


app.post('/userboard/:name', async (req, res) => {

    //Buscamos los datos del usuario a partir de su _id
    var response = [];
    var aux = []

    try {
        await UserData.findOne({ 'name': req.params.name }, function (err, doc) {
            response.push(doc.visited_places);
        });
    }
    catch (err) {
        console.log(err)
    }

    try {
        await UserData.findOne({ 'name': req.params.name }, function (err, doc) {
            response.push(doc.wished_places);
        });
    }
    catch(err){
        console.log(err)
    }    
})


app.post('/follow_Wished/:name/:place', (req, res) => {

    UserData.findOneAndUpdate({ 'name': req.params.name },
        { $push: { 'wished_places': req.params.place } },
        function (err, doc) {
            if (err == null) {
                console.log("Modificando registro de wished_places");
                res.status(200);
            }

            else {
                console.log("Hubo un error");
                console.log(err);
            }
        });
});



app.post('/sites/:place', async (req, res) => {

    var visited_place = req.params.place.toUpperCase()
    var response = []
    try {
        await PlaceData.findOne({ "place": visited_place }, function (err, doc) {
            console.log()
            response = doc.photos
        });
    }

    catch (err) {
        console.log(err)
    }

    res.send(response);

});



const fileFilter = function (req, file, cb) {
    const allowedType = ["image/jpeg", "image/png", "image/gif"];

    if (!allowedType.includes(file.mimetype)) {
        const error = new Error("Tipo de archivo no permitido");
        error.code = "LIMIT_FILE_TYPES";
        return cb(error, false);
    }
    cb(null, true);
}

const MAX_SIZE = 20000000;
const upload = multer({
    dest: './uploads/',
    fileFilter,
    limits: {
        fileSize: MAX_SIZE
    }
})



app.post('/upload/:name/:place', upload.array('files'), async (req, res) => {
    var files_ = []
    var aux_ = __dirname.split('server');
    var in_visited_places = false
    var visited_place = req.params.place.toUpperCase()

    try {
        await UserData.findOne({ 'name': req.params.name }, function (err, doc) {
            for (var i = 0; i < doc.visited_places.length; i++) {
                var array_ = doc.visited_places
                if (array_[i] == visited_place) {
                    in_visited_places = true;
                    break;
                }

            }
        }
        );
    }
    catch (err) {
        console.log(err);
    }

    if (in_visited_places == false) {
        UserData.findOneAndUpdate({ 'name': req.params.name },
            { $push: { 'visited_places': visited_place } },
            function (err, doc) {
                console.log(err);
            }
        );
    }

    var dirPath = `${aux_[0]}static/uploads/${req.params.name}/${visited_place}`;
    var dirPathWithOut = `${aux_[0]}static/uploads/${req.params.name}`;

    if (fs.existsSync(dirPathWithOut) == false) {
        fs.mkdirSync(dirPathWithOut)
        fs.mkdirSync(dirPath)
    }
    else if (fs.existsSync(dirPath) == false) {
        fs.mkdirSync(dirPath)
    }
    else {
        console.log("Carpeta ya existente")
    }

    try {
        for (var i = 0; i < req.files.length; i++) {
            var file = req.files[i];
            await sharp(file.path)
                .resize(300, 200)
                .embed()
                .toFile(`${dirPath}/${file.originalname}`);

            fs.unlink(file.path)
            files_.push(`${dirPath}/${file.originalname}`)


            UserData.findOneAndUpdate({ 'name': req.params.name },
                { $push: { 'uploadsphotos': `${dirPath}/${file.originalname}` } },
                function (err, doc) {
                    console.log(err);
                }
            );
        }
    }
    catch (err) {
        res.status(428).json({ err });
    }

    PlaceData.findOne({ 'place': visited_place }, function (err, doc) {
        if (doc == null) { //El lugar no existe y se crea
            UserData.findOne({ 'name': req.params.name }, function (err, doc) {

                var data = new PlaceData({
                    place: visited_place,
                    author_id: doc.id,
                    author_name: doc.name,
                    photos: files_,
                    date: new Date()
                });
                data.save().then(function () {
                    PlaceData.findOne({ 'author_name': req.params.name }, function (err, doc) {
                        console.log(err);
                    });
                });
            });
        }
        else {
            PlaceData.findOneAndUpdate({ 'place': visited_place }, { $push: { 'photos': `${dirPath}/${file.originalname}`} }, function (err, doc) {
                console.log(err)
            });

        }

    });


    res.json({ files: files_ });
});



app.post('/delete_Wished/:name/:place', (req, res) => {

    UserData.findOneAndUpdate({ 'name': req.params.name },
        { $pull: { 'wished_places': req.params.place } },
        function (err, doc) {
            console.log("Modificando registro ...");
            console.log(doc);//Esto si funciona perfecto
        }); 
    res.send(200);
});



app.post('/delete_Visited/:name/:place', (req, res) => {

    console.log(req.params.place);
    UserData.findOneAndUpdate({ 'name': req.params.name },
        { $pull: { 'visited_places': req.params.place } },
        function (err, doc) {
            console.log("Modificando registro ...");
            console.log(doc);//Esto si funciona perfecto
        });
    res.status(200);
});



app.post('/delete_Photo/:name/:place/:photo', (req, res) => {

    var place_ = req.params.place.toUpperCase();
    fs.unlinkSync(__dirname.split('server')[0] + 'uploads/' + req.params.name + '/' + place_ + '/' + req.params.photo);
    UserData.findOneAndUpdate({ 'name': req.params.name },
        { $pull: { 'uploadsphotos': __dirname.split('server')[0] + 'uploads/' + req.params.name + '/' + place_ + '/' + req.params.photo } },
        function (err, doc) {
            console.log("Borrando foto ...");
            console.log(doc);//Esto si funciona perfecto
        });
    res.status(200);
});


app.post('/add_group/:author_name/:place', async (req, res) => {


    var aux_ = __dirname.split('server');
    var array_user = [req.params.author_name];
    var photo_group = ""
    try{
        await UserData.findOneAndUpdate({ 'name': req.params.name }, { $push: { 'groupsTravel': req.params.group } }, 
        function (err, doc) {
            console.log("Aqui se añade un grupo a los del user...")
        });
    }catch(err){
        console.log(err);
    } 

    try{
        await PlaceData.findOne({ 'place': req.params.place }, 
        function (err, doc) {

            photo_group = doc.photos[0]
            console.log("Aqui se añade una foto al grupo...");
        });
    }catch(err){
        console.log(err);
    } 

    var data = new GroupTravel({
        place: req.params.place,
        members: array_user,
        author_name: req.params.author_name,
        comments: [],
        photos: photo_group,
        date : new Date()
    });
    data.save().then(function () {
        res.send(200);
    });
});



app.post('/delete_group/:name/:group', (req, res) => {

    UserData.findOneAndUpdate({ 'name': req.params.name }, { $pull: { 'groupsTravel': req.params.group } }, function (err, doc) {
        console.log("Aqui se elimina un grupo...");
    });
    res.send(200);
});



app.post('/follow_group/:name/:group', (req, res) => {

    UserData.findOneAndUpdate({ 'name': req.params.name }, { $push: { 'groupsTravel': req.params.group } }, 
    function (err, doc) {
        console.log("Aqui se añade un grupo a los del user...")
    });
    res.send(200);
});


app.get('/groups/', async (req, res) => {

    try{
        var response = [];
        await GroupTravel.find({},function(err,doc){
            response.push(doc);
    });

    res.send(response);

    }catch(err){};

});



app.get('/groups/:name/', (req, res) => {
    
        var response = [];
        var aux = []
        UserData.findOne({ 'name': req.params.name }, 
        async function (err, doc) {
         for (var i = 0; i < doc.wished_places.length; i++){
            try{
                await GroupTravel.findOne({'place': doc.wished_places[i]},
                function(err,docs){
                    if(docs != null){
                        aux.push(docs); //Aqui devulevo los grupos que existen que sean al lugar que el user tenga como deseados
                    }
                });
            }catch(err){console.log(err)};
        }
         //ESTO A VECES FUNCIONA, ES MAGIA
         response.push(doc.groupsTravel);
         response.push(aux); 
         res.send(response);
        });
});



app.use(function (err, req, res, next) {
    if (err.code === "LIMIT_FILE_TYPES") {
        res.status(422).json({ error: "Solo se permiten imágenes jpeg, png y gif" });
        return;
    }
    if (err.code === "LIMIT_FILE_SIZE") {
        res.status(422).json({ error: `Archivo demasiado pesado. Tamaño máximo: ${MAX_SIZE / 1000}kb` });
        return;
    }

})

app.get('/comprobar', (req, res) => {
    var name = req.body.name;
    console.log(name);


    UserData.findOne({ 'name': name }, function (err, docs) {
        if (docs == null) {
            console.log("documento:" + docs);
            res.send(docs);
        }
        else {
            console.log("documento:" + docs);
            res.send(docs);
            //res.send("Usuario está registrado");
        }
    });
});

app.post('/change_Name/:new/:name', (req, res) => {


    UserData.findOneAndUpdate({ 'name': req.params.name }, { $set: { 'name': req.params.new } }, function (err, docs) {
        console.log("Aquí se actualiza el nombre de usuario");
    });
    res.send(200);
});


app.post('/change_Pass/:new/:name', (req, res) => {

    var new_ = bcrypt.hashSync(req.params.new, 8);

    UserData.findOneAndUpdate({ 'name': req.params.name }, { $set: { 'password': new_ } }, function (err, docs) {
        console.log(docs);
        console.log("Aquí se actualiza la pass de usuario");
    });
    res.send(200);
});



let server = app.listen(process.env.PORT || 8081, function (err) {
    if (err) {
        console.log(err);
    }
    console.log("Escuchando en el Puerto 8081");
});