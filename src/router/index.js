import Vue from 'vue'
import store from 'store'
import Router from 'vue-router'
import pageRoutes from './pages'
import { malls } from 'common/js/config'
import wxConf from 'common/js/wxConf'

Vue.use(Router)

let routes = pageRoutes

const router = new Router({
  routes
})
router.beforeEach((to, from, next) => {
  let day
  let mallid
  if (to.query.day) {
    day = to.query.day
    day = day.substr(0, 4) + '-' + day.substr(4, 2)
    let selectedMonth = day
    store.commit('getDate', selectedMonth)
  } else if (window.sessionStorage.selectedMonth) {
    store.commit('getDate', window.sessionStorage.selectedMonth)
  }
  if (to.query.mallid) {
    mallid = parseInt(to.query.mallid)
    let activeMallIndex = malls.findIndex(item => item.mallid === mallid)
    store.commit('getMallId', activeMallIndex)
  } else if (window.sessionStorage.activeMallIndex) {
    store.commit('getMallId', parseInt(window.sessionStorage.activeMallIndex))
  }
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
