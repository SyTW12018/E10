<template>
	<b-row align-h="center"> 
        <h2> Iniciar Sesión </h2>
        <b-form-input type="text" placeholder="Nombre de usuario" v-model="name"></b-form-input>
        <b-form-input type="password" placeholder="Contraseña" v-model="pass"></b-form-input>
	<button type="submit" value="Entrar" @click="get_credentials(name, pass)" class="btn btn-primary btn-block" style="margin-bottom:10px;"> Entrar </button>
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
    get_credentials: function(name, pass) {
      (this.name_ = name),
        (this.pass_ = pass),
        alert(JSON.stringify(this.$data, null, 2));
    }
  }
};
</script>
