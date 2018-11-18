import Vue from "vue";
import Router from "vue-router";
import HomeHelloWorld from "@/components/HelloWorld";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "HelloWorld",
      component: HelloWorld
    },

    {
      path: "/login",
      name: "login",
      component: Login
    },

    {
      path: "/registrar",
      name: "sigup",
      component: Sigup
    }
  ]
});
