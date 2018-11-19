// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
//import store from './store'
import Axios from 'axios'

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
