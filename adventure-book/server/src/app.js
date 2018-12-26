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
app.use("/uploads", express.static(path.join("/home/jcpasco/Documentos/E10/adventure-book", "uploads")))
app.use(morgan('combined'))

app.use(bodyParse.urlencoded({
    extended:true
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
}, {collection: 'userData'});

var UserData = Mongoose.model('UserData',UserDataSchema);

var PlaceDataSchema = new Schema({
    name: String,
    author_id: String,
    author_name: String,
    photos: Array
}, {collection: 'placeData'});

var PlaceData = Mongoose.model('PlaceData',PlaceDataSchema);

var GroupTravelSchema = new Schema({
    place: String,
    members: Array,
    author_name: String,
    comments: Array,
    photos: Array
}, {collection: 'groupTravelData'});

var GroupTravel = Mongoose.model('groupTravelData',GroupTravelSchema);
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
        password: bcrypt.hashSync(passw,8),
        mail: mail
    });

    //Introducing the user in our database
    data.save().then(function(info, err){
        
        if(err){
            console.log("error 1");
            return res.status(500).send("Hubo un problema en el registro de usuario")
        }
        //If the user is registered successfully we create his token
        UserData.findOne({'name': data.name}, function (err, user){
            if (err){
                console.log("error 2");
                console.log(err);
                return res.status(500).send("Problema para encontrar el usuario")
            }
            //create the authentication token for the user with the jwt package
            //the token expires in 24 hours -> 86400seconds
            let token = jwt.sign({id:user._id}, config.secret, {expiresIn: 10});

            
            
            res.status(200).send({auth: true, token: token, user: user});
        })
    });
});


app.post('/login', (req, res) => {
    console.log(req.body.name)
    UserData.findOne({'name': req.body.name}, function (err, user){
        
        //Server error
        if (err){
            console.log(err);
            return res.status(500).send("Problema para encontrar el usuario");
        }
        //user not found
        if(!user){
            console.log("usuario no registrado");
            return res.status(404).send("Usuario no registrado");
        }
        console.log("vamos a mostrar el password valid")
        //Useing bcrypt to compare our hashed password with the user supplied password
        let passwordIsValid = bcrypt.compareSync(req.body.pass, user.password);
        console.log(passwordIsValid);
        if(!passwordIsValid){
            return res.status(401).send({auth: false, token: null});
        }
        //create the authentication token for the user with the jwt package
        //the token expires in 24 hours -> 86400seconds
        let token = jwt.sign({id:user.id}, config.secret, {expiresIn: 10});

        res.status(200).send({auth: true, token: token, user:user});
    });
})


app.post('/waiting', (req,res) => {
    var token = req.body.token
    if((token == null) || (token == 'undefined')){
        console.log(token)
        console.log("usuario sin token")
        res.send({path:'/login'})
    }
    else{
        console.log("el token tiene algo" + token);
        res.status(200).send({path:'/dashboard'}) //Aqui hay que pasar el user
    }
})



app.post('/dashboard', (req, res) => {

    //Buscamos los datos del usuario a partir de su _id
    var response = [];

    UserData.findOne({'name': JSON.parse(req.body.user).name},function(err,doc){
        
    });

    PlaceData.find({'author_id': JSON.parse(req.body.user)._id}, function(err, user_data){
        console.log(user_data);
    });
});



app.post('/follow_Wished/:name/:place', (req, res) => {
    
    UserData.findOneAndUpdate({'name':req.params.name},
        {$push: {'wished_places': req.params.place}},
        function(err,doc){
            if(err == null){
                console.log("Modificando registro de wished_places");
                res.status(200).send(doc);
            }
         
            else{
                console.log("Hubo un error");
                console.log(err);
            } 
        });
});



const fileFilter = function(req, file, cb){
    const allowedType = ["image/jpeg", "image/png", "image/gif"];

    if(!allowedType.includes(file.mimetype)){
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
    limits:{
        fileSize: MAX_SIZE
    }
})

/*app.post('/upload', upload.array('files'), async (req,res) => {
    
    try{
        var files_ = []
        for(var i = 0; i<req.files.length; i++){
            var file = req.files[i];
            await sharp(file.path)
                .resize(300,200)
                .embed()
                .toFile(`./uploads/${file.originalname}`);
    
            fs.unlink(file.path)
            files_.push(`../../uploads/${file.originalname}`)
        }
        res.json({files: files_});
    }
    catch(err){
        res.status(428).json({err});
    }
})*/


app.post('/upload/:name/:place', upload.array('files'), async (req,res) => {
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> dev-userdestination
=======
>>>>>>> 89e9d2f6d5b1a16d7e2881513e0759b7ae8424dd
    try{
        var files_ = []
        var aux_ = __dirname.split('server');

        var in_visited_places = false
        var visited_place = req.params.place.toUpperCase()
        console.log(visited_place)

        await UserData.find({'name':req.params.name, 'visited_places':visited_place},
            'name',
            function(err,doc){
                console.log("doc: " + doc)
                if(doc != undefined || doc != null){
                    console.log("entra en el if")
                    in_visited_places = true
                }
            }
        );

        if(in_visited_places == false){
            console.log("visited places: " + in_visited_places)
            UserData.findOneAndUpdate({'name':req.params.name},
                {$push: {'visited_places': visited_place, }},
                function(err,doc){
                    console.log("Modificando registro ...");
                    console.log(doc);//Esto si funciona perfecto
                }
            );
        }
        
        var dirPath = `${aux_[0]}uploads/${req.params.name}`
        console.log("dirpath: " + dirPath)
        if(fs.existsSync(dirPath) == false){
            fs.mkdirSync(dirPath)
        }
        else{
            console.log("Carpeta ya existente")
        }       
        

        for(var i = 0; i<req.files.length; i++){
            var file = req.files[i];
            await sharp(file.path)
                .resize(300,200)
                .embed()
                .toFile(`${dirPath}/${file.originalname}`);
    
            fs.unlink(file.path)
            files_.push(`${dirPath}/${file.originalname}`)

            UserData.findOneAndUpdate({'name':req.params.name},
                {$push: { 'uploadsphotos': `${dirPath}/${file.originalname}`}},
                {new: true},
                function(err,doc){
                   console.log("Modificando registro ...");
                   console.log(doc);//Esto si funciona perfecto
                }
            );
        }

        PlaceData.findOne({'name':visited_place},function(err,doc){
            if(doc == null){ //El lugar no existe y se crea
                UserData.findOne({'name':req.params.name},function(err,doc){
                    var data = new PlaceData({
                        name: visited_place,
                        author_id: doc.id,
                        author_name: doc.name,
                        photos: files_
                    });
                    data.save().then(function(){
                        PlaceData.findOne({'author_name': req.params.name}, function(err,doc){
                            console.log("Guardado en lugares correctamente");
                            console.log("Esto es lo que se ha guardado:",doc);
                        });  
                    });
                });
            }
            
        });
    }
    catch(err){
        res.status(428).json({err});
    }
    
    res.json({files: files_});
});




app.post('/delete_Wished/:name/:place', (req, res) => {

    UserData.findOneAndUpdate({'name':req.params.name},
    {$pull: {'wished_places': req.params.place}},
    function(err,doc){
        console.log("Modificando registro ...");
        console.log(doc);password: bcrypt.hashSync(passw,8)//Esto si funciona perfecto
    });password: bcrypt.hashSync(passw,8)
    res.send({path:'/logipassword: bcrypt.hashSync(passw,8)n'});
});



app.post('/delete_Visited/:name/:place', (req, res) => {

    console.log(req.params.place);
    UserData.findOneAndUpdate({'name':req.params.name},
    {$pull: {'visited_places': req.params.place}},
    function(err,doc){
        console.log("Modificando registro ...");
        console.log(doc);//Esto si funciona perfecto
    });
    res.send({path:'/login'});
});



app.post('/delete_Photo/:name/:photo', (req, res) => {

    fs.unlinkSync(__dirname.split('server')[0] + 'uploads/' + req.params.name + '/' + req.params.photo);
    UserData.findOneAndUpdate({'name':req.params.name},
    {$pull: {'uploadsphotos': __dirname.split('server')[0] + 'uploads/' + req.params.name + '/' + req.params.photo}},
    function(err,doc){
        console.log("Borrando foto ...");
        console.log(doc);//Esto si funciona perfecto
    });
    res.send({path:'/login'});
});




app.post('/add_group/:author_name/:place/:photo', /*upload.array('files'),*/ (req,res) =>{

    //Probar si sube foto a ver y ya cambiar el rollo para que suba la foto y tal

    var aux_ = __dirname.split('server');
    var array_user = [req.params.author_name];
    //var array_aux = [aux_[0] + 'uploads/' + req.files[0].originalname];
    var array_aux = ["Ejemplo"];
    var data = new GroupTravel({
        place: req.params.place,
        members: array_user,
        author_name: req.params.author_name,
        comments: [],
        photos: [] //array_aux
    });
    data.save().then(function(){
        res.send(200);
    });
});



app.post('/delete_group/:name/:group', (req,res) =>{

    UserData.findOneAndUpdate({'name': req.params.name},{$pull:{'groupsTravel': req.params.group}}, function(err,doc){
        console.log("Aqui se elimina un grupo...");
    });
    res.send(200);
});



app.post('/follow_group/:name/:group', (req,res) =>{
    
    UserData.findOneAndUpdate({'name':req.params.name},{$push:{'groupsTravel':req.params.group}},function(err,doc){
        console.log("Aqui se añade un grupo a los del user...")
    });
    res.send(200);

    

});



app.use(function(err, req, res, next){
    if(err.code === "LIMIT_FILE_TYPES"){
        res.status(422).json({error: "Solo se permiten imágenes jpeg, png y gif"});
        return;
    }
    if(err.code === "LIMIT_FILE_SIZE"){
        res.status(422).json({error: `Archivo demasiado pesado. Tamaño máximo: ${MAX_SIZE/1000}kb`});
        return;
    }
    
})

app.get('/comprobar', (req, res) => {    
    var name = req.body.name;
    console.log(name);
    

    UserData.findOne({'name': name},function(err,docs){
        if(docs == null){
            console.log("documento:" + docs);
            res.send(docs);
        }
        else{
            console.log("documento:"+ docs);
            res.send(docs);
            //res.send("Usuario está registrado");
        }
    });
});

app.post('/change_Name/:new/:name', (req, res) => {    
   

    UserData.findOneAndUpdate({'name': req.params.name},{$set: {'name': req.params.new}},function(err,docs){
        console.log("Aquí se actualiza el nombre de usuario");
    });
    res.send(200);
});


app.post('/change_Pass/:new/:name', (req, res) => {    
   
    var new_ = bcrypt.hashSync(req.params.new,8);

    UserData.findOneAndUpdate({'name': req.params.name},{$set: {'password': new_}},function(err,docs){
        console.log(docs);
        console.log("Aquí se actualiza la pass de usuario");
    });
    res.send(200);
});



















let server = app.listen(process.env.PORT || 8081, function (err) {
    if(err){
        console.log(err);
    }
    console.log("Escuchando en el Puerto 8081");
});
