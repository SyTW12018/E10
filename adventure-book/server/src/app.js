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


Mongoose.connect('mongodb://localhost:27017/test');
var app = express()
app.use(morgan('combined'))

app.use(bodyParse.urlencoded({
    extended:true
}));
app.use(bodyParse.json())
//control de acceso (CORS)
app.use(cors())


// Entender esta vaina ///
var Schema = Mongoose.Schema;
var UserDataSchema = new Schema({
        name: String,
        password: String
}, {collection: 'user-data'});
///////////////////////////////

var UserData = Mongoose.model('UserData',UserDataSchema);

var SiteDataSchema = new Schema({
    name: String,
    author: String,
    photos: String
}, {collection: 'site-data'});

var SiteData = Mongoose.model('SiteData',SiteDataSchema);



app.get('/', (req, res) => {
    var directorio = __dirname
    var aux = __dirname.split('server')
    console.log(aux[0])
    res.sendFile(aux[0] + '/client/' + 'index.html')
})

app.post('/registrar', (req, res) => {
    var aux = req.url.split('?')
    var user = aux[1].split('=')
    var pass = aux[2].split('=')
    userr = user[1]
    passw = pass[1] 

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
    var aux = req.url.split('?');
    var user = aux[1].split('=');
    var pass = aux[2].split('=');
    userr = user[1];
    passw = pass[1];

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

app.post('/foto',function(req,res){
    console.log(req.body);
    res.send("Subiendo foto");
});



let server = app.listen(process.env.PORT || 8081, function (err) {
    if(err){
        console.log(err);
    }
    console.log("Escuchando en el Puerto 8081");
});