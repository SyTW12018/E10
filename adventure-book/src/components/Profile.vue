<style>
body {
  background-color: white !important;
}

.main {
  padding: 100px;
  background-color: white;
}

h3 {
  font-size: 24px;
}

.left15 {
  position: relative;
  left: -15px;
}

.datos_personales p {
  position: relative;
  top: 4px;
}

#update_pass {
  margin-top: 4px;
}

#update_name {
  position: relative;
  top: 5px;
  visibility: hidden;
}
</style>

<template>
  <div class="main">
    <div class="container">
      <b-row>
        <b-col md="8" offset-md="2">
          <b-row class="left15">
            <b-col cols="12" md="auto">
              <h2>Tu cuenta en AdventureBook</h2>
            </b-col>
          </b-row>
          <br>
          <b-row>
            <h3>Datos personales</h3>
          </b-row>
          <b-row class="left15">
            <b-col cols="3">
              <p>Apodo</p>
            </b-col>
            <b-col cols="6">
              <b-form-input
                type="text"
                placeholder="Nombre con el que los demás usuarios te identificarán"
                v-model="name_"
              ></b-form-input>
            </b-col>
            <b-col cols="2">
              <b-button v-on:click="change_name">Guardar</b-button>
            </b-col>
            <b-col cols="1">
              <img id="update_name" src="../ok.png" width="20px" alt="nombre actualizado">
            </b-col>
          </b-row>
          <b-row class="left15">
            <b-col cols="3">
              <p>Correo electrónico</p>
            </b-col>
            <b-col cols="6">
              <b-form-input
                type="text"
                placeholder="Dirección de correo electrónico"
                v-model="mail_"
                disabled
              >></b-form-input>
            </b-col>
          </b-row>
          <br>
          <b-row>
            <h3>Cambiar la contraseña</h3>
          </b-row>
          <b-row class="left15">
            <b-col cols="9">
              <b-form-input type="password" placeholder="Contraseña actual" v-model="current_pass_"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="left15">
            <b-col cols="9">
              <b-form-input type="password" placeholder="Nueva contraseña" v-model="new_pass_"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="left15">
            <b-col cols="9">
              <b-form-input
                type="password"
                placeholder="Repite la nueva contraseña"
                v-model="new_pass_repeat_"
              ></b-form-input>
            </b-col>
          </b-row>
          <b-row class="left15">
            <b-col cols="9">
              <b-button v-on:click="change_pass" id="update_pass">Guardar contraseña</b-button>
            </b-col>
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
			mail_: "",
			name_: "",

			current_pass_: "",
			new_pass_: "",
			new_pass_repeat_: ""
		}
  },
  mounted(){

		this.name_= JSON.parse(localStorage.getItem("user")).name;
		this.pass_= JSON.parse(localStorage.getItem("user")).pass;
		this.mail_= JSON.parse(localStorage.getItem("user")).mail;

	},
	
	methods:{
		async change_name(){

			try{
			await this.$http
				.post("http://localhost:8081/change_name/" + this.name_ + "/" + this.mail_)
				.then(response => {
					console.log(response.data);
					var user = JSON.parse(localStorage.getItem("user"));
					user.name = this.name_;
					localStorage.setItem('user', JSON.stringify(user));

					// mostrar el tick verde
					document.getElementById("update_name").style.visibility = "visible";
				});
			}catch(err){}
		
		},

	async change_pass(){

		try{
			await this.$http
				.post("http://localhost:8081/change_pass/" + this.new_pass_ + "/" + this.mail_)
				.then(response => {
					console.log(response.data);
					var user = JSON.parse(localStorage.getItem("user"));
					user.password = response.data;
					localStorage.setItem('user', JSON.stringify(user));
					console.log(user);
					this.current_pass_= "";
					this.new_pass_= "";
					this.new_pass_repeat_= "";
					// mostrar el tick verde
					document.getElementById("update_name").style.visibility = "visible";
				});
			}catch(err){}
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
      .post("http://localhost:8081/perfil", {
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
