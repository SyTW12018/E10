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
var path = require("path");
var fs = require("fs");
//to upload files
const multer = require('multer');


Mongoose.connect('mongodb://localhost:27017/test');
//Mongoose.connect('mongodb://sergioDev:sergio123@172.16.107.2:27017/test');
Mongoose.set('useFindAndModify', false);
var app = express()
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
        uploadsphotos: Array
}, {collection: 'userData'});

var UserData = Mongoose.model('UserData',UserDataSchema);

var PlaceDataSchema = new Schema({
    name: String,
    author_id: String,
    author_name: String,
    photos: Array
}, {collection: 'placeData'});

var PlaceData = Mongoose.model('PlaceData',PlaceDataSchema);
 
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
    PlaceData.find({'author_id': JSON.parse(req.body.user)._id}, function(err, user_data){
        console.log(user_data);
    });
});

app.post('/follow/:name/:place', (req, res) => {
    
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

const MAX_SIZE = 2000000;
const upload = multer({
    dest: './uploads/',
    fileFilter,
    limits:{
        fileSize: MAX_SIZE
    }
})

app.post('/upload/:name/:place', upload.array('files'), (req,res) => {

    var aux_ = __dirname.split('src'); 
    var array_aux = [aux_[0] + 'uploads/' + req.files[0].originalname];


    PlaceData.findOne({'name':req.params.place},function(err,doc){
        if(doc == null){ //El lugar no existe y se crea
            UserData.findOne({'name':req.params.name},function(err,doc){
                var data = new PlaceData({
                    name: req.params.place,
                    author_id: doc.id,
                    author_name: doc.name,
                    photos: array_aux
                });
                data.save().then(function(){
                    PlaceData.findOne({'author_name': req.params.name}, function(err,doc){
                        console.log("Guardado en lugares correctamente");
                        console.log("Esto es lo que se ha guardado:",doc);
                    });  
                });
            });
        }
            UserData.findOneAndUpdate({'name':req.params.name},
                {$push: {'visited_places': req.params.place, 'uploadsphotos': aux_[0] + 'uploads/' + req.files[0].originalname}},
                function(err,doc){
                    console.log("Modificando registro ...");
                    console.log(doc);//Esto si funciona perfecto
            });
        
    });
    res.json({files: req.file});
});

app.post('/delete_W/:name/:place', (req, res) => {

    UserData.findOneAndUpdate({'name':req.params.name},
    {$pull: {'wished_places': req.params.place}},
    function(err,doc){
        console.log("Modificando registro ...");
        console.log(doc);//Esto si funciona perfecto
    });
    res.send({path:'/login'});
});

app.post('/delete_V/:name/:place', (req, res) => {

    console.log(req.params.place);
    UserData.findOneAndUpdate({'name':req.params.name},
    {$pull: {'visited_places': req.params.place}},
    function(err,doc){
        console.log("Modificando registro ...");
        console.log(doc);//Esto si funciona perfecto
    });
    res.send({path:'/login'});
});

app.post('/delete_P/:name/:photo', (req, res) => {

    UserData.findOneAndUpdate({'name':req.params.name},
    {$pull: {'uploadsphotos': __dirname.split('src')[0] + 'uploads/' + req.params.photo}},
    function(err,doc){
        console.log("Modificando registro ...");
        console.log(doc);//Esto si funciona perfecto
    });
    res.send({path:'/login'});
});



app.use(function(err, req, res, next){
    if(err.code === "LIMIT_FILE_TYPES"){
        res.status(422).json({error: "Solo se permiten imágenes jpeg, png y gif"});
        return;
    }

    if(err.code === "LIMIT_FILE_SIZE"){
        res.status(422).json({error: 'Archivo demasiado pesado. Tamaño máximo: ${MAX_SIZE/1000}kb'});
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

let server = app.listen(process.env.PORT || 8081, function (err) {
    if(err){
        console.log(err);
    }
    console.log("Escuchando en el Puerto 8081");
});
