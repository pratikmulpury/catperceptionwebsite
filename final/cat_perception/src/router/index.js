import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import CatQuiz from '@/components/CatQuiz'
import Analysis from '@/components/Analysis'
import Login from '@/components/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: HomePage
    },
    {
      path: '/quiz',
      component: CatQuiz
    },
    {
      path: '/analysis',
      component: Analysis
    },
    {
      path: '/login',
      props: { getUser: '', setUser:''},
      component: Login
    }
  ]
})
