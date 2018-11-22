<template>
  <div>
    <h1>Adventure Book</h1>
    <p> La red social en la que compartir tus experiencias y encontrar nuevas aventuras</p>
    <router-link to='/login'> Iniciar Sesión </router-link>
    <router-link to='/signup'> Crear una cuenta </router-link>
    <router-link to='/dashboard'> dashboard </router-link>

    <router-view></router-view>	

  </div>
</template>

<script>
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import Userboard from './components/Userboard.vue'
export default {
  
  name: 'App',  
  data(){
    return{
      
    }
  },
  mounted(){
    
  }
}



</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
