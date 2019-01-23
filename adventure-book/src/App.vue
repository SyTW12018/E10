<style>

  #nav{
    background-color: white;
    margin: 0 0 0px 0px;
    padding:15px 15px 0px 15px;
  }

  #header{
    margin: 5px 0px 10px 10px;
  }

  #nav h1{
    position: relative;
    top: -5px;
	margin: 0px 0px 0px 15px;
	font-size: 40px;
  }

  h1{
	color: #54C2C3;
  }

  h2, h3{
	color: #6c6c6c;
  }

  .item {
    margin: 7px 10px 0px 10px;
    font-size: 16px;
  }

  #links{
    padding: 10px;
    background-color: #54C2C3
  }

  #links a{
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
  }

  .btn-primary, .btn-primary:active, .btn-primary:visited {
    background-color: #6c6c6c !important;
    border-color:#6c6c6c;
  }

  .btn-primary:hover{
    background-color: grey !important;
    border-color: grey;
  }

  .footer{
    position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem;
  background-color: #efefef;
  text-align: center;
  }

  #container {

  }

  .Site {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

  .site_content {
    flex: 1;
  }

  #footer {
    padding: 5px;
    background-color: #DDD;
  }

</style>

<template>
	<div class="site">
		<div id="nav">
			<b-row id="header">
				<span>
					<img src="./assets/avion.png" height="40px"/>
				</span>
				<span>
					<h1>AdventureBook</h1>
				</span>
			</b-row>

      <b-row id="links">
        <b-nav>
          <router-link to='/perfil' class="item"> Cuenta </router-link>
          <router-link to='/userboard' class="item"> Mis Sitios </router-link>
          <router-link to='/Userdestination' class="item"> Grupos viaje </router-link>
          <router-link to='/sitios' class="item"> Sitios </router-link>
          <b-button @click="log_out"> Salir </b-button>
        </b-nav>
      </b-row>
      </div>

    <div class="site_content">
		    <router-view></router-view>
    </div>

    <footer id="footer">
      <div class="footer-copyright text-center py-3">
        © 2019 Copyright: AdventureBook
      </div>
    </footer>
  </div>

</template>


<script>

import Welcome from './components/welcome.vue'

export default {

  name: 'App',
  data(){
    return{
    }
  },
  watch:{

  },

  methods:{

    log_out(){
      console.log("voy a salir, ma");
      window.localStorage.clear();
      this.$router.push("/");
    }

  },
  components: {
    Welcome
  }
}


</script>
