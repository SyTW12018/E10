var express = require('express')
var bodyParse = require('body-parser')
var cors = require('cors')
var morgan = require('morgan')
var Mongoose = require('mongoose');
var path = require("path");
var fs = require("fs");

Mongoose.connect('mongodb://localhost:27017/test');
var app = express()
app.use(morgan('combined'))

app.use(bodyParse.urlencoded({
    extended:true
}));
app.use(bodyParse.json());
app.use(cors());


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
        password: passw
    };
    var data = new UserData(datos);
    data.save().then(function(err){
        res.send({
            message: `Fuiste ${userr} registrado correctamente`
        });
    });
});


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



app.listen(process.env.PORT || 8081,(err) => {
console.log("Escuchando en el Puerto 8081");
});