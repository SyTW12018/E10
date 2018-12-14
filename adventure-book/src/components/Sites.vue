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
                        <h2> {{ nombre }} </h2>
                    </b-row>
					<b-row>
						<p> {{ descripcion}} </p>
                    </b-row>

                    <b-row>
                        <div v-for="sitio in comunidades_autonomas" :key="sitio">
                            <div class="card" style="width: 16rem;">
                                <img class="card-img-top" src="../C.jpg" alt="Card image">
                                <div class="card-body">
                                    <p class="card-text"> {{ sitio }}</p>
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
	nombre: "Sitios",
	descripcion: "Descubre todas las comunidades y ciudades autónomas españolas.",
	comunidades_autonomas: [	"Andalucía",
								"Aragón",
								"Principado de Asturias",
								"Baleares",
								"Canarias",
								"Cantabria",
								"Castilla-La Mancha",
								"Castilla y León",
								"Cataluña",
								"Extremadura",
								"Galicia",
								"La Rioja",
								"Comunidad de Madrid",
								"Región de Murcia",
								"Comunidad Foral de Navarra",
								"País Vasco",
								"Comunidad Valenciana",
								"Ceuta",
								"Melilla",
				
				]

    }
  },
  mounted(){

  },
  components: {

  }
}


</script>
