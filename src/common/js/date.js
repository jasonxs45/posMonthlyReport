function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1 ? str : padLeftZero(str)))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}
function getPrevMonth (str) {
  const today = str ? new Date(str) : new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  let year2 = year
  let month2 = parseInt(month) - 1
  if (month2 === 0) {
    year2 = parseInt(year2) - 1
    month2 = 12
  }
  return formatDate(new Date(year2, month2 - 1), 'yyyy-MM')
}
function transferWeek (n) {
  var txt = ''
  switch (n) {
    case 0:
      txt = '日'
      break;
    case 1:
      txt = '一'
      break;
    case 2:
      txt = '二'
      break;
    case 3:
      txt = '三'
      break;
    case 4:
      txt = '四'
      break;
    case 5:
      txt = '五'
      break;
    case 6:
      txt = '六'
      break;
  }
  return txt;
}
export {
  formatDate,
  getPrevMonth,
  transferWeek
}
