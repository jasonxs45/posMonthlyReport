import Vue from 'vue'
import Vuex from 'vuex'
import { getPrevMonth } from 'common/js/date'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    openid:'',
    selectedMonth: getPrevMonth(),
    activeMallIndex: 0
  },
  modules: {},
  mutations: {
    getOpenid (state, openid) {
      state.openid = openid
    },
    getDate (state, selectedMonth) {
      window.sessionStorage.selectedMonth = selectedMonth
      state.selectedMonth = window.sessionStorage.selectedMonth
    },
    getMallId (state, activeMallIndex) {
      window.sessionStorage.activeMallIndex = activeMallIndex
      state.activeMallIndex = parseInt(window.sessionStorage.activeMallIndex)
    }
  },
  actions: {},
  strict: debug
})
