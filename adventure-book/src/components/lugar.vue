<style>
#lugar {
  background-color: rgb(0, 0, 0, 0);
  margin: 0px 50px 50px 0px;
}

.foto {
  margin: 0px 0px 10px 10px;
}

.fondo {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.7);
  display: table;
}
.cuadrado {
  display: table-cell;
  vertical-align: middle;
}
.contenedor1 {
  overflow-y: scroll;
  height: 80%;
  width: 80%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  text-align: center;
  background-color: white;
  color: #54c2c3;
  font-weight: bold;
  font-size: 14px;
  border-width: 2px;
  border: solid white;
  margin-top: 20px;
}
.pic_item{
  margin: 15px;
}

.details{
  font-weight: bold;
  text-align: left;
  font-weight: normal;
  padding: 0px 0px 0px 10px;
}

</style>

<template>
  <div class="fondo">
    <div class="cuadrado">
      <div class="contenedor1">
        <div id="lugar" class="w-100">
          <b-row>
            <b-col>
              <h2>{{ nombre }}</h2>
            </b-col>
            <b-col cols="1">
              <img @click="close()" src="../close.png" alt="cerrar">
            </b-col>
          </b-row>
          <b-row>
            <div v-for="foto in fotos" :key="foto">
              <div class="pic_item">
                <b-row class="foto">
                  <img :src="foto.src" height="200">
                </b-row>
                <b-row class="details" align-h="between">
                  <b-col cols="">
                    <div> Subida por {{foto.usuario}} <span style="color:lightgrey"> ({{ foto.fecha}}) </span> </div>
                  </b-col>
                </b-row>
              </div>
            </div>
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  data(){
    return{
      comunidades : ['ANDALUCIA','ARAGÓN','PRINCIPADO DE ASTURIAS','ISLAS BALEARES','PAIS VASCO','ISLAS CANARIAS',
                    'GALICIA','LA RIOJA','CANTABRIA',
                    'CASTILLA Y LEÓN','CATALUÑA','COMUNIDAD VALENCIANA',
                    'CASTILLA LA MANCHA','EXTREMADURA','REGIÓN DE MURCIA','COMUNIDAD DE MADRID',
                    'CEUTA','MELILLA','COMUNIDAD FORAL DE NAVARRA'],
	      codigo: '',
        nombre: "Andalucía",
        fotos: [
                  /*{
                    src: require('../C.jpg'),
                    fecha: "12/12/12",
                    usuario: "Mireia"
                  }*/

        ],
    }
  },
  props: ['test'],
  watch:{
    $route (to, from){
      this.codigo =  window.location.pathname.split("/").pop();

      // búsqueda  del nombre, las fotos en la colección sitios
      // backend aquiiiii (codigo copiao y pegao)
    }
  },
  methods: {
      close(){
          this.$router.push('/sitios/');
      },
  },

  async mounted() {
    // Recuperar el código de la id
    this.codigo =  window.location.pathname.split("/").pop();
    this.comunidades = this.comunidades.sort();
    try{
        await this.$http
          .get("http://localhost:8081/sites/" + this.codigo)
          .then(async response => {
            this.nombre = this.comunidades[this.codigo]
           // console.log(this.nombre)
            for (var i =0; i < response.data.length; i++){
              for (var j =0; j < response.data[i].photo.length; j++){
                try{
                    await this.$http
                    .get("http://localhost:8081/get_name/" + response.data[i].user_id)
                    .then(res => {
                      if(res.data == ""){
                        var data = {
                          src : response.data[i].photo[j].split("adventure-book")[1],
                          fecha : response.data[i].date.split('T')[0],
                          usuario: "Anónimo"
                        };
                      }else{
                        var data = {
                          src : response.data[i].photo[j].split("adventure-book")[1],
                          fecha : response.data[i].date.split('T')[0],
                          usuario: res.data
                        };
                      }
                      console.log(data);
                      this.fotos.push(data);
                  });
                }catch(err){}
              }
            }
          });
      }catch(err){};
  },
  components: {

  }
}


</script>
