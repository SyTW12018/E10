// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//import store from './store'
import Axios from 'axios'
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';
import Userboard from './components/Userboard.vue';

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
    { path: '/login',  component: Login},
    { path: '/signup', component: Signup},
    { path: '/dashboard', component: Userboard}
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
