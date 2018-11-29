<template>
	<b-row align-h="center"> 
        <h2> Iniciar Sesión </h2>
        <b-form-input type="text" placeholder="Nombre de usuario" v-model="name_"></b-form-input>
        <b-form-input type="password" placeholder="Contraseña" v-model="pass_"></b-form-input>
	<button type="submit" value="Entrar" @click="handleSubmit" class="btn btn-primary btn-block" style="margin-bottom:10px;"> Entrar </button>
	</b-row>
</template>
        

<script>
export default {
  data: function() {
    return {
      name_: "",
      pass_: ""
    };
  },

  methods: {
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
