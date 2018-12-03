

<style>

  #nav{
    background-color: white;
    margin: 0 0 20px 0px;
    padding:15px;
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

  .item {
    margin: 7px 10px 0px 10px;
    font-size: 16px;
  }

</style>

<template>
	<div>
		<div id="nav">
			<b-row id="header">
				<span>
					<img src="./assets/avion.png" height="40px"/>
				</span>
				<span>
					<h1>AdventureBook</h1>
				</span>
			</b-row>



			<b-nav>
				<router-link to='/Welcome' class="item"> Entrar </router-link>
				<router-link to='/Userboard' class="item"> Mis Sitios </router-link>
			</b-nav>
		</div>

		<router-view></router-view>

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
  mounted(){

  },
  components: {
    Welcome
  }
}


</script>
