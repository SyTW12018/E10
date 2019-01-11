<template>
	<b-row align-h="center">
        <h2> Iniciar Sesión </h2>
        <b-form-input type="text" placeholder="e-mail" v-model="mail_"></b-form-input>
        <b-form-input type="password" placeholder="contraseña" v-model="pass_"></b-form-input>
	<button type="submit" value="Entrar" @click="handleSubmit" class="btn btn-primary btn-block" style="margin-bottom:10px;"> Entrar </button>
	</b-row>
</template>


<script>
export default {
  data: function() {
    return {
      mail_: "",
      pass_: ""
    };
  },

  methods: {

		// atención aquí, que ya no se iniciar sesión con el username (ya no existe) sino con el mail

    handleSubmit(e){
      e.preventDefault()
      if(this.pass_.length > 0){
        this.$http.post('http://localhost:8081/login', {
          name: this.name_,
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
      }
    }
  }
};
</script>
