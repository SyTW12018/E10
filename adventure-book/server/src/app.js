"use strict";
var express = require("express");
var bodyParse = require("body-parser");
var cors = require("cors");
var morgan = require("morgan");
var Mongoose = require("mongoose");
//requires to authorization
const config = require("./config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var path = require("path");
var fs = require("fs");
//to upload files
const multer = require("multer");
const sharp = require("sharp");
var sys = require("sys");
var exec = require("child_process").exec;
var fs = require("fs");

Mongoose.connect("mongodb://localhost:27017/test");
//Mongoose.connect('mongodb://sergioDev:sergio123@172.16.107.2:27017/test');
Mongoose.set("useFindAndModify", false);
var app = express();
app.use(
  "/uploads",
  express.static(path.join("/home/sergio/E10/adventure-book", "uploads"))
);
app.use(morgan("combined"));

app.use(
  bodyParse.urlencoded({
    extended: true
  })
);
app.use(bodyParse.json());
//control de acceso (CORS)
app.use(cors());

/* Creando los esquemas de los datos */
var Schema = Mongoose.Schema;

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

var PlaceDataSchema = new Schema(
  {
    place: String,
    content: [{ user_id: String, photo: Array, date: Date }],
    date: { type: Date, default: Date.now }
  },
  { collection: "placeData" }
);
var PlaceData = Mongoose.model("PlaceData", PlaceDataSchema);

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




/*var comunidades = ['ANDALUCIA','ARAGÓN','PRINCIPADO DE ASTURIAS','ISLAS BALEARES','PAIS VASCO','ISLAS CANARIAS',
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

app.get("/", (req, res) => {
  var directorio = __dirname;
  var aux = __dirname.split("server");
  console.log(aux[0]);
  res.sendFile(aux[0] + "/client/" + "index.html");
});

app.post("/signup", (req, res) => {
  /*curl -X POST -H 'Content-Type: application/json' --data '{"name":"sergio","pass":"12345"}' http://localhost:8081/registrar*/
  
  //Check that the mail is not in the database because we could not have two equal emails
  UserData.findOne({ mail: req.body.mail }, (err, user_found) => {
    if(err){
      return res.status(500).send("Hubo un problema en el registro de usuario");
    }

    if (user_found) {
      console.log("Usuario ya registrado");
      return res.status(500).send("Usuario ya registrado");
    } 
    else {
      //Introducing the user data into de schema in order to introduce it into the database
      var data = new UserData({
        name: req.body.name,
        password: bcrypt.hashSync(req.body.pass, 8),
        mail: req.body.mail
      });


      //Introducing the user in our database
      data.save().then(function(info, err) {
        if (err) {
          console.log("error 1");
          return res.status(500).send("Hubo un problema en el registro de usuario");
        }

        //If the user is registered successfully we create his token
        UserData.findOne({ mail: data.mail }, function(err, user) {
          if (err) {
            console.log("error 2");
            console.log(err);
            return res.status(500).send("Problema para encontrar el usuario");
          }
          //create the authentication token for the user with the jwt package
          //the token expires in 24 hours -> 86400seconds
          let token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400
          });

          res.status(200).send({ auth: true, token: token, user: user });
        });
      });
    }
  });
});




app.post("/login", (req, res) => {
  console.log(req.body.mail);
  console.log(req.body.pass);
  UserData.findOne({ mail: req.body.mail }, function(err, user) {
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

    console.log("vamos a mostrar el password valid");
    //Useing bcrypt to compare our hashed password with the user supplied password
    let passwordIsValid = bcrypt.compareSync(req.body.pass, user.password);
    console.log(passwordIsValid);

    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null });
    }
    //create the authentication token for the user with the jwt package
    //the token expires in 24 hours -> 86400seconds
    let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 10 });

    res.status(200).send({ auth: true, token: token, user: user });
  });
});

app.post("/waiting", (req, res) => {
  var token = req.body.token;
  if (token == null || token == "undefined") {
    console.log(token);
    console.log("usuario sin token");
    res.send({ path: "/login" });
  } else {
    res.status(200).send({ path: "/userboard" }); //Aqui hay que pasar el user
  }
});

/*await fs.readdirSync(dir + "/" + doc.visited_places[i]).forEach(function(file){
                                response.push(dir + "/" + doc.visited_places[i] + "/" + file) //Esto es lo que necesito para 
                                //devolver todas las fotos de un sitio
                                });*/

app.get("/userboard/:mail", async (req, res) => {
  var aux = [];
  var response = [];

  await UserData.findOne({ mail: req.params.mail }, async function(err, doc) {
    //Server error
    if (err) {
      console.log(err);
      return res.status(500).send("Problema para encontrar el usuario");
    }

    var dir = __dirname.split("server")[0] + "static/uploads/" + doc._id;
    var exit = 0;
    var i = 0;

    if(doc.visited_places.length != 0){
      while (exit == 0 && i < doc.visited_places.length) {
        console.log("i = " + i + "  visit: " + doc.visited_places[i])
        try {
          await PlaceData.find({place: doc.visited_places[i].toUpperCase(),"content.user_id": doc._id}, function(err, docs){
              if (err) {
                return res.status(500).send("Problema para encontrar el usuario");
              } 
              else if (docs == null) {
                exit = 1;
                console.log("docs es null");
              } 
              else {
                try {
                  var all_files = fs.readdirSync(dir + "/" + doc.visited_places[i]);
                  if (all_files.length == 0) {
                    console.log("Sin foto");
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
                      function(err, docs) {
                        if (err == null) {
                          console.log(
                            "Modificando registro de visited_places porque la carpeta no está creada"
                          );
                        } else {
                          console.log("Hubo un error");
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
    
  });
});


app.post("/follow_Wished/:mail/:place", (req, res) => {
  UserData.findOneAndUpdate({ name: req.params.mail }, { $push: { wished_places: req.params.place } },
    function(err, doc) {
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



/*app.post("/sites/:place", async (req, res) => {
  var visited_place = req.params.place.toUpperCase();
  var response = [];
  try {
    await PlaceData.findOne({ place: visited_place }, function(err, doc) {
      response = doc.content;
    });
  } 
  catch (err) {
    console.log(err);
  }

  res.send(response);
});
*/


const fileFilter = function(req, file, cb) {
  const allowedType = ["image/jpeg", "image/png", "image/gif"];

  if (!allowedType.includes(file.mimetype)) {
    const error = new Error("Tipo de archivo no permitido");
    error.code = "LIMIT_FILE_TYPES";
    return cb(error, false);
  }
  cb(null, true);
};

const MAX_SIZE = 20000000;
const upload = multer({
  dest: "./uploads/",
  fileFilter,
  limits: {
    fileSize: MAX_SIZE
  }
});

app.post("/upload/:mail/:place", upload.array("files"), async (req, res) => {
  var files_ = [];
  var aux_ = __dirname.split("server");
  var in_visited_places = false;
  var visited_place = req.params.place.toUpperCase();
  var user_monid = ""

  try {
    await UserData.findOne({ mail: req.params.mail }, function(err, doc) {
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
      function(err, doc) {
        console.log(err);
      }
    );
  }

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
        function(err, doc) {
          console.log(err);
        }
      );
    }
  } catch (err) {
    res.status(428).json({ err });
  }

  try {
    PlaceData.findOne({ place: visited_place }, function(err, doc) {
      if (doc == null) {
        //El lugar no existe y se crea
        UserData.findOne({ mail: req.params.mail }, function(err, doc) {
          var data = new PlaceData({
            place: visited_place,
            content: [{ user_id: doc._id, photo: files_, date: new Date() }],
            date: new Date()
          });
          data.save(); /*.then(function() {
                PlaceData.findOne({ author_name: req.params.name }, function(err, doc) {
                console.log(err);
                });
            });*/
        });
      } 
      else {
        UserData.findOne({ mail: req.params.mail }, function(err, doc) {
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
            function(err, doc) {
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


app.post("/delete_Wished/:mail/:place", (req, res) => {
  UserData.findOneAndUpdate(
    { mail: req.params.mail },
    { $pull: { wished_places: req.params.place } },
    function(err, doc) {
      console.log("Modificando registro ...");
      console.log(doc); //Esto si funciona perfecto
    }
  );
  res.send(200);
});


app.post("/delete_Visited/:mail/:place", (req, res) => {
  console.log(req.params.place);
  UserData.findOneAndUpdate(
    { mail: req.params.mail },
    { $pull: { visited_places: req.params.place } },
    function(err, doc) {
      console.log("Modificando registro ...");
      console.log(doc); //Esto si funciona perfecto
    }
  );
  res.status(200);
});


app.post("/delete_Photo/:mail/:place/:photo", (req, res) => {
  fs.unlinkSync(
    __dirname.split("server")[0] +
      "static//uploads/" +
      req.params.mail +
      "/" +
      req.params.place.toUpperCase() +
      "/" +
      req.params.photo
  );
  UserData.findOneAndUpdate(
    { mail: req.params.mail },
    { $pull: {
        uploadsphotos:
          __dirname.split("server")[0] +
          "static/uploads/" +
          req.params.mail +
          "/" +
          place_ +
          "/" +
          req.params.photo
      }
    },
    function(err, doc) {
      console.log("Borrando foto ...");
      console.log(doc); //Esto si funciona perfecto
    }
  );
  res.status(200);
});



app.post("/add_group/:author_name/:place/:date_ini/:date_fini/", async (req, res) => {
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


//añadir el usuario a un grupo
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


app.get("/wished_groups/:mail/", (req, res) => {
  console.log("Entra en el sitios deseados")
  var response = [];
  var aux = {};
  try{
    UserData.findOne({ mail: req.params.mail }, async function(err, doc) {
      for (var i = 0; i < doc.wished_places.length; i++) {
        try {
          await GroupTravel.find({ place: doc.wished_places[i] }, function(err, docs){
            if (docs != null) {

              Object.assign(aux,{place: doc.wished_places[i]});
              Object.assign(aux,{numero_fechas: docs.length});
              Object.assign(aux,{base: true})
              Object.assign(aux,{fecham: false})
              
              var date_array = []
              for(var i = 0; i<docs.length; i++){
                console.log(docs[i])
                var date_ = {}
                Object.assign(date_, {camuflado: false})
                Object.assign(date_, {fecha:docs[i].date_ini})
                Object.assign(date_, {fecha_f: docs[i].date_fini})
                Object.assign(date_, {personas:docs[i].members.length})
                Object.assign(date_, {members:docs[i].members})
                Object.assign(date_, {id: docs[i]._id})
                date_array.push(data_)
              }
              Object.assign(aux, {date: date_array})
              console.log("aux: ")
              console.log(aux)
              aux.push(docs); //Aqui devulevo los grupos que existen que sean al lugar que el user tenga como deseados
            }
          });
        } 
        catch (err) {
          console.log(err);
        }
        response.push(aux)
      }
      //ESTO A VECES FUNCIONA, ES MAGIA    
    });
    res.send(response);
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
      console.log(docs)
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

app.get("/comprobar", (req, res) => {

  UserData.findOne({ mail: req.body.mail }, function(err, docs) {
    if (docs == null) {
      console.log("documento:" + docs);
      res.send(docs);
    } else {
      console.log("documento:" + docs);
      res.send(docs);
      //res.send("Usuario está registrado");
    }
  });
});



app.post("/change_name/:new/:mail", async(req, res) => {
  UserData.findOneAndUpdate(
    { mail: req.params.mail },
    { $set: { name: req.params.new } },
    function(err, docs) {
      console.log("Aquí se actualiza el nombre de usuario");
    }
  );
  res.send(200);
});


app.post("/change_pass/:new/:mail", async(req, res) => {

  var pass = "";
  try{
    await UserData.findOneAndUpdate(
    { mail: req.params.mail },
    { $set: { password: bcrypt.hashSync(req.params.new, 8) } },
    function(err, docs) {
      pass = docs.password;
      console.log("Aquí se actualiza la pass de usuario");
    }
  );
  res.send(pass);
  }catch(err){};
});


app.get("/sites/:place", async (req, res) => {
  
  var response = [];
  try {
    await PlaceData.findOne({ place: req.params.place}, function(err, doc) {
      response = doc.content;
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
    await UserData.findOne({ _id: req.params.user_id}, function(err, doc) {
      response = doc.name;
    });
    res.send(response);
  } 
  catch (err) {
    console.log(err);
  }
});


let server = app.listen(process.env.PORT || 8081, function(err) {
  if (err) {
    console.log(err);
  }
  console.log("Escuchando en el Puerto 8081");
});
