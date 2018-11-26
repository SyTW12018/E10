<template>
    <span>
        <h2> Iniciar Sesión </h2>

        <input type="text" placeholder="E-mail" v-model="mail">
        <br>
        <input type="text" placeholder="Contraseña" v-model="pass">
        <br>
        <br>
	<button type="submit" class="btn btn-primary btn-block" style="margin-bottom:10px;"> Entrar </button>
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
    get_credentials: function(mail, pass) {
      (this.mail_ = mail),
        (this.pass_ = pass),
        alert(JSON.stringify(this.$data, null, 2));
    }
  }
};
</script>
