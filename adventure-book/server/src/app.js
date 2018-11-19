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

Mongoose.connect('mongodb://localhost:27017/test');
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
        password: String
}, {collection: 'user-data'});

var UserData = Mongoose.model('UserData',UserDataSchema);

var SiteDataSchema = new Schema({
    name: String,
    author: String,
    photos: String
}, {collection: 'site-data'});

var SiteData = Mongoose.model('SiteData',SiteDataSchema);
 
/*Aquí empieza la aplicación*/


app.get('/', (req, res) => {
    var directorio = __dirname;
    var aux = __dirname.split('server');
    console.log(aux[0]);
    res.sendFile(aux[0] + '/client/' + 'index.html');
})

app.post('/registrar', (req, res) => {
    
    /*curl -X POST -H 'Content-Type: application/json' --data '{"name":"sergio","pass":"12345"}' http://localhost:8081/registrar*/
    userr = req.body.name;
    passw = req.body.pass;
    var datos = {
        name: userr,
        password: bcrypt.hashSync(passw, 8)
    };
    var data = new UserData(datos);
    //Introducing the user in our database
    data.save().then(function(err){
        if(err){
            return res.status(500).send("Hubo un problema en el registro de usuario")
        }
        //If the user is registered successfully we create his token
        UserData.findOne({'name': name}, 'name', function (err, user){
            if (err){
                console.log(err);
                return res.status(500).send("Problema para encontrar el usuario")
            }
            //create the authentication token for the user with the jwt package
            //the token expires in 24 hours -> 86400seconds
            let token = jwt.sign({id:user.id}, config.secret, {expiresIn: 86400});

            res.status(200).send({auth: true, token: token, user:user});
        })
    });
});


app.post('/login', (req, res) => {
    UserData.findOne({'name': name}, 'name', function (err, user){
        //Server error
        if (err){
            console.log(err);
            return res.status(500).send("Problema para encontrar el usuario");
        }
        //user not found
        if(!user){
            return res.status(404).send("Usuario no registrado");
        }

        //Useing bcrypt to compare our hashed password with the user supplied password
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if(!passwordIsValid){
            return res.status(401).send({auth: false, token: null});
        }
        //create the authentication token for the user with the jwt package
        //the token expires in 24 hours -> 86400seconds
        let token = jwt.sign({id:user.id}, config.secret, {expiresIn: 86400});

        res.status(200).send({auth: true, token: token, user:user});
    });
})


app.get('/comprobar', (req, res) => {
    
    userr = req.body.name;
    passw = req.body.pass;

    UserData.findOne({name: userr},function(err,docs){
        if(docs == null)
            res.send("Usuario no resgistrado");
        else{
            console.log(docs);
            res.send("Usuario está registrado");
        }
    });
});

app.get('/subir_foto',(req,res) =>{  
    res.sendFile(__dirname + "/foto.html");
});


app.post('/foto/:image', bodyParse.raw({
        limit : "10mb",
        type : "image/*"
}),(req,res) =>{

       /*
    curl -X GET -H 'Content-Type: application/json' --data '{"name":"sergio","pass":"12345"}' http://localhost:8081/comprobar
    Desde el directorio de donde está la foto: 
    curl -X POST -H 'Content-Type: image/png' --data-binary @solare.jpg http://localhost:8081/foto/solare.jpg
    */

    var aux = __dirname.split('src');
    console.log(req.params.image);

    
    var fd = fs.createWriteStream(path.join(aux[0],"uploads",req.params.image),{
        flags: "w+",
        encoding: "binary"
    });

    fd.write(req.body);
    fd.end();
    fd.on("close",() =>{
        res.send("Subiendo foto");
    });
});



let server = app.listen(process.env.PORT || 8081, function (err) {
    if(err){
        console.log(err);
    }
    console.log("Escuchando en el Puerto 8081");
});