<style>
body {
  background-color: white !important;
}
.main{
    padding:100px;
    background-color:white;
}

.card{
    margin: 0px 8px 8px 0px;
    background-color: #54C2C3;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    text-align: center;
    border-radius: 0px;
}

.card:hover{
    background-color: white;
    color: #54C2C3;
}


</style>

<template>
    <div class="main">
        <div class="container">
            <b-row>
                <b-col cols="12" id="sitios">
                    <b-row>
                        <router-view></router-view>
                    </b-row>
                    <b-row>
                        <h2> {{ nombre }} </h2>
                    </b-row>
					          <b-row>
						            <p> {{ descripcion}} </p>
                    </b-row>

                    <b-row>
                        <div v-for="(sitio,index) in comunidades_autonomas" :key="index">
                            <div class="card" style="width: 16rem;" @click="route(sitio.cod)">
                                <img class="card-img-top" :src="comunidades_autonomas[index].photo" alt="Card image">
                                <div class="card-body">
                                    <p class="item">  {{ sitio.nombre }} </p>
                                </div>
                            </div>
                        </div>
                    </b-row>
                </b-col>
            </b-row>
        </div>
    </div>
</template>


<script>


export default {
  data(){
    return{
	nombre: "Todos los sitios",
    descripcion: "Descubre todas las comunidades y ciudades autónomas españolas.",
    place_data:[],
	comunidades_autonomas: [
                            {
                              cod: '0',
                              nombre: 'Andalucía',
                              photo:'',
                            },
                            {
                              cod: '1',
                              nombre: 'Aragón',
                              photo:''
                            },
                            {
                              cod: '2',
                              nombre: 'Cantabria',
                              photo:''
                            },
                            {
                              cod: '3',
                              nombre: 'Castilla la Mancha',
                              photo:''
                            },
                            {
                              cod: '4',
                              nombre: 'Castilla y León',
                              photo:''
                            },
                            {
                              cod: '5',
                              nombre: 'Cataluña',
                              photo:''
                            },
                            {
                              cod: '6',
                              nombre: 'Ceuta',
                              photo:''
                            },
                            {
                              cod: '7',
                              nombre: 'Comunidad de Madrid',
                              photo:''
                            },
                            {
                              cod: '8',
                              nombre: 'Comunidad Foral de Navarra',
                              photo:''
                            },
                            {
                              cod: '9',
                              nombre: 'Comunidad Valenciana',
                              photo:''
                            },
                            {
                              cod: '10',
                              nombre: 'Extremadura',
                              photo:''
                            },
                            {
                              cod: '11',
                              nombre: 'Galicia',
                              photo:''
                            },
                            {
                              cod: '12',
                              nombre: 'Islas Baleares',
                              photo:''
                            },
                            {
                              cod: '13',
                              nombre: 'Islas Canarias',
                              photo:''
                            },
                            {
                              cod: '14',
                              nombre: 'La Rioja',
                              photo:''
                            },
                            {
                              cod: '15',
                              nombre: 'Melilla',
                              photo:''
                            },
                            {
                              cod: '16',
                              nombre: 'Pais Vasco',
                              photo:''
                            },
                            {
                              cod: '17',
                              nombre: 'Principado de Asturias',
                              photo:''
                            },
                            {
                              cod: '18',
                              nombre: 'Región de Murcia',
                              photo:''
                            }
				]

    }
  },

  methods: {
      route(lugar){
          this.$router.push('/sitios/' + lugar);
      }
  },


  async mounted() {
    if (
      localStorage.getItem("jwt") == null ||
      localStorage.getItem("jwt") == "undefined"
    ) {
      this.$router.push("/");
    }
    for (var i = 0; i < this.comunidades_autonomas.length; i++){
      try{
        await this.$http
          .get("http://localhost:8081/sites/" + this.comunidades_autonomas[i].cod)
          .then(response => {
            this.comunidades_autonomas[i].photo = response.data[1].photo[0].split("adventure-book")[1]; 
            console.log(this.comunidades_autonomas[i].photo);
          });
      }catch(err){};
    }
  },
  components: {

  }
}


</script>
