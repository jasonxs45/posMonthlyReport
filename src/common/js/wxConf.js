import api from 'common/api'
import store from 'store'
// const comOpenId = 'gh_ba3ae28cdc9b'
// const webRoot = 'whtd.juzhen.co'
let wxConf = {
  name: 'weixin-config',
  shareData: {
    title: '',
    desc: '',
    link: '',
    imgUrl: ''
  },
  init (cb) {
    let ua = navigator.userAgent.toLowerCase()
    if (!(/micromessenger/i).test(ua)) {
      alert('请使用微信浏览器访问，否则部分功能可能无法使用！')
      return
    }
    api.author((openid) => {
      store.commit('getOpenid', openid)
      cb && cb()
    })
  }
}
export default wxConf
