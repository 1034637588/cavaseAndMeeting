import Vue from 'vue'
import VueRouter from 'vue-router'
import Hold from '../views/hold.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'home' }
  },
  {
    path:'/home',
    name:"home",
    component:()=>import(/* webpackChunkName: "home" */ '../views/home.vue')
  },
  {
    path: '/hold/:id/:name',
    name: 'hold',
    component: Hold
  },
  {
    path: '/attend/:id/:name',
    name: 'attend',
    component: () => import(/* webpackChunkName: "attend" */ '../views/attend.vue')
  }
]

const router = new VueRouter({
  routes
});
// router.beforeEach((to,from,next)=>{
//   let boss = localStorage.getItem("boss"+to.id);
//   let user = localStorage.getItem("user"+to.id);
//   if(to.name === 'attend'){
//     if(user){
//       next();
//     }else{
//       next({name:"attend"});
//     }
//   }if(to.name === 'hold'){
//     if(boss){
//       next();
//     }else{
//       next({name:"hold"});
//     }
//   }else{
//     next();
//   }
// });


export default router
