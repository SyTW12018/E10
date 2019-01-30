<style scoped>
  body {
    background-color: white !important;
  }
  .main {
    padding: 100px;
    background-color: white;
  }

  .card {
    margin: 0px 8px 8px 0px;
    background-color: #54c2c3;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    text-align: center;
    border-radius: 0px;
  }

  .card:hover {
    background-color: white;
    color: #54c2c3;
  }

  .dropzone {
    min-height: 200px;
    padding: 10px 10px;
    position: relative;
    cursor: pointer;
    outline: 2px dashed grey;
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
  }

  .dropzone:hover {
    background: lightskyblue;
  }

  .dropzone .call-to-action {
    font-size: 1.2rem;
    text-align: center;
    padding: 70px;
  }

  .dropzone .progress-bar {
    text-align: center;
    padding: 60px 10px;
  }

  .input-field {
    opacity: 0;
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .imagen {
    width: 300px;
    height: 200px;
  }

  .delete {
    width: 10px;
    height: 10px;
    background-color: blueviolet;
  }

  .c {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    text-align: left;
  }

  .imagen {
    width: 300px;
    height: 200px;
  }

  .fav1{
    position: relative;
    top:5px;
  }
</style>

<template>
  <div>
    <div class="main">
      <div class="container">
          <router-view></router-view>
        <b-row>
          <b-col cols="9" id="mis_sitios">
            <b-row>
              <b-col>
                <h2>{{ sitios_visitados[0].nombre }}</h2>
              </b-col>
              <b-col cols="1">
                <img @click="upload()" width="20px" src="../upload.png" alt="cerrar">
              </b-col>
            </b-row>

            <b-row>
              <p>{{sitios_visitados[0].descripcion }}</p>
            </b-row>
            <b-row >
              <div v-for="(sitio,index) in sitios_visitados[0].sitios" :key="index">
                <div class="card" style="width: 16rem;" @click="route(sitio.cod)">
                  <img class="card-img-top" :src="sitios_visitados_fotos[index]" alt="Card image">
                  <div class="card-body c">
                    <p class="card-text">{{ sitio.nombre }}</p>
                  </div>
                </div>
              </div>
            </b-row>
          </b-col>

          <b-col id="futuros sitios" class="w-100">
            <b-row>
              <h2>Lugares deseados</h2>
            </b-row>
            <b-row class="w-100">
              <b-list-group class="w-100" >
                <div v-for="sitio in sitios_deseados[0].sitios" :key="sitio">
                  <b-list-group-item class="w-100">
                    <b-row>
                      <b-col cols="10">
                        {{ comunidades[sitio] }}
                      </b-col>
                      <b-col cols="2">
                        <img
                          v-bind:id="sitio"
                          class="fav1"
                          @click="fav(sitio)"
                          src="../assets/fav.png"
                          alt="cerrar"
                        >
                      </b-col>
                    </b-row>
                  </b-list-group-item>
                </div>
              </b-list-group>
            </b-row>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>


<script>
import _ from "lodash";
import Foto from "./Require_photo.vue";

export default {
  data: function(){
    return {
      user_: JSON.parse(localStorage.getItem("user")),
      name: JSON.parse(localStorage.getItem("user")).name,
      mail: JSON.parse(localStorage.getItem("user")).mail,
      files: [],
      uploadFiles: [],
      error: false,
      err_msg: "error message",
      uploading: false,
      uploadedFiles: [],
      progress: 0,
      groups: [],
      place_: "",
      sitios_visitados_fotos: [],

      sitios_visitados: [
        {
          nombre: "Mis Sitios",
          descripcion:
            "Aquí aparecerán los lugares en los que has etiquetado tus fotos",
          sitios: []
        }
      ],
      sitios_deseados: [
        {
          nombre: "Mis Sitios",
          descripcion:
            "Tus lugarea deseados son aquellos destinos a los que deseas viajar próximamente. Añade ",
          sitios: [],
          quitar: [],
        }
      ],

      comunidades : ["Andalucía","Aragón","Cantabria","Castilla la Mancha","Castilla y León","Cataluña","Ceuta","Comunidad de Madrid",
                     "Comunidad Foral de Navarra","Comunidad Valenciana","Extremadura","Galicia","Islas Baleares","Islas Canarias",
                     "La Rioja","Melilla","Pais Vasco","Principado de Asturias","Región de Murcia"],


    }

  },

  methods: {
    fav(cod) {
      if (document.getElementById(cod).src == require("../assets/fav.png")) {
        // Quitar el sitio con codigo cod de sitios deseados
        this.sitios_deseados[0].quitar.push(cod);
        document.getElementById(cod).src = require("../assets/unfav.png");
      }
      else if (document.getElementById(cod).src == require("../assets/unfav.png")) {
        // Poner el sitio con codigo cod en sitios deseados
        var index = this.sitios_deseados[0].quitar.indexOf(cod);
        if (index !== -1) this.sitios_deseados[0].quitar.splice(index, 1);

        document.getElementById(cod).src = require("../assets/fav.png");
      }
      console.log(this.sitios_deseados[0].quitar)
    },

    upload(){
        this.$router.push('/userboard/upload');
        this.subir_foto = 1;
    },

    route(lugar){
        this.$router.push('/userboard/' + lugar);
    },

    selectFile() {
      //Upload multiple files
      const files = this.$refs.files.files;
      this.uploadFiles = [...this.uploadFiles, ...files];

      this.files = [
        ...this.files,
        ..._.map(files, file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          invalidMsg: this.validate(file)
        }))
      ];
    },

    validate(file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const MAX_SIZE = 2000000;

      if (file.size > MAX_SIZE) {
        return "Tamaño máximo: ${MAX_SIZE/1000}kb";
      }

      if (!allowedTypes.includes(file.type)) {
        return "No es una imagen en jpeg, png o gif";
      }

      return "";
    },

    async sendFiles() {
      if (this.uploadFiles.length == 0) {
        this.err_msg = "No hay ningún archivo que subir";
        return "";
      }

      /*
          Initialize the form data
        */
      const formData = new FormData();
      _.forEach(this.uploadFiles, file => {
        if (this.validate(file) === "") {
          formData.append("files", file);
        }
      });

      var id_user = JSON.parse(localStorage.getItem("user"))._id;

      formData.append("place", this.place_);
      formData.append("user_id", localStorage.getItem("user"));

      try {
        this.uploading = true;
        var url =
          "http://localhost:8081/upload/" + this.mail + "/" + this.place_;
        const res = await this.$http.post(url, formData, {
          onUploadProgress: e =>
            (this.progress = Math.round((e.loaded * 100) / e.total))
        });

        for (var j = 0; j < res.data.files.length; j++) {
          this.uploadedFiles.push(res.data.files[j]);
        }

        this.uploading = false;

        this.files = [];
        this.uploadFiles = [];
      } catch (err) {
        console.log(err);
      }
    }
  },
  async beforeDestroy() {
    console.log("me van a cerrar D:");
    console.log(this.sitios_deseados);

    var update = 0
    for (var i=0; i<this.sitios_deseados[0].quitar.length; i++)
    {
      update = 1;
      var index = this.sitios_deseados[0].sitios.indexOf(this.sitios_deseados[0].quitar[i]);
      if (index !== -1) this.sitios_deseados[0].sitios.splice(index, 1);
    }

    if (update == 1)
    {
      try {
        if(this.sitios_deseados[0].sitios.length > 0){
          console.log("Entra en el if del userboard")
          await this.$http
          .post(
            "http://localhost:8081/update_wished_place/" +
              JSON.parse(localStorage.getItem("user")).mail + "/" + this.sitios_deseados[0].sitios
          )
        }
        else{
          await this.$http
          .post(
            "http://localhost:8081/update_wished_place/" +
              JSON.parse(localStorage.getItem("user")).mail + "/" + "empty"
          )
        }  
      }catch(err){}
    }

  },


  async mounted() {
    this.subir_foto = 0;

    if (
      window.localStorage.getItem("jwt") == null ||
      window.localStorage.getItem("jwt") == "undefined"
    ) {
      this.$router.push("/");
    }
    try {
      await this.$http
        .get("http://localhost:8081/userboard/" + this.mail)
        .then(response => {
          this.user_data = response.data;

          var codigos = response.data[0];
          for (var i=0; i<codigos.length; i++)
          {
            var sitio_visitado = {
                nombre : this.comunidades[codigos[i]],
                cod :    codigos[i]
            };

            this.sitios_visitados[0].sitios.push(sitio_visitado)
          }

          if(response.data[1].length != 0){
            this.sitios_visitados_fotos = response.data[1];
          }
          
          this.sitios_deseados[0].sitios = response.data[2][0].split(',');

        });
    } catch (err) {}


  },

  components: {
  }
};
</script>
