const malls = [
  {
    name: '壹方',
    mallid: 2
  },
  {
    name: '新天地',
    mallid: 1
  }
]
const effactType = [
  {
    typeId: 0,
    name: '日均客流与全场日均坪效',
    sname: '全场'
  },
  {
    typeId: 1,
    name: '日均客流与餐饮日均坪效',
    sname: '餐饮'
  },
  {
    typeId: 2,
    name: '日均客流与零售日均坪效',
    sname: '零售'
  }
]
let position = (point, params, dom, rect, size) => {
  // 固定在顶部
  var arr = [point[0], '10%']
  if (point[0] + dom.clientWidth > size.viewSize[0]) {
    arr[0] = point[0] - dom.clientWidth
  }
  return arr
}
export {
  malls,
  effactType,
  position
}
