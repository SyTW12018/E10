var express = require('express')
var bodyParse = require('body-parser')
var cors = require('cors')
var morgan = require('morgan')
var Mongoose = require('mongoose');

Mongoose.connect('mongodb://localhost:27017/test');
var app = express()
app.use(morgan('combined'))+

app.use(bodyParse.urlencoded({
    extended:true
}));
app.use(bodyParse.json())
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



app.listen(process.env.PORT || 8081, function (err) {
console.log("Escuchando en el Puerto 8081");
});