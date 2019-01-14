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




.imagen {
  width: 300px;
  height: 200px;
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
              <p>{{ sitios_visitados[0].descripcion }}</p>
            </b-row>
            <b-row>
              <div v-for="(sitio,index) in sitios_visitados[0].sitios" :key="index">
                <div class="card" style="width: 16rem;">
                  <img class="card-img-top" :src="sitios_visitados_fotos[index]" alt="Card image">
                  <div class="card-body">
                    <p class="card-text">{{ sitio }}</p>
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
              <b-list-group class="w-100">
                <div v-for="sitio in sitios_deseados[0].sitios" :key="sitio">
                  <b-list-group-item class="w-100">{{ sitio }}</b-list-group-item>
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
      sitios_visitados_fotos:[],

       sitios_visitados: [
                            {
                              nombre: 'Mis Sitios',
                              descripcion: 'Aquí aparecerán los lugares en los que has etiquetado tus fotos',
                              sitios: [
                                      ]
                            }
                          ],
        sitios_deseados: [
                            {
                              nombre: 'Mis Sitios',
                              descripcion: 'Aquí aparecerán los lugares en los que has etiquetado tus fotos',
                              sitios: [
                                      ]
                            }
                         ],
    };
  },
  async mounted() {
    this.subir_foto = 0;

    if (
      localStorage.getItem("jwt") == null ||
      localStorage.getItem("jwt") == "undefined"
    ) {
      this.$router.push("/");
    }
    this.sitios_visitados[0].sitios = ["Tamo activo"];
    try{
    await this.$http
      .get("http://localhost:8081/userboard/" + this.mail)
      .then(response => {
        console.log(response.data);
        this.sitios_visitados[0].sitios = response.data[0];
        this.sitios_visitados_fotos = response.data[1];
        this.sitios_deseados[0].sitios = response.data[2];

      });
    }catch(err){};
  },
  methods: {
    upload(){
        this.$router.push('/userboard/upload');
        this.subir_foto = 1;
    },
  },
  components: {

  }
};
</script>
