import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import UserBoard from "@/components/Userboard"
import Waiting from "@/components/Waiting"

Vue.use(Router);

//export default
let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "HelloWorld",
      component: HelloWorld,
      meta: {

      }
    },

    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        //permitimos "sesión" de invitado
        guest: true
      }
    },

    {
      path: "/signup",
      name: "signup",
      component: Signup,
      meta: {
        //permitimos "sesión" de invitado
        guest: true
      }
    },

    {
      path: "/dashboard",
      name: "dashboard",
      component: UserBoard,
      meta: {
        //a user authorization is required to access to dashboard
        requiresAuth: true
      }
    },

    {
      path: "/waiting",
      name: "waiting",
      component: Waiting,
      meta: {
        //a user authorization is required to access to dashboard
        guest: true
      }
    }
  ]
});

/*router.beforeEach((to, from, next) => {
  console.log("require auth" + record.meta.requiresAuth)
  if(to.matched.some(record => record.meta.requiresAuth)){
    console.log("localstorag" + localStorage.getItem('jwt'));
    //localStorage.getItem('jwt') != null
    if(localStorage.getItem('jwt') == 'undefined'){
      next({
        path: '/login',
        params: {nextUrl: to.fullPath}
      })
    }
    else{
      next({
        path: '/dashboard',
        params:{nextUrl: to.fullPath, msg: "tok: "}
      })
    }
  }
  else if(to.matched.some(record => record.meta.guest)){
    if(localStorage.getItem('jwt') == null){
      next()
    }
    else{
      next()
    }
  }
})*/

export default router