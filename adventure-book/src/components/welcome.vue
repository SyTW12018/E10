<style>
	body {
		height:100%;
	}

	#mainrow{
		text-align: center;
		padding:40px 0 40px 0;
		background-color: white;
	}

	#dif{
		display: flex;
    align-items: center;
	}


	@media (max-width: 768px) {
		h2{
			font-size: 24px;
		}

	}

	.main {
    padding: 100px;
    background-color: white;
  }


</style>

<template>
	<div>
    <div class="main">
		    <b-row id="mainrow">
		      <b-col md="4" offset-md="4">
		        <b-row>
		          <b-col>
								<img src="../assets/avion.png" height="100px"/>
							</b-col>
						</b-row>
						<b-row>
							<b-col>
								<h1> Adventure Book </h1>
							</b-col>
						</b-row>
						<b-row>
							<b-col md="10" offset-md="1">
								<p> La red social en la que compartir tus experiencias y encontrar nuevas aventuras</p>
							</b-col>
						</b-row>
						<b-row>
							<b-col cols="5">
								<login></login>
							</b-col>
							<b-col cols="6" offset="1">
								<signup></signup>
							</b-col>
						</b-row>
		      </b-col>
				</b-row>
			</div>
	</div>
</template>


<script>

import Login from './Login.vue'
import Signup from './Signup.vue'
export default {
  data(){
    return{

    }
  },
  mounted(){

  },
  components: {
    Login, Signup
  }
}


</script>
