import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import Login from "@/components/Login";
import Sigup from "@/components/Sigup";
import UserBoard from "@/components/Userboard"

Vue.use(Router);

//export default
let router = new Router({
  routes: [
    {
      path: "/",
      name: "HelloWorld",
      component: HelloWorld
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
      path: "/registrar",
      name: "signup",
      component: Signup,
      meta: {
        //permitimos "sesión" de invitado
        guest: true
      }
    },

    {
      path: "/dashboard",
      name: "userboard",
      component: UserBoard,
      meta: {
        //a user authorization is required to access to dashboard
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)){
    if(localStorage.getItem('jwt') = null){
      next({
        path: '/login',
        params: {nextUrl: to.fullPath}
      })
    }
    else{
      next()
    }
  }
  else if(to.matched.some(record => record.meta.guest)){
    if(localStorage.getItem('jwt') = null){
      next()
    }
    else{
      next()
    }
  }
})

export default router