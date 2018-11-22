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
          console.log("entra");
          localStorage.setItem('user', JSON.stringify(response.data.user))
          console.log("tokn: "  + response.data.token);
          localStorage.setItem('jwt', response.data.token)
          console.log("localStorage: " + localStorage.getItem('jwt'))
          if(localStorage.getItem('jwt') != null){
            this.$emit('loggenIn')

            if(this.$route.params.nextUrl != null){
              this.$router.push(this.$route.params.nextUrl)
            }
            else{
              this.$router.push('/dashboard')
            }
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
