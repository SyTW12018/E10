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
.contenedor {
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
</style>

<template>
  <div class="fondo">
    <div class="cuadrado">
      <div class="contenedor">
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
            <div v-for="(foto,index) in fotos" :key="index">
              <b-row class="foto">
                <img :src="foto.src" height="200">
              </b-row>
              <b-row class="foto">
                <b-col style="text-align">
                  <p>{{foto.usuario}} - {{ foto.fecha}}</p>
                </b-col>
              </b-row>
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
	      codigo: '3',
        nombre: "Andalucía",
        fotos: [], /*[
                  {
                    src: require('../C.jpg'),
                    fecha: "12/12/12",
                    usuario: "Mireia"
                  }

        ],*/
    }
  },
  props: ['test'],
  methods: {
      close(){
          this.$router.push('/userboard/');
      }
  },

  async mounted() {
    // Recuperar el código de la id
    this.codigo =  window.location.pathname.split("/").pop();
    this.comunidades = this.comunidades.sort();
    console.log(JSON.parse(localStorage.getItem("user"))._id);
    this.nombre = this.comunidades[window.location.pathname.split("/").pop()]
    try{
        await this.$http
          .get("http://localhost:8081/get_photos_place/" + 
          JSON.parse(localStorage.getItem("user"))._id + "/" + this.codigo)
          .then(async response => {
            try{
              console.log(response.data)
             response.data.forEach(await function(res){
                  var aux = {
                    src: res.photo.split("adventure-book")[1],
                    fecha: res.fecha.split('T')[0],
                    usuario: "Tú"
                  };
                //console.log(aux);  
                //console.log(this.fotos);
                console.log(this.codigo);
                //this.fotos.push(data);
              });
            }catch(err){};
            
          });
      }catch(err){};
      
  },
  components: {

  }
}


</script>