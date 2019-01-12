<style scoped>
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
</style>

<template>
  <div>
    <h1>Subir una foto</h1>

    <label for="lugar">
      Lugar:
      <input type="text" v-model="place_">
    </label>

    <form @submit.prevent="sendFiles" enctype="multipart/form-data">
      <div class="dropzone">
        <label for="title">Upload Files</label>
        <input multiple type="file" ref="files" class="input-field" @change="selectFile">

        <p v-if="!uploading" class="call-to-action">Arrasta tus archivos</p>
        <p v-if="uploading" class="progress-bar">
          <progress class="progress is-primary" :value="progress" max="100">{{progress}}%</progress>
        </p>
      </div>

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

      <div>
        <button @onclick="sendFiles">Send</button>
      </div>
    </form>

    <div>
      <button @click="log_out">Log Out</button>
    </div>

  </div>
</template>


<script>
import _ from 'lodash';
import Foto from './Require_photo.vue'
export default {
  data: function() {
    return {
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
      place_: "",
      sitios_visitados_fotos:[],

    };
  },
  methods: {
    log_out() {
      window.localStorage.clear();
      this.$router.push("/");
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
  components: {
    Foto
  }
};
</script>
