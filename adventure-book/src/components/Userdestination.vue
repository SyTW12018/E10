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
    border-width: 2px;
    border: solid white;
    margin-top: 20px;
}

.Fecha{
	font-size:12px;
}

.contenido:hover{
    border-width: 2px;
    border: solid rgb(84,194,195,.7);
    border-radius: 5px;
}

.contenido2{
	margin:8px;
	margin-left:0px;
}

.personas{
	border-width: 2px;
	border: solid rgb(84,194,195);
}

</style>

<template>
	<div class="main"><div class="container">
		<b-row>
			<b-col cols="6" id="sitios_deseados">
				<b-row>
					<h2> Destinos deseados </h2>
				</b-row>					
				<div v-for="sitio in destinos_deseados[0].sitios" class="contenido">
					<b-row class="contenido2">
						<b-col>
							<div class="card" style="width: 12rem;">
                   <img class="card-img-top" src="../C.jpg" >
              </div>
					  </b-col>
						<b-col>
							<b-row>
								<h3>{{sitio.lugar}}</h3>
							</b-row>
							<b-row>
								<b-col>
									<b-row>
										{{sitio.pais}}
									</b-row>
								</b-col>
								<b-col cols="4" class="personas">
									<b-row>
										<b-col cols="1">
											{{sitio.personas}}	
										</b-col>
										<b-col cols="1">
											<div class="card" style="width:1.5rem;">
												<img class="card-img-top" src="../person.jpg" alt="Card image">
											</div>
										</b-col>
									</b-row>
								</b-col>
							</b-row>
							<b-row class="Fecha">	
								<b-col cols="5">
                    <b-row>
                        {{sitio.fecha}}
                    </b-row>
                </b-col>
						  </b-row>
						</b-col>						
					</b-row>
        </div>
				<b-row class="mb-3">
					<h2> Este mes </h2>
				</b-row>
				<div v-for="sitio in este_mes[0].sitios" class="contenido">
					<b-row class="contenido2">
						<b-col>
							<div class="card" style="width: 12rem;">
                   <img class="card-img-top" src="../C.jpg" >
              </div>
					  </b-col>
						<b-col>
							<b-row>
								<h3>{{sitio.lugar}}</h3>
							</b-row>
							<b-row>
								<b-col>
									<b-row>
										{{sitio.pais}}
									</b-row>
								</b-col>
								<b-col cols="4" class="personas">
									<b-row>
										<b-col cols="1">
											{{sitio.personas}}	
										</b-col>
										<b-col cols="1">
											<div class="card" style="width:1.5rem;">
												<img class="card-img-top" src="../person.jpg" alt="Card image">
											</div>
										</b-col>
									</b-row>
								</b-col>
							</b-row>
							<b-row class="Fecha">	
								<b-col cols="5">
                    <b-row>
                        {{sitio.fecha}}
                    </b-row>
                </b-col>
						  </b-row>
						</b-col>						
					</b-row>
        </div>
				<b-row>
               <h2> Todos los viajes organizados</h2>
        </b-row>
        <div v-for="sitio in todo_organizado[0].sitios" class="contenido">
             <b-row class="contenido2">
						<b-col>
							<div class="card" style="width: 12rem;">
                   <img class="card-img-top" src="../C.jpg" >
              </div>
					  </b-col>
						<b-col>
							<b-row>
								<h3>{{sitio.lugar}}</h3>
							</b-row>
							<b-row>
								<b-col>
									<b-row>
										{{sitio.pais}}
									</b-row>
								</b-col>
								<b-col cols="4" class="personas">
									<b-row>
										<b-col cols="1">
											{{sitio.personas}}	
										</b-col>
										<b-col cols="1">
											<div class="card" style="width:1.5rem;">
												<img class="card-img-top" src="../person.jpg" alt="Card image">
											</div>
										</b-col>
									</b-row>
								</b-col>
							</b-row>
							<b-row class="Fecha">	
								<b-col cols="5">
                    <b-row>
                        {{sitio.fecha}}
                    </b-row>
                </b-col>
						  </b-row>
						</b-col>						
					</b-row>
        </div>
			</b-col>
			<b-col cols="6" id="proximos_viajes" class="w-100" >
				<b-row>				
					<h2> Tus proximos viajes </h2>
				</b-row>
				<div v-for="sitio in futuros_viajes[0].sitios" class="contenido">
					<b-row class="contenido2">
						<b-col>
							<div class="card" style="width: 12rem;">
                   <img class="card-img-top" src="../C.jpg" >
              </div>
					  </b-col>
						<b-col>
							<b-row>
								<h3>{{sitio.lugar}}</h3>
							</b-row>
							<b-row>
								<b-col>
									<b-row>
										{{sitio.pais}}
									</b-row>
								</b-col>
								<b-col cols="4" class="personas">
									<b-row>
										<b-col cols="1">
											{{sitio.personas}}	
										</b-col>
										<b-col cols="1">
											<div class="card" style="width:1.5rem;">
												<img class="card-img-top" src="../person.jpg" alt="Card image">
											</div>
										</b-col>
									</b-row>
								</b-col>
							</b-row>
							<b-row class="Fecha">	
								<b-col cols="5">
                    <b-row>
                        {{sitio.fecha}}
                    </b-row>
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
							
                        
                                

