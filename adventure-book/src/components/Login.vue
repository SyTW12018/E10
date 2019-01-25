<style>
	.error{
		color: red;
	}
</style>

<template>
	<b-row align-h="center">
        <h2> Iniciar Sesión </h2>
        <b-form-input type="text" placeholder="e-mail" v-model="mail_"></b-form-input>
        <b-form-input type="password" placeholder="contraseña" v-model="pass_"></b-form-input>
				<button type="submit" value="Entrar" @click="handleSubmit" class="btn btn-primary btn-block" style="margin-bottom:10px;"> Entrar </button>
				<p class="error"> {{ error_ }} </p>
	</b-row>
</template>


<script>
export default {
  data: function() {
    return {
      mail_: "",
      pass_: "",
			error_: "",

    };
  },

  methods: {
    //this method is to prove test
    change_mail(new_mail){
      this.mail_ = new_mail;
    },

    handleSubmit(e){
			this.error_ = "";
      e.preventDefault();
			if(this.mail_ == "")
			{
				this.error_ = "Escribe un e-mail";
			}
			else if (this.pass_ == "")
			{
				this.error_ = "Escribe una contraseña";
			}
			else{
        this.$http.post('http://localhost:8081/login', {
          mail: this.mail_,
          pass: this.pass_
        })
        .then(response => {
          localStorage.setItem('user', JSON.stringify(response.data.user))
          localStorage.setItem('jwt', response.data.token)
          if(localStorage.getItem('jwt') != null){
            this.$emit('loggenIn')
            this.$router.push('/waiting');
          }
        })
        .catch(function(err){
          console.log(err.response);
        })
				if(localStorage.getItem('jwt') == null){
					this.error_ = "Las credenciales no son válidas";
				}
			}
    }
  }
};
</script>
