import Vue from 'vue'
import store from 'store'
import Router from 'vue-router'
import pageRoutes from './pages'
import wxConf from 'common/js/wxConf'

Vue.use(Router)

let routes = pageRoutes

const router = new Router({
  routes
})
router.beforeEach((to, from, next) => {
  if (!store.state.openid) {
    wxConf.init(() => {
      next()
    })
  } else {
    next()
  }
})
router.afterEach((to, from) => {
})
export default router
