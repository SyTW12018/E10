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

  .link{
    position: relative;
    top: 10px;
  }

  .item {
    margin: 0px 10px 0px 10px;
    font-size: 16px;
  }

  #links{
    width: inherit;
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

  #logout{
    float: right;
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
        <b-col>
          <router-link to='/perfil' class="item link"> Cuenta </router-link>
          <router-link to='/userboard' class="item link"> Mis Sitios </router-link>
          <router-link to='/Userdestination' class="item link"> Grupos viaje </router-link>
          <router-link to='/sitios' class="item link"> Sitios </router-link>
        </b-col>
        <div id="logout">
          <b-button @click="log_out"> Salir </b-button>
        </div>

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
