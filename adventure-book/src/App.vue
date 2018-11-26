 
<template>
<div class="h-100">
 <b-card overlay img-src="https://picsum.photos/600/300/?image=25">    
   <b-container style="margin-top:250px;">
      <b-row style=" background-color: white">
       <b-col md="4" offset-md="4">
                 <h1> <img src="../src/assets/avion.png" height="60" />Adventure Book</h1>
                 <p> La red social en la que compartir tus experiencias y encontrar nuevas aventuras</p>
                 <router-link to='/login'> Iniciar Sesión </router-link>
                 <router-link to='/signup'> Crear una cuenta </router-link>
                 <router-view></router-view>
     </b-col>
    </b-row>
 </b-container>
</b-card>
</div>
</template>


<script>

export default {
  
  name: 'App',  
  data(){
    return{
      
    }
  }
}



</scrip>
