<style>
.main{
    padding:100px;
    background-color:white;
}

h3{
	font-size: 24px;
}

.datos_personales{
  position: relative;
  left: -15px;
}

.datos_personales p{
  position: relative;
  top: 4px;
}

 #update_pass{
   margin-top: 4px;
 }

</style>

<template>
    <div class="main">
        <div class="container">
            <b-row>
			           <b-col md="8" offset-md="2">
		    		         <b-row class="justify-content-md-center">
                         <b-col cols="12" md="auto">
                             <h2> {{ nombre }} </h2>
                       </b-col>
		    		         </b-row>
                     <br>
                     <b-row>
           				      <h3> Datos personales </h3>
           					</b-row>
	            	     <b-row class="datos_personales">
						             <b-col cols="3">
							               <p> Nombre completo</p>
						             </b-col>
						             <b-col cols="7">
							                <b-form-input type="text" placeholder="Nombre completo" v-model="name_"></b-form-input>
						             </b-col>
            						 <b-col cols="2">
            						    <b-button  v-on:click="update_name" >Guardar</b-button>
            						</b-col>
					          </b-row>
	            	    <b-row class="datos_personales">
						            <b-col cols="3">
							              <p> Correo electrónico</p>
						            </b-col>
            						<b-col cols="7">
            							  <b-form-input type="text" placeholder="Dirección de correo electrónico" v-model="mail_"></b-form-input>
            						</b-col>
            						<b-col cols="2">
            							  <b-button>Guardar</b-button>
            						</b-col>
					          </b-row>
                    <br>
                    <b-row>
          				      <h3> Cambiar la contraseña </h3>
          					</b-row>
          	        <b-row>
          				      <b-form-input type="password" placeholder="Contraseña actual"></b-form-input>
          					</b-row>
          	        <b-row>
          				      <b-form-input type="password" placeholder="Nueva contraseña"></b-form-input>
          					</b-row>
                    <b-row>
          				      <b-form-input type="password" placeholder="Repite la nueva contraseña"></b-form-input>
          					</b-row>
                    <b-row>
          						  <b-button id="update_pass">Guardar contraseña</b-button>
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
    name_: '',
		mail_: '',
		pass_: ''
		}
	},

	methods: {
		update_name(){
			console.log("Ejecuto popi");
			this.$http.post("http://localhost:8081/change_Name/"+ this.name_ 
			+ "/" + JSON.parse(localStorage.getItem("user")).name).
			then(response => {
					console.log("cambie el nombre");
					window.localStorage.clear();
					this.$router.push("/");
			});
		}
},

  async mounted(){
		await this.$http.get("http://localhost:8081/data_user/"+ JSON.parse(localStorage.getItem("user")).name).
		then(response => {
			console.log(response.data)
				this.pass_ = response.data[0];
				this.mail_ = response.data[1];
				this.name_ = response.data[2];
		});

  },
  components: {

  }
}


</script>
