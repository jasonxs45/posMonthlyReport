import axios from 'axios'
import jsonp from 'jsonp'
import qs from 'qs'
import store from 'store'
let openid
const comOpenId = 'gh_ba3ae28cdc9b'
const webRoot = 'whtd.juzhen.co'
const url = '/mobile/posDailyReport1/webserver/ShopMonthService.aspx'
function RedirectAuthUrl (url, comOpenId, auth) {
  console.log(url)
  if (url.indexOf('?') >= 0) {
      var arr = []
      for (var key in Request) {
          if (key.toLowerCase() === 'code' || key.toLowerCase() === 'state') {
              continue;
          }
          arr.push(key + '=' + Request[key])
      }
      // url = url.substr(0, url.indexOf('?'))
      // if (arr.length !== 0) {
      //     url = url + '?' + arr.join('&')
      // }
  }
  let param = qs.stringify({
    v: 'GetAuthUrl',
    state: comOpenId,
    r: Math.random() * 100000,
    url: `http://${webRoot}/assets/modules/weixin/webserver/WeChatRmote.aspx?refurl=${escape(url)}`
  })
  jsonp(
    `http://${webRoot}/assets/modules/weixin/webserver/WeChatApi.aspx?${param}`,
    null,
    (err, data) => {
    if (err) {
      console.log(err)
    } else {
      if (data.ErrorCode === 0) {
        location.href = data.AuthPageUrl
        console.log(data.AuthPageUrl)
      } else {
        alert(data.ErrorMsg)
        location.href = url
      }
    }
  })
}
let api = {
  query (opt) {
    openid = store.state.openid
    Object.assign(opt, { openid })
    return axios.post(
      url,
      qs.stringify(opt)
    )
  },
  author (cb) {
    var url = `http://${webRoot}/assets/modules/weixin/webserver/WeChatApi.aspx?v=ReadWeixinInfo&state=gh_ba3ae28cdc9b&r=${Math.random() * 100000}&callback`
    jsonp(
      url,
      null,
      (err, data) => {
      if (err) {
        console.log(err)
        alert('授权页面获取失败，请关闭页面以后重新访问！')
      } else {
        if (data.ErrorCode !== 0 && data.ErrorCode !== -5) {
          RedirectAuthUrl(location.href, comOpenId, true)
        } else {
          cb && cb(data.Contact.openid)
          // window.sessionStorage.Global_pic = data.Contact.headimgurl
          // window.sessionStorage.Global_nickname = data.Contact.nickname
          // window.sessionStorage.Global_openid = data.Contact.openid
          // window.sessionStorage.Global_comopenid = comOpenId
          // window.sessionStorage.Global_unionid = data.Contact.unionid
        }
      }
    })
  }
}
export default api
