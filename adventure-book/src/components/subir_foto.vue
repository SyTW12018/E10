<style scoped>

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
  width: inherit;
  font-size: 1.2rem;
  text-align: center;
  padding: 70px;
}
.dropzone .progress-bar {
  text-align: center;
  padding: 60px 10px;
}
.input-field {
  left: 0;
  top: 0;
  position: absolute;
  background-color: red;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.delete {
  width: 10px;
  height: 10px;
  background-color: blueviolet;
}

.fondo {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0,.7);
  display: table;
}
.cuadrado {
  display: table-cell;
  vertical-align: middle;
}
.contenedor {

  width: 50%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  text-align:center;
  background-color: white;
  color: #54c2c3;
  font-weight: bold;
  font-size: 14px;
  border-width: 2px;
  border: solid white;
  margin-top: 20px;
}
.error{
  color: red;
  font-weight: normal;
}

@media (max-width: 720px) {
  .contenedor{
    width: 90%;
  }
  
}

</style>

<template>
  <div class="fondo">
    <div class="cuadrado">
      <div class="contenedor">
        <b-row>
          <b-col>
            <h3> Subir una foto </h3>
          </b-col>
          <b-col cols="1">
            <img @click="close()" src="../close.png" alt="cerrar">
          </b-col>
        </b-row>
        <form @submit.prevent="sendFiles" enctype="multipart/form-data" class="w-100">
          <b-row class="w-100">
            <div class="dropzone w-100" >
              <input multiple type="file" ref="files" class="input-field" @change="selectFile">

              <p v-if="!uploading" class="call-to-action">Arrasta tus archivos</p>
              <p v-if="uploading" class="progress-bar">
                <progress class="progress is-primary" :value="progress" max="100">{{progress}}%</progress>
              </p>
            </div>
          </b-row>

          <div class="field">
            <div v-for="(file, index) in files" :key="index" class="level">
              <div class="level-left">
                <div class="level-item">
                  {{file.name}}
                  <span v-if="file.invalidMsg">&nbsp;- {{file.invalidMsg}}</span>
                </div>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <a @click.prevent="files.splice(index,1);uploadFiles.splice(index,1)" class="delete">X</a>
                </div>
              </div>
            </div>
          </div>
          <br>
          <b-row align-h="between">
            <b-col cols="4">
              <b-form-select v-model="place_" :options="options" >
		            <template slot="first">
                  <option :value="null" disabled> Lugar </option>
                </template>
              </b-form-select>
            </b-col>
            <b-col cols="3">
              <div>
                <button @onclick="sendFiles">Subir fotos</button>
              </div>
            </b-col>
          </b-row>
          <p class="error"> {{ error_ }} </p>
        </form>
      </div>
    </div>
</div>

</template>


<script>
import _ from 'lodash';
import Foto from './Require_photo.vue'
export default {
  data: function() {
    return {
      place_: null,
      options: [
        { value: '0', text: 'Andalucía' },
        { value: '1', text: 'Aragón' },
        { value: '2', text: 'Cantabria' },
        { value: '3', text: 'Castilla la Mancha'},
        { value: '4', text: 'Castilla y León'},
        { value: '5', text: 'Cataluña'},
        { value: '6', text: 'Ceuta'},
        { value: '7', text: 'Comunidad de Madrid'},
        { value: '8', text: 'Comunidad Foral de Navarra'},
        { value: '9', text: 'Comunidad Valenciana'},
        { value: '10', text: 'Extremadura'},
        { value: '11', text: 'Galicia'},
        { value: '12', text: 'Islas Baleares'},
        { value: '13', text: 'Islas Canarias'},
        { value: '14', text: 'La Rioja'},
        { value: '15', text: 'Melilla'},
        { value: '16', text: 'Pais Vasco'},
        { value: '17', text: 'Principado de Asturias'},
        { value: '18', text: 'Región de Murcia'}
      ],

      user_: JSON.parse(localStorage.getItem("user")),
      name: JSON.parse(localStorage.getItem("user")).name,
      mail: JSON.parse(localStorage.getItem("user")).mail,
      files: [],
      uploadFiles: [],
      error: false,
      err_msg: "",
      uploading: false,
      uploadedFiles: [],
      progress: 0,
      groups: [],
      sitios_visitados_fotos:[],
      error_: "",

    };
  },
  methods: {
    close(){
        this.$router.push('/userboard/');
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
      this.error_ = "";
      if (this.uploadFiles.length == 0) {
        this.error_ = "No hay ningún archivo que subir";
        return "";
      }
      else if(this.place_ == null)
      {
        this.error_ = "Selecciona un lugar";
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
      console.log(this.place_);
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
  components: {
    Foto
  }
};
</script>
