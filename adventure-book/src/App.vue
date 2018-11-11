<template>
  <div>
    <h1>Hola</h1>
    <app-Signup></app-Signup>
    <app-Login></app-Login>
  </div>
</template>

<script>
import Login from './components/login.vue'
import Signup from './components/signup.vue'

export default {
  
  name: 'App',
  
  components: {
    'app-Login': Login,
    'app-Singup': Signup
  },
  
  data(){
    return{
      
    }
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
