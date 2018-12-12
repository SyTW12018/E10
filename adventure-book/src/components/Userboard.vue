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
                <b-col cols="9" id="mis_sitios">
                    <b-row>
                        <h2> {{ sitios_visitados[0].nombre }} </h2>
                    </b-row>
                    <b-row>
                        <p> {{ sitios_visitados[0].descripcion }} </p>
                    </b-row>
                    <b-row>
                        <div v-for="sitio in sitios_visitados[0].sitios">
                            <div class="card" style="width: 16rem;">
                                <img class="card-img-top" src="../C.jpg" alt="Card image">
                                <div class="card-body">
                                    <p class="card-text"> {{ sitio }}</p>
                                </div>
                            </div>

                        </div>
                    </b-row>
                </b-col>

                <b-col id="futuros sitios" class="w-100">
                    <b-row>
                        <h2> Lugares deseados </h2>
                    </b-row>
                    <b-row class="w-100">
                        <b-list-group class="w-100">
		                    <div v-for="sitio in sitios_deseados[0].sitios">
		                        <b-list-group-item class="w-100"> {{ sitio }} </b-list-group-item>
		                    </div>
                        </b-list-group>
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
        nombre_usuario: 'Mireia',
        sitios_visitados: [
                            {
                              nombre: 'Mis Sitios',
                              descripcion: 'Aquí aparecerán los lugares en los que has etiquetado tus fotos',
                              sitios: [ 'Islas Canarias',
                                        'Madrid',
                                        'Cataluña',
                                        'Galicia',
                                        'Castilla y León',
                                      ]
                            }
                          ],

        sitios_deseados: [
                            {
                              nombre: 'Mis Sitios',
                              descripcion: 'Aquí aparecerán los lugares en los que has etiquetado tus fotos',
                              sitios: [ 'Islas Baleares',
                                        'La Rioja',
                                        'Cantabria',
                                        'Galicia',
                                        'Andalucía',
                                      ]
                            }
                         ],

    }
  },
  mounted(){

  },
  components: {

  }
}


</script>
