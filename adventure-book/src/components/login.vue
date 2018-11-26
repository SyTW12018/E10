<template>
	<b-row align-h="center"> 
        <h2> Iniciar Sesión </h2>
        <b-form-input type="text" placeholder="E-mail" v-model="mail"></b-form-input>
        <b-form-input type="text" placeholder="Contraseña" v-model="pass"></b-form-input>
	<button type="submit" value="Entrar" @click="get_credentials(mail, pass)" class="btn btn-primary btn-block" style="margin-bottom:10px;"> Entrar </button>
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
    get_credentials: function(mail, pass) {
      (this.mail_ = mail),
        (this.pass_ = pass),
        alert(JSON.stringify(this.$data, null, 2));
    }
  }
};
</script>
