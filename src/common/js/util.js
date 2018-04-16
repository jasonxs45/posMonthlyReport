function formatNumber (num, cent, isThousand) {
  // num = num.toString().replace(/\$|\,/g, '')
  // 检查传入数值为数值类型
  if (isNaN(num)) {
    num = 0
  }
  // 获取符号(正/负数)
  let abs = Number(Math.abs(num))
  let sign = Number(num) === abs
  num = Math.floor(num * Math.pow(10, cent) + 0.50000000001) // 把指定的小数位先转换成整数.多余的小数位四舍五入
  let cents = num % Math.pow(10, cent) // 求出小数位数值
  num = Math.floor(num / Math.pow(10, cent)).toString() // 求出整数位数值
  cents = cents.toString()// 把小数位转换成字符串,以便求小数位长度

  // 补足小数位到指定的位数
  while (cents.length < cent) {
    cents = '0' + cents
  }
  if (isThousand) {
    // 对整数部分进行千分位格式化.
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
      num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3))
    }
  }
  if (cent > 0) {
    return (((sign) ? '' : '-') + num + '.' + cents)
  } else {
    return (((sign) ? '' : '-') + num)
  }
}
// 处理环比同比
let handleRate = (item, index, comparedItem) => {
  let rate = ''
  if (item) {
    rate = Math.round(100 * (comparedItem[index] - item) / item)
    rate = rate > 0 ? `<span class="up">(+${rate}%)</span>` : `<span class="down">(${rate}%)</span>`
  } else {
    rate = '<span class="down">(--)</span>'
  }
  return `${formatNumber(Math.round(item / 1000000), 0, 1)}${rate}`
}
// echart颜色值
const color = [
  '#feda66',
  '#3699d9',
  '#f28227',
  '#c23531',
  '#2f4554',
  '#61a0a8',
  '#d48265',
  '#91c7ae',
  '#749f83',
  '#ca8622',
  '#bda29a',
  '#6e7074',
  '#546570',
  '#c4ccd3',
  '#CDB5CD'
]
export {
  formatNumber,
  handleRate,
  color
}
