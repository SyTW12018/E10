/**
  * Desarrollado para la asignatura de "Sistema y tecnologías web"
  * de 4to de Grado en Ingenería Informática
  * de la Universidad de La Laguna - ULL (España)
  * 
  * @fileoverview Fichero que forma la Api Rest de nuestra web
  * 
  * @author       Sergio Del Pino Hernández
  * @author       Juan Carlos González Pascolo
  * @author       Pedro Antonio Lima Adrián
  * @author       Ana Beatriz Gil González
  * @author       Marta Mireia Scholz Díaz
  * 
  * @version      1.0.0
  * 
  * @requires     mongodb
  * @requires     npm
 */

"use strict";
/**
  * Módulos para el servidor y la base de datos
  * @requires      express
  * @requires      bodyParse
  * @requires      cors
  * @requires      morgan
  * @requires      mongoose
  * @requires      connect-history-api-fallback
 */
var express = require("express");
const serveStatic = require("serve-static")
var bodyParse = require("body-parser");
var cors = require("cors");
var morgan = require("morgan");
var Mongoose = require("mongoose");
var history = require("connect-history-api-fallback")
/**
  * Módulos para la autentificación y el registro
  * @requires      config
  * @requires      bcrypt
  * @requires      jwt
  * @requires      path
  * @requires      fs
 */
const config = require("./config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var path = require("path");
var fs = require("fs");
/**
  * Módulos para subir archivos en binarios
  * @requires      multer
  * @requires      sharp
 */
const multer = require("multer");
const sharp = require("sharp");


/**
  * @summary       Conexión a la base de datos
  * @requires      mongoose.connect
 */
//Mongoose.connect("mongodb://localhost:27017/test");
Mongoose.connect("mongodb://admin_ab:admin_ab5@ds261644.mlab.com:61644/heroku_s165j89l")

//revisar app.use
//Mongoose.connect('mongodb://sergioDev:sergio123@172.16.107.2:27017/test');
Mongoose.set("useFindAndModify", false);
var app = express();
app.use(history());
app.use(express.static(__dirname + "/dist/"))
//app.use("/", serveStatic(path.join(__dirname,'/dist')))
app.use("/uploads", express.static(path.join("/home/sergio/E10/adventure-book", "uploads")));
app.use(morgan("combined"));
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());
//control de acceso (CORS)
app.use(cors());

/**
  * @summary       Crear esquemas de la base de datos
  * @requires      mongoose.Schema
  * @requires      mongoose.model
 */
var Schema = Mongoose.Schema;

/**
  * @summary       Esquema de la coleción de usuarios
  * @requires      collection userData
  * @param         name                   {String}        Nombre del usuario
  * @param         password               {String}        Contraseña del usuario
  * @param         mail                   {String}        Correo electrónico del usuario
  * @param         visited_places         {Array}         Sitios visitados por el usuario
  * @param         wished_places          {Array}         Sitios deseados por el usuario
  * @param         uploadsphotos          {Array}         Fotos subidas por el usuario
  * @param         GroupTravel            {Array}         Grupos de viaje del usuario
 */
var UserDataSchema = new Schema(
  {
    name: String,
    password: String,
    mail: String,
    visited_places: Array,
    wished_places: Array,
    uploadsphotos: Array,
    groupsTravel: Array
  },
  { collection: "userData" }
);
var UserData = Mongoose.model("UserData", UserDataSchema);

/**
  * @summary       Esquema de la coleción de lugares
  * @requires      collection placeData
  * @param         place                  {String}        Nombre del lugar
  * @param         content                {Array}         Vector de contenido del lugar
  *                content.user_id        {String}        ID del usuario
  *                content.photo          {String}        Foto del lugar
  *                content.date           {Date}          Fecha de subida de la foto
 */
var PlaceDataSchema = new Schema(
  {
    place: String,
    content: [{ user_id: String, photo: Array, date: Date }],
    date: { type: Date, default: Date.now }
  },
  { collection: "placeData" }
);
var PlaceData = Mongoose.model("PlaceData", PlaceDataSchema);


/**
  * @summary       Esquema de la coleción de los gurpos de viaje
  * @requires      collection groupTravelData
  * @param         place                  {String}        Nombre del lugar
  * @param         members                {Array}         Miembros del grupos de viaje
  * @param         author_name            {String}        Nombre del creador del grupo de viaje
  * @param         comments               {Array}         Comentarios del grupo de viaje
  * @param         wished_places          {Array}         Sitios deseados por el usuario
  * @param         photos                 {String}        Foto del grupo de viaje
  * @param         date                   {Date}          Fecha del grupo de viaje del usuario
 */
var GroupTravelSchema = new Schema(
  {
    place: String,
    members: Array,
    author_name: String,
    photo: String,
    date_ini: Date,
    date_fini: Date
  },
  { collection: "groupTravelData" }
);
var GroupTravel = Mongoose.model("groupTravelData", GroupTravelSchema);

/**
  * @summary       Código a ejecutar cuando estemos en producción para crear la base de datos de los lugares por defecto
  * @requires      SitesData
  * @param         comunidades  {Array}   Vector de String con los nombres de los lugares
 */
/*
var comunidades = ['ANDALUCIA','ARAGÓN','PRINCIPADO DE ASTURIAS','ISLAS BALEARES','PAIS VASCO','ISLAS CANARIAS',
                    'GALICIA','LA RIOJA','CANTABRIA',
                    'CASTILLA Y LEÓN','CATALUÑA','COMUNIDAD VALENCIANA',
                    'CASTILLA LA MANCHA','EXTREMADURA','REGIÓN DE MURCIA','COMUNIDAD DE MADRID',
                    'CEUTA','MELILLA','COMUNIDAD FORAL DE NAVARRA'];

comunidades = comunidades.sort();
console.log(comunidades)


for(var i = 0; i < comunidades.length; i++){   

  var data = new PlaceData({
    place: i,
    content: [{ user_id: "", photo: [], date: new Date() }],
    date: new Date(),
  });
    data.save()
}*/

async function seek_places (docs, response, options){
  var in_response = false
  var aux = {}  

  for(var j = 0; j< response.length; j++){
    if(docs.place == response[j].place){
      in_response = true;

      response[j].numero_fechas = response[j].numero_fechas + 1
      var date_ = {};
      Object.assign(date_, {camuflado: false})
      Object.assign(date_, {fecha: docs.date_ini.toLocaleDateString('es-ES', options)})
      Object.assign(date_, {fecha_f: docs.date_fini.toLocaleDateString('es-ES', options)})
      Object.assign(date_, {personas:docs.members.length})
      Object.assign(date_, {members:docs.members})
      Object.assign(date_, {id: docs._id})
      response[j].date.push(date_)      
    }
  }

  if(in_response == false){
    aux = {}
    Object.assign(aux,{place: docs.place});
    Object.assign(aux,{numero_fechas: 1})
    Object.assign(aux,{base: true})
    Object.assign(aux,{fecham: false})

    var date_ = {}
    Object.assign(date_, {camuflado: false})
    Object.assign(date_, {fecha: docs.date_ini.toLocaleDateString('es-ES', options)})
    Object.assign(date_, {fecha_f: docs.date_fini.toLocaleDateString('es-ES', options)})
    Object.assign(date_, {personas:docs.members.length})
    Object.assign(date_, {members:docs.members})
    Object.assign(date_, {id: docs._id})

    var date_array = []
    date_array.push(date_)
    Object.assign(aux, {date: date_array})
    response.push(aux)
    aux = {}
  }
  
  return response
}

/*Here start de application*/

app.get(/.*/, function(req,res) {
  res.sendFile(__dirname + "/dist/index.html")
})


app.get("/", (req, res) => {
  /*var directorio = __dirname;
  var aux = __dirname.split("server");
  console.log(aux[0]);
  res.sendFile(aux[0] + "/client/" + "index.html");
  */
 res.sendFile(__dirname + "/dist/index.html")
});

/**
  * @summary       Función de registro
  *                1-Comprobar que no hayan dos emails iguales
  *                2-Crear el registro de la base de datos con su contraseña cifrada
  *                3-Guardar el usurio en la base de datos
  *                4-Crear token con 24 horas de duración si se registra correctamente
  * @requires      UserData
  * @param         req.body.mail  {String}  Email recogido en Front-End
 */
app.post("/signup", (req, res) => {
  //1
  UserData.findOne({ mail: req.body.mail }, (err, user_found) => {
    if (err) {
      return res.status(500).send("Hubo un problema en el registro de usuario");
    }

    if (user_found) {
      return res.status(500).send("Usuario ya registrado");
    }
    else {
      //2
      var data = new UserData({
        name: req.body.name,
        password: bcrypt.hashSync(req.body.pass, 8),
        mail: req.body.mail
      });


      //3
      data.save().then(function (info, err) {
        if (err) {
          return res.status(500).send("Hubo un problema en el registro de usuario");
        }

        //4
        UserData.findOne({ mail: data.mail }, function (err, user) {
          if (err) {
            return res.status(500).send("Problema para encontrar el usuario");
          }
          let token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400
          });
          res.status(200).send({ auth: true, token: token, user: user });
        });
      });
    }
  });
});

/**
  * @summary       Función de inicio de sesión
  *                1-Usuario no encontrado
  *                2-Uso de bcrypt para comparar su contraseña cifrada
  * @requires      UserData
  * @param         req.body.mail  {String}  Email recogido en Front-End
  *                req.body.pass  {String}  Contraseña del usuario
 */
app.post("/login", (req, res) => {
  UserData.findOne({ mail: req.body.mail }, function (err, user) {
    //Error del servidor 
    //try catch??
    if (err) {
      console.log(err);
      return res.status(500).send("Problema para encontrar el usuario");
    }

    //1
    if (!user) {
      return res.status(404).send("Usuario no registrado");
    }

    //2
    let passwordIsValid = bcrypt.compareSync(req.body.pass, user.password);
    console.log(passwordIsValid);

    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null });
    }
    let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 10 });

    res.status(200).send({ auth: true, token: token, user: user });
  });
});

/**
 * @summary       Función de comprobación del token
 *                1-Si es nulo o undefined redirigir a Inicio de sesión
 *                2-Si es correcto permitir acceso
 * @param         req.body.token  {String}  Token del usuario que inicia sesión
*/
app.post("/waiting", (req, res) => {
  var token = req.body.token;
  if (token == null || token == "undefined") {
    console.log(token);
    console.log("usuario sin token");
    res.send({ path: "/login" });
  } else {
    res.status(200).send({ path: "/userboard" });
  }
});

/**
  * @summary       Función para devolver la información del userboard del usuario
  *                1-Devolver todos los lugares visitados
  *                2-Leemos la carpeta de cada lugar para buscar una foto que mostrar
  * @requires      UserData
  * @param         req.body.mail      {String}  Email recogido en Front-End
  *                doc._id            {String}  ID del usuario
  *                doc.visited_places {Array}   Vector de lugares visitados por el usuario
 */
app.get("/userboard/:mail", async (req, res) => {
  var aux = [];
  var response = [];

  await UserData.findOne({ mail: req.params.mail }, async function (err, doc) {
    //Server error
    //try catch??
    if (err) {
      console.log(err);
      return res.status(500).send("Problema para encontrar el usuario");
    }

    var dir = __dirname.split("server")[0] + "static/uploads/" + doc._id;
    var exit = 0;
    var i = 0;

    //1
    if (doc.visited_places.length != 0) {
      while (exit == 0 && i < doc.visited_places.length) {
        console.log("i = " + i + "  visit: " + doc.visited_places[i])
        try {
          await PlaceData.find({ place: doc.visited_places[i].toUpperCase(), "content.user_id": doc._id }, function (err, docs) {
            if (err) {
              return res.status(500).send("Problema para encontrar el usuario");
            }
            else if (docs == null) {
              exit = 1;
              console.log("docs es null");
            }
            else {
              //2
              try {
                var all_files = fs.readdirSync(dir + "/" + doc.visited_places[i]);
                if (all_files.length == 0) {
                  exit = 1;
                }
                else {
                  var url = dir + "/" + doc.visited_places[i] + "/" + all_files[0];
                  aux.push(url.split("adventure-book")[1]);
                  ++i;
                }
              }
              catch (err) {
                console.log(err);
                if (err) {
                  var new_visited_places = doc.visited_places;

                  new_visited_places.splice(i, 1);

                  UserData.findOneAndUpdate(
                    { mail: req.params.mail },
                    { $set: { visited_places: new_visited_places } },
                    function (err, docs) {
                      if (err) {
                        console.log(err);
                      }
                    }
                  );
                  exit = 1;
                }
              }
            }
          }
          );
        }
        catch (err) {
          console.log(err);
        }
      }
      if (exit == 1) {
        return res.status(500).send("Error de inconsistencia");
      } else {
        response.push(doc.visited_places);
        response.push(aux);
        response.push(doc.wished_places);
        const enviar = response;
        res.send(enviar);
      }
    }
    else{
      response.push([])
      response.push([])
      response.push(doc.wished_places);
      res.send(response);
    }

  });
});

/**
  * @summary       Función para añadir un lugar a favoritos
  * @requires      UserData
  * @param         req.params.mail      {String}  Email recogido en Front-End
  *                req.params.place     {String}  Nombre del lugar recogido en Front-End
 */

/*app.post("/follow_Wished/:mail/:place", (req, res) => {
  UserData.findOneAndUpdate({ name: req.params.mail }, { $push: { wished_places: req.params.place } },
    function(err, doc) {

    }
  );
});*/

app.post("/follow_Wished/:mail/:place", (req, res) => {
  UserData.findOneAndUpdate(
    { name: req.params.mail },
    { $push: { wished_places: req.params.place } },
    function (err, doc) {
      if (err == null) {
        console.log("Modificando registro de wished_places");
        res.status(200);
      } else {
        console.log("Hubo un error");
        console.log(err);
      }
    }
  );
});

app.get("/get_wished_place/:mail/", async (req, res) => {  
  try{
    UserData.findOne({mail:req.params.mail}, function(err,doc){
     res.send(doc.wished_places);
    });
  }catch(err){console.log(err)}
});

app.post("/update_wished_place/:mail/:sites", async (req, res) => {
  console.log("dentro del update_wished: " + req.params.sites)
  console.log(req.params.sites);
  try{
    if(req.params.sites != "empty"){
      UserData.findOneAndUpdate({mail:req.params.mail},{wished_places:req.params.sites}, function(err,doc){
        res.send("OK");
      });
    }else{
      UserData.findOneAndUpdate({mail:req.params.mail},{wished_places: []}, function(err,doc){
        res.send("OK");
      });
    }   
  }catch(err){console.log(err)}
});

/*
app.post("/update_wished_place/:mail/", async (req, res) => {
  console.log("dentro del update_wished vacío")
  try{
    if(req.params.sites != undefined){
      UserData.findOneAndUpdate({mail:req.params.mail},{wished_places:req.params.sites}, function(err,doc){
        res.send("OK");
      });
    }
    
  }catch(err){console.log(err)}
});
*/


/**
  * @summary       Función para permitir ciertos formatos en las fotos a subir
  * @constant      fileFilter
  * @constant      allowedType       {Array}   Vector con los formatos posibles para la subida de la foto
  * @param         file.mimetype     {String}  Tipo del archivo subido
  *                cb                             Función callback
 */
const fileFilter = function (req, file, cb) {
  const allowedType = ["image/jpeg", "image/png", "image/gif"];

  if (!allowedType.includes(file.mimetype)) {
    const error = new Error("Tipo de archivo no permitido");
    error.code = "LIMIT_FILE_TYPES";
    return cb(error, false);
  }
  cb(null, true);
};


/**
  * @summary       Estructura de subida de ficheros
  * @constant      MAX_SIZE                 {Number}    Límite de tamaño del archivo subido
  * @constant      upload.dest              {String}    Ruta de subida
  *                upload.fileFilter                    Componente creada para saber si el tipo del archivo subido está permitido
  *                upload.limits.filesize   {Number}    Componente con el MAX_SIZE 
 */
const MAX_SIZE = 20000000;
const upload = multer({
  dest: "./uploads/",
  fileFilter,
  limits: {
    fileSize: MAX_SIZE
  }
});

/**
  * @summary       Función para subir fotos
  *                1-Comprobar si el usuario ya posee ese lugar como visitado, sino añadirlo.
  *                2-Crear rutas y carpetas del directorio del lugar, si fuese necesario, y de las fotos que irian a dicho directorio.
  *                3-Modificar en la base de datos dicha información del usuario tras la subida de las fotos.
  * @requires      PlaceData, UserData
  * @constant      upload
  * @param         req.params.place  {String}     Lugar del que pertenece la foto a subir
  *                req.params.mail   {String}     Email del usuario que sube la foto
  *                doc._id           {String}     ID del usuario
  *                doc.visited_places{Array}      Vector de lugares visitados por el usuario
 */
app.post("/upload/:mail/:place", upload.array("files"), async (req, res) => {
  var files_ = [];
  var aux_ = __dirname.split("server");
  var in_visited_places = false;
  var visited_place = req.params.place.toUpperCase();
  var user_monid = ""
  //1
  try {
    await UserData.findOne({ mail: req.params.mail }, function (err, doc) {
      user_monid = doc._id;
      for (var i = 0; i < doc.visited_places.length; i++) {
        var array_ = doc.visited_places;
        if (array_[i] == visited_place) {
          in_visited_places = true;
          break;
        }
      }
    });
  }
  catch (err) {
    console.log(err);
  }

  if (in_visited_places == false) {
    UserData.findOneAndUpdate(
      { mail: req.params.mail },
      { $push: { visited_places: visited_place } },
      function (err, doc) {
        console.log(err);
      }
    );
  }
  //2
  var dirPath = `${aux_[0]}static/uploads/${user_monid}/${visited_place}`;
  var dirPathWithOut = `${aux_[0]}static/uploads/${user_monid}`;

  if (fs.existsSync(dirPathWithOut) == false) {
    fs.mkdirSync(dirPathWithOut);
    fs.mkdirSync(dirPath);
  } else if (fs.existsSync(dirPath) == false) {
    fs.mkdirSync(dirPath);
  } else {
    console.log("Carpeta ya existente");
  }

  try {
    for (var i = 0; i < req.files.length; i++) {
      var file = req.files[i];
      await sharp(file.path)
        .resize(300, 200)
        .embed()
        .toFile(`${dirPath}/${file.originalname}`);

      fs.unlink(file.path);
      files_.push(`${dirPath}/${file.originalname}`);

      UserData.findOneAndUpdate(
        { mail: req.params.mail },
        { $push: { uploadsphotos: `${dirPath}/${file.originalname}` } },
        function (err, doc) {
          console.log(err);
        }
      );
    }
  } catch (err) {
    res.status(428).json({ err });
  }
  //3
  try {
    PlaceData.findOne({ place: visited_place }, function (err, doc) {
      if (doc == null) {
        //El lugar no existe y se crea
        UserData.findOne({ mail: req.params.mail }, function (err, doc) {
          var data = new PlaceData({
            place: visited_place,
            content: [{ user_id: doc._id, photo: files_, date: new Date() }],
            date: new Date()
          });
          data.save();
        });
      }
      else {
        UserData.findOne({ mail: req.params.mail }, function (err, doc) {
          if (err) {
            console.log("error al encontrar el usuario: " + err);
          }

          PlaceData.findOneAndUpdate(
            { place: visited_place },
            {
              $push: {
                content: {
                  user_id: doc._id,
                  photo: `${dirPath}/${file.originalname}`,
                  date: new Date()
                }
              }
            },
            function (err, doc) {
              if (err) {
                console.log("error al hacer el update" + err);
              }
            }
          );
        });
      }
    });
  } catch (err) {
    return res.status(500).send("Error: " + err);
  }

  res.json({ files: files_ });
});

/**
  * @summary       Función para borrar un lugar deseado
  * @requires      UserData
  * @param         req.params.place  {String}     Nombre del lugar deseado
  *                req.params.mail   {String}     Email del usuario que se apunta a dicho lugar
 */
app.post("/delete_Wished/:mail/:place", (req, res) => {
  UserData.findOneAndUpdate(
    { mail: req.params.mail },
    { $pull: { wished_places: req.params.place } },
    function (err, doc) {
      console.log("Modificando registro ...");
      console.log(doc);
    }
  );
  res.send(200);
});


/**
  * @summary       Función para borrar un lugar visitado
  * @requires      UserData
  * @param         req.params.place  {String}     Nombre del lugar visitado
  *                req.params.mail   {String}     Email del usuario que quiere borrar dicho lugar visitado
 */
app.post("/delete_Visited/:mail/:place", (req, res) => {
  console.log(req.params.place);
  UserData.findOneAndUpdate(
    { mail: req.params.mail },
    { $pull: { visited_places: req.params.place } },
    function (err, doc) {
      console.log("Modificando registro ...");
      console.log(doc);
    }
  );
  res.status(200);
});


app.get("/get_photos_place/:user_id/:place", async (req, res) => {
  var response = [];
  var photos = [];
  var dir = __dirname.split("server")[0] + "static/uploads/" + req.params.user_id + "/" + req.params.place;
  console.log(dir)
  try {
    await PlaceData.findOne({ place: req.params.place }, function (err, doc) {  
      doc.content.forEach(function (content) {
        if (content.user_id == req.params.user_id) {
          console.log(content.photo)
          content.photo.forEach(function (photo) {
            var aux = {
              photo: photo,
              fecha: content.date,
            }
            response.push(aux);
          });
        }
      });
      res.send(response);
    });    
  }
  catch (err) {
    console.log(err);
  }
});



/**
  * @summary       Función para borrar una foto del lugar
  * @requires      UserData
  * @param         req.params.place  {String}     Nombre del lugar deseado
  *                req.params.mail   {String}     Email del usuario que se apunta a dicho lugar
  *                req.params.photo  {String}     Ruta a la foto que se desea borrar
 */
app.post("/delete_Photo/:mail", (req, res) => {
  console.log("entra en delete photo")

  for(var i = 0; i < req.body.delete_array.length; i++){
    try{
      var photoName = __dirname.split("server")[0] + req.body.delete_array[i].src.slice(1)
      try{
        fs.unlinkSync(__dirname.split("server")[0] + req.body.delete_array[i].src.slice(1));
      }
      catch(err){

      }      
      var folderArray = (__dirname.split("server")[0] + req.body.delete_array[i].src.slice(1)).split("/")
      var folderName = ""
      for (var j = 0; j < (folderArray.length - 1); j++){
        folderName += folderArray[j];
        folderName += "/"
      }
      

      UserData.findOne({ mail: req.params.mail }, function (err, doc) {
        if(err){
          console.log(err)
        }
        else{
          PlaceData.findOneAndUpdate({ place: folderArray[folderArray.length - 2] },
            { $pull: {
                content: {
                  user_id: doc._id,
                  photo: photoName
                }
              }
            },
            function (err, doc) {
              if (err) {
                console.log("error al hacer el update" + err);
              }
            }
          );
        }          
      });
      


      fs.readdir(folderName, function(err, files) {
        if (err) {
           // some sort of error
        } 
        else {
           if (!files.length) {
              // directory appears to be empty
              console.log("La carpeta se ha quedado vacía")
              fs.rmdirSync(folderName);

              UserData.findOneAndUpdate(
                { mail: req.params.mail },
                { $pull: { visited_places: folderArray[folderArray.length - 2] }},
                function (err, doc) {
                  console.log("Borrando la carpeta de sitios visitados ...");
                  console.log(doc); //Esto si funciona perfecto
                }
              );

           }
        }
    });
    }
    catch(err){
      console.log(err)
    }
    

    UserData.findOneAndUpdate(
      { mail: req.params.mail },
      { $pull: { uploadsphotos: __dirname.split("server")[0] + req.body.delete_array[i].src.slice(1) }},
      function (err, doc) {
        console.log("Borrando foto ...");
        console.log(doc); //Esto si funciona perfecto
      }
    );
  }
  /*
  fs.unlinkSync(
    __dirname.split("server")[0] +  "static//uploads/" +  req.params.mail +  "/" + req.params.place.toUpperCase() + "/" +
    req.params.photo
  );
  */
  
  res.status(200);
});




/**
  * @summary       Función para añadir un grupo de viaje
  * @requires      UserData, PlaceData
  * @param         req.params.place         {String}     Nombre del lugar 
  *                req.params.author_name   {String}     Autor del grupo de viaje
  *                req.params.name          {String}     Nombre del usuario
  *                req.params.group         {Array}      Información del grupo de viaje
 */
app.post("/add_group/:author_name/:place/:date_ini/:date_fini/", async (req, res) => {
  var aux_ = __dirname.split("server");
  var array_user = [req.params.author_name];
  var photo_group = "";
  var group_id = "";

  try {
    await PlaceData.findOne({ place: req.params.place }, function(err, doc) {
      if(doc != null){
        photo_group = doc.content[0].photo[0];
        console.log("Aqui se añade una foto al grupo...");
      }
      
    });

    var data = new GroupTravel({
      place: req.params.place,
      members: array_user,
      author_name: req.params.author_name,
      photo: photo_group,
      date_ini: req.params.date_ini,
      date_fini: req.params.date_fini
    });  

    await data.save().then(function(group,err) {
      if(err){
        console.log(err)
      }
      else{
        console.log("Ya metió el dato")
        group_id = group._id
      }
    });

    await UserData.findOneAndUpdate({ mail: req.params.author_name }, { $addToSet: { groupsTravel:  group_id.toString()} },
      function(err, doc) {
        
        console.log(group_id)
        if(err){
          console.log(err)
        }
        else{
          console.log(doc)
        }
        console.log("Aqui se añade un grupo a los del user...");
      }
    );
  } 
  catch (err) {
    console.log(err);
  }

  res.send(group_id.toString())  
});


/**
  * @summary       Función para borrar un grupo de viaje
  * @requires      UserData
  * @param         req.params.mail         {String}     Email del usuario 
  *                req.params.group        {Array}      Información del grupo de viaje
 */
app.post("/delete_group/:mail/:group", async (req, res) => {
  try{
    await UserData.findOneAndUpdate(
      { mail: req.params.mail },
      { $pull: { groupsTravel: req.params.group } },
      function(err, doc) {
        console.log("Aqui se elimina un grupo del usuario...");
      }
    );
  
    await GroupTravel.findOneAndUpdate(
      { _id: req.params.group },
      { $pull: { members: req.params.mail } },
      async function(err, doc) {
        if((doc.members.length == 0) || ((doc.members.length == 1) && (doc.members[0] == req.params.mail) )){
          GroupTravel.deleteOne({ _id: Mongoose.Types.ObjectId(req.params.group)}, function(err,docs){
            console.log(docs)
          })
        }        
        console.log("Aqui se elimina un usuario del grupo...");
      }
    );
  }
  catch(err){
    console.log(err)
  }
  
  res.sendStatus(200);
});


/**
  * @summary       Función para seguir a un grupo de viaje
  * @requires      UserData
  * @param         req.params.mail         {String}     Email del usuario 
  *                req.params.group        {Array}      Información del grupo de viaje
 */
app.post("/follow_group/:mail/:group", async (req, res) => {
  try{
    await UserData.findOneAndUpdate(
      { mail: req.params.mail },
      { $addToSet: { groupsTravel: req.params.group } },
      function(err, doc) {
      }
    );
  
    await GroupTravel.findOneAndUpdate(
      { _id: req.params.group },
      { $addToSet: { members: req.params.mail } },
      function(err, doc) {
      }
    );
  }
  catch(err){
    console.log(err)
  }
  
  res.sendStatus(200);
});


/**
  * @summary       Función que devuelve los grupos de viajes de un usuario
  * @requires      UserData, GroupTravel
  * @param         req.params.mail         {String}     Email del usuario 
  *                doc.wished_places       {Array}      Vector de lugares deseados
 */
app.get("/future_trips/:mail/", async (req,res) => {
  console.log("Entra en el future trip")
  var response = [];
  var aux = {};
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  try{
    await UserData.findOne({ mail: req.params.mail }, async function(err, doc) {
      if(err){
        console.log(err)
      }
      else{
        for (var i = 0; i < doc.groupsTravel.length; i++) {
          try {
            await GroupTravel.findOne({ _id: doc.groupsTravel[i] }, async function(err, docs){
              if (docs != null) {
                if(response.length == 0){
                  Object.assign(aux,{place: docs.place});
                  Object.assign(aux,{numero_fechas: 1})
                  Object.assign(aux,{base: true})
                  Object.assign(aux,{fecham: false})

                  var date_ = {}
                  Object.assign(date_, {camuflado: false})
                  Object.assign(date_, {fecha: docs.date_ini.toLocaleDateString('es-ES', options)})
                  Object.assign(date_, {fecha_f: docs.date_fini.toLocaleDateString('es-ES', options)})
                  Object.assign(date_, {personas:docs.members.length})
                  Object.assign(date_, {members:docs.members})
                  Object.assign(date_, {id: docs._id})

                  var date_array = []
                  date_array.push(date_)
                  Object.assign(aux, {date: date_array})
                  response.push(aux)
                  aux = {}
                }
                else{
                  response = await seek_places(docs, response, options)
                }
              }
            });
          }catch(err){
            console.log(err)
          }
        }
      }
      
      res.send(response);
    });
    
  }
  catch(err){
    console.log(err)
  }
  
})


app.get("/wished_groups/:mail/", async (req, res) => {
  console.log("Entra en el sitios deseados")
  var comunidades = ['ANDALUCÍA','ARAGÓN','PRINCIPADO DE ASTURIAS','ISLAS BALEARES','PAIS VASCO','ISLAS CANARIAS',
  'GALICIA','LA RIOJA','CANTABRIA','CASTILLA Y LEÓN','CATALUÑA','COMUNIDAD VALENCIANA','CASTILLA LA MANCHA','EXTREMADURA',
  'REGIÓN DE MURCIA','COMUNIDAD DE MADRID',
  'CEUTA','MELILLA','COMUNIDAD FORAL DE NAVARRA'];
  comunidades = comunidades.sort();
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  var response = [];
  var aux = {};

  try{
    await UserData.findOne({ mail: req.params.mail }, async function(err, doc) {
      if(doc.wished_places.length != 0){
        var sitios_visitados = doc.wished_places[0].split(',')
        for (var j = 0; j < sitios_visitados.length; j++) {
          try {
            await GroupTravel.find({ place: comunidades[parseInt(sitios_visitados[j])] }, function(err, docs){
              if (docs != null) {
                Object.assign(aux,{place: comunidades[parseInt(sitios_visitados[j])]});
                Object.assign(aux,{numero_fechas: docs.length});
                Object.assign(aux,{base: true})
                Object.assign(aux,{fecham: false})
                
                var date_array = []
                for(var i = 0; i<docs.length; i++){
                  var date_ = {}
                  Object.assign(date_, {camuflado: false})
                  Object.assign(date_, {fecha:docs[i].date_ini.toLocaleDateString('es-ES', options)})
                  Object.assign(date_, {fecha_f: docs[i].date_fini.toLocaleDateString('es-ES', options)})
                  Object.assign(date_, {personas:docs[i].members.length})
                  Object.assign(date_, {members:docs[i].members})
                  Object.assign(date_, {id: docs[i]._id})
                  date_array.push(date_)
                }
                Object.assign(aux, {date: date_array})
                response.push(aux)
                aux = {}
              }
            });
          } 
          catch (err) {
            console.log(err);
          }        
        }
        //console.log(response)
        res.send(response);
      }
      else{
        res.send(response)
      }
    });
    
  }
  catch(err){
    console.log(err)
  }
});


app.get("/this_month/:mail", async (req, res) => {
  console.log("entra en el this month")
  var response = [];
  var aux = {};
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  var today = new Date();
  var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);

  try{
    //await GroupTravel.find({$and:[{memebers: {$ne: req.params.mail}}, {date_ini: {"$gte": today, "$lt": lastDayOfMonth}}] }, function(err, docs){
    //await GroupTravel.find({date_ini: {"$gte": today, "$lt": lastDayOfMonth} }, function(err, docs){
    await GroupTravel.find({$and:[{"members":{ "$not":{"$all": [req.params.mail]}}}, {date_ini:{"$gte":today, "$lt": lastDayOfMonth}}]}, function(err, docs){
      if(err){
        console.log(err)
      }

      if (docs != null) {
        for(var i = 0; i < docs.length; i++){
          if(response.length == 0){
            Object.assign(aux,{place: docs[i].place});
            Object.assign(aux,{numero_fechas: 1})
            Object.assign(aux,{base: true})
            Object.assign(aux,{fecham: false})

            var date_ = {}
            Object.assign(date_, {camuflado: false})
            Object.assign(date_, {fecha: docs[i].date_ini.toLocaleDateString('es-ES', options)})
            Object.assign(date_, {fecha_f: docs[i].date_fini.toLocaleDateString('es-ES', options)})
            Object.assign(date_, {personas:docs[i].members.length})
            Object.assign(date_, {members:docs[i].members})
            Object.assign(date_, {id: docs[i]._id})

            var date_array = []
            date_array.push(date_)
            Object.assign(aux, {date: date_array})
            response.push(aux)
            aux = {}
          }
          else{
            var in_response = false
            
            for(var j = 0; j< response.length; j++){
              if(docs[i].place == response[j].place){
                in_response = true;

                response[j].numero_fechas = response[j].numero_fechas + 1
                var date_ = {};
                Object.assign(date_, {camuflado: false})
                Object.assign(date_, {fecha: docs[i].date_ini.toLocaleDateString('es-ES', options)})
                Object.assign(date_, {fecha_f: docs[i].date_fini.toLocaleDateString('es-ES', options)})
                Object.assign(date_, {personas:docs[i].members.length})
                Object.assign(date_, {members:docs[i].members})
                Object.assign(date_, {id: docs[i]._id})
                response[j].date.push(date_)      
              }
            }

            if(in_response == false){
              aux = {}
              Object.assign(aux,{place: docs[i].place});
              Object.assign(aux,{numero_fechas: 1})
              Object.assign(aux,{base: true})
              Object.assign(aux,{fecham: false})

              var date_ = {}
              Object.assign(date_, {camuflado: false})
              Object.assign(date_, {fecha: docs[i].date_ini.toLocaleDateString('es-ES', options)})
              Object.assign(date_, {fecha_f: docs[i].date_fini.toLocaleDateString('es-ES', options)})
              Object.assign(date_, {personas:docs[i].members.length})
              Object.assign(date_, {members:docs[i].members})
              Object.assign(date_, {id: docs[i]._id})

              var date_array = []
              date_array.push(date_)
              Object.assign(aux, {date: date_array})
              response.push(aux)
              aux = {}
            }
          }
        }
      }
    });
    res.send(response)
  }
  catch(err){
    console.log(err);
  }
})


app.get("/all_groups/:mail", async (req, res) => {
  console.log("entra en el todos los grupos")
  var response = [];
  var aux = {};
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  var today = new Date();
  var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);

  try{
    await GroupTravel.find({$and:[{"members":{ "$not":{"$all": [req.params.mail]}}}, {date_ini:{"$gte": lastDayOfMonth}}]}, function(err, docs){
    //await GroupTravel.find({ $and: [{date_ini: {"$gte": lastDayOfMonth}}, {memebers: {$ne: req.params.mail} }] }).sort({'date': -1}).limit(5).exec(function(err, docs){
    //await GroupTravel.find({date_ini: {"$gte": lastDayOfMonth}}).sort({'date': -1}).limit(5).exec(function(err, docs){
    if(err){
      console.log(err)
    }

      if (docs != null) {
        for(var i = 0; i < docs.length; i++){
          if(response.length == 0){
            Object.assign(aux,{place: docs[i].place});
            Object.assign(aux,{numero_fechas: 1})
            Object.assign(aux,{base: true})
            Object.assign(aux,{fecham: false})

            var date_ = {}
            Object.assign(date_, {camuflado: false})
            Object.assign(date_, {fecha: docs[i].date_ini.toLocaleDateString('es-ES', options)})
            Object.assign(date_, {fecha_f: docs[i].date_fini.toLocaleDateString('es-ES', options)})
            Object.assign(date_, {personas:docs[i].members.length})
            Object.assign(date_, {members:docs[i].members})
            Object.assign(date_, {id: docs[i]._id})

            var date_array = []
            date_array.push(date_)
            Object.assign(aux, {date: date_array})
            response.push(aux)
            aux = {}
          }
          else{
            var in_response = false
            
            for(var j = 0; j< response.length; j++){
              if(docs[i].place == response[j].place){
                in_response = true;

                response[j].numero_fechas = response[j].numero_fechas + 1
                var date_ = {};
                Object.assign(date_, {camuflado: false})
                Object.assign(date_, {fecha: docs[i].date_ini.toLocaleDateString('es-ES', options)})
                Object.assign(date_, {fecha_f: docs[i].date_fini.toLocaleDateString('es-ES', options)})
                Object.assign(date_, {personas:docs[i].members.length})
                Object.assign(date_, {members:docs[i].members})
                Object.assign(date_, {id: docs[i]._id})
                response[j].date.push(date_)      
              }
            }

            if(in_response == false){
              aux = {}
              Object.assign(aux,{place: docs[i].place});
              Object.assign(aux,{numero_fechas: 1})
              Object.assign(aux,{base: true})
              Object.assign(aux,{fecham: false})

              var date_ = {}
              Object.assign(date_, {camuflado: false})
              Object.assign(date_, {fecha: docs[i].date_ini.toLocaleDateString('es-ES', options)})
              Object.assign(date_, {fecha_f: docs[i].date_fini.toLocaleDateString('es-ES', options)})
              Object.assign(date_, {personas:docs[i].members.length})
              Object.assign(date_, {members:docs[i].members})
              Object.assign(date_, {id: docs[i]._id})

              var date_array = []
              date_array.push(date_)
              Object.assign(aux, {date: date_array})
              response.push(aux)
              aux = {}
            }
          }
        }
      }
      res.send(response)
    });  
  }
  catch(err){
    console.log(err);
  }
})


/**
  * @summary       Manejo de errores en la subida de archivos por formato y tamaño
 */
app.use(function(err, req, res, next) {
  if (err.code === "LIMIT_FILE_TYPES") {
    res
      .status(422)
      .json({ error: "Solo se permiten imágenes jpeg, png y gif" });
    return;
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(422).json({
      error: `Archivo demasiado pesado. Tamaño máximo: ${MAX_SIZE / 1000}kb`
    });
    return;
  }
});


/**
  * @summary       Función de comprobación de usuario
  * @requires      UserData
  * @param         req.body.mail      {String}        Email del usuario  
 */
app.get("/comprobar", (req, res) => {
  UserData.findOne({ mail: req.body.mail }, function (err, docs) {
    if (docs == null) {
      console.log("documento:" + docs);
      res.send(docs);
    } else {
      console.log("documento:" + docs);
      res.send(docs);
    }
  });
});


/**
  * @summary       Función para cambiar el nickname del usuario
  * @requires      UserData
  * @param         req.body.mail      {String}        Email del usuario
  *                req.params.new     {String}        Nuevo nickname para el usuario
 */
app.post("/change_name/:new/:mail", async (req, res) => {
  UserData.findOneAndUpdate(
    { mail: req.params.mail },
    { $set: { name: req.params.new } },
    function (err, docs) {
      console.log("Aquí se actualiza el nombre de usuario");
    }
  );
  res.send(200);
});


/**
  * @summary       Función para cambiar la contraseña del usuario
  * @requires      UserData
  * @param         req.body.mail      {String}        Email del usuario
  *                req.params.new     {String}        Nueva contraseña para el usuario
 */
app.post("/change_pass/:new/:mail", async (req, res) => {
  var pass = "";
  try {
    await UserData.findOneAndUpdate(
      { mail: req.params.mail },
      { $set: { password: bcrypt.hashSync(req.params.new, 8) } },
      function (err, docs) {
        pass = docs.password;
        console.log("Aquí se actualiza la pass de usuario");
      }
    );
    res.send(pass);
  } catch (err) { };
});


/**
  * @summary       Función para devolver toda la información del sitio
  * @requires      PlaceData
  * @param         req.params.place     {String}  Nombre del lugar recogido en Front-End
  *                doc.content          {Array}   Contenido del lugar (Nombre, Autor, Foto, Fecha, etc)
 */
app.get("/sites/:place", async (req, res) => {
  console.log(req.params.place)
  var response = [];
  try {
    await PlaceData.findOne({ place: req.params.place }, function (err, doc) {
      if(err){
        console.log(err);
      }
      else{
        console.log(doc)
        if(doc != null){
          response = doc.content;
        }
      }  
    });
    res.send(response);
  }
  catch (err) {
    console.log(err);
  }
});


app.get("/get_name/:user_id", async (req, res) => {
  var response = [];
  try {
    await UserData.findOne({ _id: req.params.user_id }, function (err, doc) {
      response = doc.name;
      console.log(doc.mail)
    });
    res.send(response);
  }
  catch (err) {
    console.log(err);
  }
});


let server = app.listen(process.env.PORT || 8081, function (err) {
  if (err) {
    console.log(err);
  }
  console.log("Escuchando en el Puerto 8081");
});
