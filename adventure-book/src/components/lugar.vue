<style>
  #lugar{
    background-color: rgb(0,0,0,0.);
    margin: 0px 50px 50px 0px;
  }

  .foto{
    margin: 0px 0px 10px 10px;
  }
</style>

<template>
    <div id="lugar" class="w-100">
        <b-row>
          <b-col>
            <h2> {{ nombre }} </h2>
          </b-col>
          <b-col cols="1">
            <img @click="close()" src="../close.png" alt="cerrar">
          </b-col>
        </b-row>
        <b-row>
            <div v-for="foto in fotos">
                <b-row class="foto">
                    <img :src="foto.src" height="200">
                </b-row>
                <b-row class="foto">
                    <b-col style="text-align">
                        <p> {{foto.usuario}} - {{ foto.fecha}}</p>
                    </b-col>
                </b-row>
            </div>
        </b-row>
    </div>

</template>


<script>

export default {
  data(){
    return{
	      codigo: '',
        nombre: "Andalucía",
        fotos: [
                  {
                    src: require('../C.jpg'),
                    fecha: "12/12/12",
                    usuario: "Mireia"
                  },
                  {
                    src: require('../C.jpg'),
                    fecha: "12/12/12",
                    usuario: "Mireia"
                  },
                  {
                    src: require('../C.jpg'),
                    fecha: "12/12/12",
                    usuario: "Mireia"
                  },
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
      }
  },

  mounted() {
    // Recuperar el código de la id
    this.codigo =  window.location.pathname.split("/").pop() ;

    // búsqueda  del nombre, las fotos en la colección sitios
    // backend aquiiiii (codigo copiao y pegao)
  },
  components: {

  }
}


</script>
