<style scope>
.main{
	padding:30px;
	background-color:white;
}

.contenido{ 
    background-color: white;
    color: #54C2C3;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    text-align: center;
    border-radius: 0px;
}

.contenido:hover{
    background-color: #54C2C3;
    color: white;
}

</style>

<template>
	<div class="main"><div class="container">
		<b-row>
			<b-col cols="7" id="sitios_deseados">
				<b-row class="mb-3">
					<h2> Destinos deseados </h2>
				</b-row>					
				<div v-for="sitio in destinos_deseados[0].sitios" class="contenido">
					<b-row class="mb-4">
						<b-col>
							<div class="card" style="width: 16rem;">
								<img class="card-img-top" src="../C.jpg" alt="Card image">
							</div>
						</b-col>
						<b-col>
							<b-row>
								<h3>{{sitio.lugar}}</h3>
							</b-row>
							<b-row>
								{{sitio.pais}}
							</b-row>
						</b-col>
						<b-col>
							<b-row>
								{{sitio.fecha}}
							</b-row>
							<b-row>
								<b-col md="3" class="ml-auto p-8">
									{{sitio.personas}}
								</b-col>
								<b-col>
									<div class="card" style="width:2rem;">
										<img class="card-img-top" src="../person.jpg" alt="Card image">
									</div>
								</b-col>
							</b-row>
						</b-col>
					</b-row>
				</div>
				<b-row class="mb-3">
					<h2> Este mes </h2>
				</b-row>
				<div v-for="sitio in este_mes[0].sitios" class="contenido">
                                        <b-row class="mb-3">
                                                <b-col>
                                                        <div class="card" style="width: 10rem;">
                                                                <img class="card-img-top" src="../C.jpg" alt="Card image">
                                                        </div>
                                                </b-col>
                                                <b-col>
                                                        <b-row>
                                                                <h3>{{sitio.lugar}}</h3>
                                                        </b-row>
                                                        <b-row>
                                                                {{sitio.pais}}
                                                        </b-row>
                                                </b-col>
                                                <b-col>
                                                        <b-row>
                                                                {{sitio.fecha}}
                                                        </b-row>
                                                        <b-row>
                                                                <b-col md="3" class="ml-auto p-8">
                                                                        {{sitio.personas}}
                                                                </b-col>
                                                                <b-col>
                                                                        <div class="card" style="width:2rem;">
										<img class="card-img-top" src="../person.jpg" alt="Card image">
									</div>
								</b-col>
							</b-row>
						</b-col>
					</b-row>
				</div>	
				<b-row>
                                        <h2> Todos los viajes organizados</h2>
                                </b-row>
                                <div v-for="sitio in todo_organizado[0].sitios" class="contenido">
                                        <b-row class="mb-4">
                                                <b-col>
                                                        <div class="card" style="width: 10rem;">
                                                                <img class="card-img-top" src="../C.jpg" alt="Card image">
                                                        </div>
                                                </b-col>
                                                <b-col>
                                                        <b-row>
                                                                <h3>{{sitio.lugar}}</h3>
                                                        </b-row>
                                                        <b-row>
                                                                {{sitio.pais}}
                                                        </b-row>
                                                </b-col>
                                                <b-col>
                                                        <b-row>
                                                                {{sitio.fecha}}
                                                        </b-row>
                                                        <b-row>
                                                                <b-col md="3" class="ml-auto p-8">
                                                                        {{sitio.personas}}
                                                                </b-col>
                                                                <b-col>
                                                                        <div class="card" style="width:2rem;">
                                                                                <img class="card-img-top" src="../person.jpg" alt="Card image">
                                                                        </div>
                                                                </b-col>
                                                        </b-row>
                                                </b-col>
					</b-row>
				</div>
			</b-col>
			<b-col id="proximos_viajes" class="w-100" >
				<b-row>				
					<h2> Tus proximos viajes </h2>
				</b-row>
				<div v-for="sitio in futuros_viajes[0].sitios" class="contenido">
					<b-row class="mb-4">
						<b-col >
							<div class="card" style="width: 10rem;">
								<img class="card-img-top" src="../C.jpg" alt="Card image">
							</div>
						</b-col>
						<b-col >
							<b-row>
								<h3>{{sitio.lugar}}</h3>
							</b-row>
							<b-row>
								{{sitio.pais}}
							</b-row>
						</b-col>
						<b-col >
							<b-row>
								{{sitio.fecha}}
							</b-row>	
							<b-row>
								<b-col md="3" class="ml-auto p-8">
									{{sitio.personas}}
								</b-col>
								<b-col>
									<div class="card" style="width:2rem;">
										<img class="card-img-top" src="../person.jpg" alt="Card image">
									</div>
								</b-col>
							</b-row>
						</b-col>
					</b-row>
				</div>
			</b-col>
		</b-row>
	</div></div>
</template>
<script>
        export default {
                data(){
                        return{
				destinos_deseados: [
							{
								sitios:[{lugar: 'Venecia', pais: 'Italia',fecha:'Marzo 2016', personas:'3'},
                                                                        {lugar: 'Oporto' ,pais: 'Portugal',fecha:'Mayo 2016', personas:'4'},
									]
							}
				],
                                futuros_viajes: [
                                                        {
                                                                sitios: [{lugar: 'Venecia', pais: 'Italia',fecha:'Marzo 2016', personas:'3'},
                                                                        {lugar: 'Oporto' ,pais: 'Portugal',fecha:'Mayo 2016', personas:'4'},
                                                                        ]
                                                        }
                                ],
				este_mes: [
                                                        {
                                                                sitios: [{lugar: 'Venecia', pais: 'Italia',fecha:'Marzo 2016', personas:'3'},
                                                                        {lugar: 'Oporto' ,pais: 'Portugal',fecha:'Mayo 2016', personas:'4'},
                                                                        ]
                                                        }
                                ],
				todo_organizado: [
                                                        {
                                                                sitios: [{lugar: 'Madrid', pais: 'España',fecha:'Marzo 2017', personas:'12'},
                                                                        {lugar: 'Oporto' ,pais: 'Portugal',fecha:'Mayo 2016', personas:'4'},
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
							
                        
                                

