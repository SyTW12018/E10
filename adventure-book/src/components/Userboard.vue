<template>
  <div>
    <h1>Bienvenido al dashboard</h1>
    <h2>{{name}}</h2>

    <form @submit.prevent="sendFiles" enctype="multipart/form-data">
      <div class="dropzone">
        <label for="title">Upload Files</label>
        <input multiple type="file" ref="files" class="input-field" @change="selectFile">

        <p v-if="!uploading" class="call-to-action">Arrasta tus archivos</p>
        <p v-if="uploading" class="progress-bar">
          <progress class="progress is-primary" :value="progress" max="100">
            {{progress}}%
          </progress>
        </p>
      </div>

      <div class="content">
        <div>  <!--class="columns is-multiline"-->
          <div v-for="file in uploadedFiles" :key="file" > <!--class="columns is-4"-->
            <figure class="image">
              <img class="imagen" :src="file" alt=""/>
            </figure>
          </div>
        </div>
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
              <a @click.prevent="files.splice(index,1);uploadFiles.splice(index,1)" class="delete"></a></div>
          </div>
        </div>
      </div>


      <div>
        <button @onclick="sendFiles">Send</button>
      </div>
    </form>

    <div>
      <button @click="log_out"> Log Out</button>
    </div>
  </div>  
</template>


<script>
import _ from 'lodash';

export default {
  data: function() {
    return {
      user_: JSON.parse(localStorage.getItem("user")),
      name: JSON.parse(localStorage.getItem("user")).name,
      b_creat_alb: false,
      //file: "",
      files: [],
      uploadFiles: [],
      error: false,
      err_msg: "",
      uploading: false,
      uploadedFiles: [],
      progress: 0,
      places:['Tenerife']
    };
  },
  methods: {
    log_out() {
      window.localStorage.clear();
      this.$router.push("/");
    },

    create_album() {},

    selectFile() {
      //Upload multiple files
      const files = this.$refs.files.files;
      this.uploadFiles = [ ...this.uploadFiles, ...files]

      this.files = [
        ...this.files,
        ..._.map(files, file => ({
           name: file.name,
           size: file.size,
           type: file.type,
           invalidMsg: this.validate(file)

         }))];

      /* Upload only one file
      const file = this.$refs.file.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const MAX_SIZE = 2000000;
      const too_heavy = file.size > MAX_SIZE; //true si pesa más que el max_size

      console.log(file.type)
      if(allowedTypes.includes(file.type) && !too_heavy){
        console.log("Permitido")
        this.file = file;
      }
      else{
        this.error = true;        
        this.err_msg = "Solo se permiten imágenes jpeg, png y gif"
        if(too_heavy){
          this.err_msg = 'Archivo muy pesado. Tamaño máximo: ${MAX_SIZE/1000}kb'
          
        }
        console.log(this.err_msg)
      }*/
    },

    validate(file){
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const MAX_SIZE = 2000000;

      if(file.size > MAX_SIZE){
        return 'Tamaño máximo: ${MAX_SIZE/1000}kb';
      }

      if(!allowedTypes.includes(file.type)){
        return "No es una imagen en jpeg, png o gif"
      }

      return "";
    },



    async sendFiles() {
      /*
          Initialize the form data
        */
      const formData = new FormData();
      _.forEach(this.uploadFiles, file => {
        if(this.validate(file) === ""){
          formData.append('files', file);
        }
      });

      try {
        this.uploading = true;
        console.log("ea")
        var url = "http://localhost:8081/upload"
        const res = await this.$http.post(url, formData, {
          onUploadProgress: e => this.progress = Math.round(e.loaded * 100 / e.total)
        });
        console.log(this.uploadedFiles)
        for(var j=0; j<res.data.files.length; j++){
          this.uploadedFiles.push(res.data.files[j])
        }
        
        console.log(this.uploadedFiles)
        this.uploading = false;

        var url = "http://localhost:8081/upload/" + this.name + "/" + this.places[0];
        await this.$http.post(url, formData);
        this.files = [];
        this.uploadFiles = [];
      } catch (err) {
        console.log(err);
      }
    }
  },

  mounted() {
    console.log("mounted in dashboard: ");
    console.log(localStorage.getItem("jwt"));
    if (
      localStorage.getItem("jwt") == null ||
      localStorage.getItem("jwt") == "undefined"
    ) {
      this.$router.push("/");
    }
    this.$http
      .post("http://localhost:8081/dashboard", {
        user_: JSON.parse(localStorage.getItem("user"))._id
      })
      .then(response => {
        this.user_data = response.data;
      });
  }
};
</script>

<style scoped>
  .dropzone{
    min-height: 200px;
    padding: 10px 10px;
    position: relative;
    cursor: pointer;
    outline: 2px dashed grey;
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
  }

  .dropzone:hover{
    background: lightskyblue;
  }

  .dropzone .call-to-action{
    font-size: 1.2rem;
    text-align: center;
    padding: 70px;
  }

  .dropzone .progress-bar{
    text-align: center;
    padding: 60px 10px;
  }

  .input-field{
    opacity: 0;
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .imagen{
    width: 300px;
    height: 200px;
  }


</style>

