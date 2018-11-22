<template>
    <span>
        <h2> Iniciar Sesión </h2>

        <input name="name" type="text" placeholder="E-mail" v-model="mail_">
        <br>
        <input name="pass" type="text" placeholder="Contraseña" v-model="pass_">
        <br>
        <br>
        <input type="submit" value="Iniciar Sesión" @click="handleSubmit">
    </span>
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
    handleSubmit(e){
      e.preventDefault()
      if(this.pass_.length > 0){
        this.$http.post('http://localhost:8081/login', {
          name: this.mail_,
          pass: this.pass_
        })
        .then(response => {
          console.log("entra ene l then")
          console.log(response.data.user)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          localStorage.setItem('jwt', response.data.token)
          if(localStorage.getItem('jwt') != null){
            this.$emit('loggenIn')
            console.log(localStorage)

            var user2=localStorage
            this.$router.push('/dashboard');           
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
