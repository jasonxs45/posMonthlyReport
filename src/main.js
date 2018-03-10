// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from 'store'
import App from './App'
import router from './router'
import { Select, Option, DatePicker } from 'element-ui'
import 'common/js/base'

Vue.use(Select)
Vue.use(Option)
Vue.use(DatePicker)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
