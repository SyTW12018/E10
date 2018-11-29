<style>

	body {
		height:100%;
		background-image:url('C.jpg');
		background-repeat: no-repeat;
		background-position: center center;
		background-attachment: fixed;
		background-size: cover;
	}

	#mainrow{	
		text-align: center;
		padding:40px;
		background-color: white;
	}
	#dif{
		display: flex;
  		align-items: center;
		transform: translatey(10%);
	}

	@media (min-width: 768px) {
		#contenedor{
				transform: translatey(50%);
		}

	}

</style>
 
<template>
	<div id="contenedor" class="h-100">
		<b-row id="mainrow">
			<b-col md="3" offset-md="4">
				<b-row> 
					<b-col>
						<img src="../src/assets/avion.png" height="100px"/>
					</b-col>
				</b-row>	
				<b-row> 
					<b-col>
						<h1> Adventure Book </h1>	
					</b-col>
				</b-row>	
				<b-row> 
					<b-col md="10" offset-md="1">
						<p> La red social en la que compartir tus experiencias y encontrar nuevas aventuras</p>	
						<b-row> 
							<b-col>
								<router-link to='/Login'> Iniciar Sesión </router-link>
							</b-col>
							<b-col>
								<router-link to='/Signup'> Registrarse </router-link>
							</b-col>
						</b-row>
					</b-col>
				</b-row>

			</b-col>
			<b-col md="2" offset-md="1" id="dif">
				<b-row> 
					<router-view></router-view>
				</b-row>
			</b-col>
		</b-row>
	</div>
</template>


<script>

export default {
  
  name: 'App',  
  data(){
    return{
      
    }
  }
}


</scrip>
