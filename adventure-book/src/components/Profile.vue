<style>
.main{
    padding:100px;
    background-color:white;
}

h3{
	font-size: 24px;
}

</style>

<template>
    <div class="main">
        <div class="container">
            <b-row>
				<b-col>
		    		<b-row>
						<h2> {{ nombre }} </h2>
		    		</b-row>
	            	<b-row>
						<b-col cols="2">
							<p> Nombre completo</p>
						</b-col>
						<b-col cols="8">
							<b-form-input type="text" placeholder="Nombre completo" v-model="name_"></b-form-input>
						</b-col>
						<b-col cols="2">
							<b-button>Guardar</b-button>
						</b-col>
					</b-row>
	            	<b-row>
						<b-col cols="2">
							<p> Correo electrónico</p>
						</b-col>
						<b-col cols="8">
							<b-form-input type="text" placeholder="Nombre de usuario" v-model="mail_"></b-form-input>
						</b-col>
						<b-col cols="2">
							<b-button>Guardar</b-button>
						</b-col>
					</b-row>
					<b-row>
						<h3> Cambiar la contraseña </h3>
					</b-row>
	            	<b-row>
						<b-form-input type="text" placeholder="Contraseña actual"></b-form-input>
					</b-row>
	            	<b-row>
						<b-form-input type="text" placeholder="Nueva contraseña"></b-form-input>
					</b-row>
					<b-row>
						<b-button>Actualizar</b-button>
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
		nombre: 'Tu cuenta en AdventureBook',
        name_: 'Mireia Scholz Díaz',
		mail_: 'mireia@gmail.com'
	}
  },
  mounted(){

  },
  components: {

  }
}


</script>
