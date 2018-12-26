<style>
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
                        <div v-for="sitio in comunidades_autonomas" :key="sitio">
                            <div class="card" style="width: 16rem;" @click="route(sitio.cod)">
                                <img class="card-img-top" src="../C.jpg" alt="Card image">
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
	comunidades_autonomas: [
                            {
                              cod: '1',
                              nombre: 'Andalucía'
                            },
                            {
                              cod: '2',
                              nombre: 'Aragón'
                            },
                            {
                              cod: '3',
                              nombre: 'Asturias'
                            },
                            {
                              cod: '4',
                              nombre: 'Islas Baleares'
                            },
                            {
                              cod: '5',
                              nombre: 'Islas Canarias'
                            },
                            {
                              cod: '6',
                              nombre: 'Cantabria'
                            }

				]

    }
  },

  methods: {
      route(lugar){
          this.$router.push('/sitios/' + lugar);
      }
  },

  
  mounted() {
    if (
      localStorage.getItem("jwt") == null ||
      localStorage.getItem("jwt") == "undefined"
    ) {
      this.$router.push("/");
    }
    this.$http
      .post("http://localhost:8081/sites", {
        user_: JSON.parse(localStorage.getItem("user"))._id
      })
      .then(response => {
        this.user_data = response.data;
      });
  },
  components: {

  }
}


</script>
