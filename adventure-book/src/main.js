// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//import store from './store'
import Axios from 'axios'
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Welcome from './components/welcome.vue';
import Userboard from './components/Userboard.vue';
import Userdestination from './components/Userdestination.vue'
import Waiting from './components/Waiting.vue';
import Profile from './components/Profile.vue';
import Sites from './components/Sites.vue'

//Vue authentication 
Vue.prototype.$http = Axios;


const token = localStorage.getItem('token')
//set the 'Authorization' on axios header to our token, so our request can be processed if a token is required
//This way, we do not have to set token anytime we want to make a request
if(token){
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}


//Vue default
Vue.config.productionTip = false


Vue.use(BootstrapVue);
Vue.use(VueRouter);

const routes = [
    { path: '/',  component: Welcome},
    { path: '/welcome',  component: Welcome},
    { path: '/userboard', component: Userboard},
    { path: '/waiting', component: Waiting},
    { path: '/userdestination',component:Userdestination},
    { path: '/sitios', component: Sites},
    { path: '/perfil', component: Profile}
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
