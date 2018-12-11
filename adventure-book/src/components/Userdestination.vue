<style>
.main{
	padding:30px;
	background-color:white;
}
</style>

<template>
	<div clas="main">
		<b-row>
			<b-col cols="7" id="sitios_deseados">
			</b-col>
			<b-col id="proximos_viajes" class="w-100">
				<b-row>				
					<h2> Tus proximos viajes </h2>
				</b-row>
				<div v-for="sitio in futuros_viajes[0].sitios">
					<b-row>
						<b-col >
							<div class="card" style="width: 10rem;">
								<img class="card-img-top" src="../C.jpg" alt="Card image">
							</div>
						</b-col>
						<b-col >
							<b-row>
								{{sitio.lugar}}
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
								{{sitio.personas}}
							</b-row>
						</b-col>
					</b-row>
				</div>
			</b-col>
		</b-row>
	</div>
</template>
<script>
        export default {
                data(){
                        return{
                                futuros_viajes: [
                                                        {
                                                                sitios: [{lugar: 'Venecia', pais: 'Italia',fecha:'Marzo 2016', personas:'3'},
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
							
                        
                                

