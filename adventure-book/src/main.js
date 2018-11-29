// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueRouter from 'vue-router';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap-vue/dist/bootstrap-vue.css';
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';

Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.config.productionTip = false;

const routes = [
    { path: '/Login',  component: Login},
    { path: '/Signup', component: Signup}
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
