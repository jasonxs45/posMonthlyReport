<template>
  <div class="floor-total">
    <div class="query-conditions">
        <el-date-picker v-model="selectedMonth" type="month" format="yyyy年MM月"
        :clearable=false :editable=false
        placeholder="选择月" class="month-select" popper-class="datepick-pop"
        @change="totalQueries"></el-date-picker>
    </div>
    <div class="content">
      <div class="detail-statistics">
        <h3 class="point-title"><span class="text">各楼层情况</span></h3>
        <div class="detail-statistics-echart" ref="detaildataechart"></div>
      </div>
      <h3 class="point-title"><span class="text">各楼层月度营业额对比</span></h3>
      <div class="mytable">
        <div class="table fixed">
          <table class="table-wrapper">
            <thead>
              <tr class="mark-line">
                <th>
                  <div class="column-head">楼层</div>
                </th>
                <th v-for="(item, index) in usedTableData.Location"
                :key="'category-'+index" class="sp"
                @click="checkDetail(item)">
                  <div class="column-repeat">{{item}}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="column-head">本月面积<br/>(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat">{{item}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="column-head">本月营业额<br/>(百万元)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Month1" :key="'curMonthSale-'+index">
                  <div class="column-repeat">{{item}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="column-head">本月坪效<br/>元/(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat">{{item}}</div>
                </td>
              </tr>
              <tr class="mark-line">
                <td>
                  <div class="column-head">去年同期面积<br/>(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line">
                <td><div class="column-head">去年同期营业额<br/>(百万元)</div></td>
                <td v-for="(item, index) in usedTableData.Month3" :key="'prevYearMonthSales-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line">
                <td>
                  <div class="column-head">去年同期坪效<br/>元/(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line1">
                <td>
                  <div class="column-head">上月面积<br/>(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line1">
                <td>
                  <div class="column-head">上月营业额<br/>(百万元)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Month2" :key="'curMonthSale-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line1">
                <td>
                  <div class="column-head">上月坪效<br/>元/(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table">
          <table class="table-wrapper">
            <thead>
              <tr>
                <th>
                  <div class="column-head">楼层</div>
                </th>
                <th
                  v-for="(item, index) in tableData.Location"
                  :key="'category-'+index" class="sp"
                  @click="checkDetail(item)"
                >
                  <div class="column-repeat">{{item}}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="column-head">本月面积<br/>(㎡)</div>
                </td>
                <td v-for="(item, index) in tableData.Area" :key="'area-'+index">
                  <div class="column-repeat">{{item}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="column-head">本月营业额<br/>(百万元)</div>
                </td>
                <td v-for="(item, index) in tableData.Month1" :key="'curMonthSale-'+index">
                  <div class="column-repeat">{{item}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="column-head">本月坪效<br/>元/(㎡)</div>
                </td>
                <td v-for="(item, index) in tableData.Effect1" :key="'area-'+index">
                  <div class="column-repeat" >{{item}}</div>
                </td>
              </tr>
              <tr class="mark-line">
                <td>
                  <div class="column-head">去年同期面积<br/>(㎡)</div>
                </td>
                <td v-for="(item, index) in tableData.Area3" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line">
                <td><div class="column-head">去年同期营业额<br/>(百万元)</div></td>
                <td v-for="(item, index) in tableData.Month3" :key="'prevYearMonthSales-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line">
                <td>
                  <div class="column-head">去年同期坪效<br/>元/(㎡)</div>
                </td>
                <td v-for="(item, index) in tableData.Effect3" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line1">
                <td>
                  <div class="column-head">上月面积<br/>(㎡)</div>
                </td>
                <td v-for="(item, index) in tableData.Area2" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line1">
                <td>
                  <div class="column-head">上月营业额<br/>(百万元)</div>
                </td>
                <td v-for="(item, index) in tableData.Month2" :key="'curMonthSale-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line1">
                <td>
                  <div class="column-head">上月坪效<br/>元/(㎡)</div>
                </td>
                <td v-for="(item, index) in tableData.Effect2" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import layer from 'common/js/layer'
import 'common/scss/layer.css'
import api from 'common/api'
import { malls } from 'common/js/config'
import { formatNumber, handleRate, color, lightenDarkenColor } from 'common/js/util'
import { formatDate, getPrevMonth } from 'common/js/date'
import echarts from 'echarts'
let pieItemstyle = []
for (let i = 0; i < color.length; i++) {
  let item = {
    color: color[i],
    borderWidth: 1,
    borderColor: '#fff',
    borderType: 'solid'
  }
  pieItemstyle.push(item)
}
const grids = [
  {title: '面积 ', x: '25%', y: 20, y1: 110, radius: 60},
  {title: '营业额', x: '75%', y: 20, y1: 110, radius: 60},
  {title: '30天月化坪效', x: '10%', y: 170, y1: 210, width: '88%', height: 80}
]
export default {
  name: 'floor-total',
  data () {
    return {
      malls,
      tableData: {},
      originEchartData: []
    }
  },
  computed: {
    activeMallIndex: {
      get () {
        return this.$store.state.activeMallIndex
      },
      set (value) {
        this.$store.commit('getMallId', value)
      }
    },
    selectedMonth: {
      get () {
        return this.$store.state.selectedMonth
      },
      set (value) {
        this.$store.commit('getDate', value)
      }
    },
    endMonth () {
      let date = new Date(this.selectedMonth)
      return formatDate(date, 'yyyy-MM')
    },
    startMonth () {
      let date = new Date(this.selectedMonth)
      let half = date.setMonth(date.getMonth() - 5)
      return formatDate(new Date(half), 'yyyy/MM')
    },
    usedTableData () {
      let curMonthSale = JSON.parse(JSON.stringify(this.tableData))
      return curMonthSale
    },
    echart () {
      return echarts.init(this.$refs.detaildataechart)
    },
    usedEchartData () {
      let curMonthData = this.originEchartData[0]
      let lastYearData = this.originEchartData[1]
      let lastMonthData = this.originEchartData[2]
      let data = {
        area: [],
        sales: [],
        effact: [],
        lastYearEffact: [],
        lastMonthEffact: []
      }
      for (let i = 0; i < curMonthData.Location.length; i++) {
        data.area.push(
          {
            value: curMonthData.Area[i].toFixed(0),
            name: curMonthData.Location[i],
            itemStyle: pieItemstyle[i]
          }
        )
        data.sales.push(
          {
            value: curMonthData.Sales[i].toFixed(0),
            name: curMonthData.Location[i],
            itemStyle: pieItemstyle[i]
          }
        )
        data.effact.push(
          {
            value: curMonthData.Effect[i],
            name: curMonthData.Location[i],
            itemStyle: {
              color: pieItemstyle[i].color
            }
          }
        )
        data.lastYearEffact.push(
          {
            value: lastYearData.Effect[i],
            name: lastYearData.Location[i],
            itemStyle: {
              color: lightenDarkenColor(pieItemstyle[i].color, 40)
            }
          }
        )
        data.lastMonthEffact.push(
          {
            value: lastMonthData.Effect[i],
            name: lastMonthData.Location[i],
            itemStyle: {
              color: lightenDarkenColor(pieItemstyle[i].color, 80)
            }
          }
        )
      }
      return data
    }
  },
  filters: {
    thousand (num) {
      return formatNumber(num, 0, 1)
    }
  },
  watch: {
    activeMallIndex (newVal, oldVal) {
      this.totalQueries()
    }
  },
  created () {
    this.totalQueries()
  },
  methods: {
    totalQueries () {
      this.getStatistics()
      this.getEchartData()
    },
    getStatistics () {
      let opt = {
        v: 'Get_LocationSales_Table',
        month: this.endMonth,
        MallID: this.malls[this.activeMallIndex].mallid
      }
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
          this.tableData = res.data.Data
          // 算环比
          this.tableData.Month2 = this.tableData.Month2.map((item, index) => {
           return handleRate(item, index, this.tableData.Month1, 1000000)
          })
          this.tableData.Month3 = this.tableData.Month3.map((item, index) => {
           return handleRate(item, index, this.tableData.Month1, 1000000)
          })
          this.tableData.Effect2 = this.tableData.Effect2.map((item, index) => {
           return handleRate(item, index, this.tableData.Effect1, 1)
          })
          this.tableData.Effect3 = this.tableData.Effect3.map((item, index) => {
           return handleRate(item, index, this.tableData.Effect1, 1)
          })
          this.tableData.Area2 = this.tableData.Area2.map((item, index) => {
           return handleRate(item, index, this.tableData.Area, 1)
          })
          this.tableData.Area3 = this.tableData.Area3.map((item, index) => {
           return handleRate(item, index, this.tableData.Area, 1)
          })
          this.tableData.Area = this.tableData.Area.map(item => formatNumber(Math.round(item), 0, 1))
          this.tableData.Effect1 = this.tableData.Effect1.map(item => formatNumber(Math.round(item), 0, 1))
          this.tableData.Month1 = this.tableData.Month1.map(item => formatNumber(Math.round(item / 1000000), 0, 1))
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    _fetchEchart (date) {
      let opt = {
        v: 'Get_LocationSales_Chart',
        month: date,
        MallID: this.malls[this.activeMallIndex].mallid
      }
      return api.query(opt)
    },
    getEchartData () {
      // 本月
      let curMonth = this.endMonth
      // 去年同期
      let lastYearMonth = (parseInt(this.endMonth.split('-')[0]) - 1) + '/' + this.endMonth.split('-')[1]
      // 上月
      let lastMonth = getPrevMonth(this.endMonth)
      let layerindex = layer.loading('加载中')
      Promise.all([
        this._fetchEchart(curMonth),
        this._fetchEchart(lastYearMonth),
        this._fetchEchart(lastMonth)
      ]).then(res => {
        layer.close(layerindex)
        let resArr = res.map(item => item.data.Data)
        this.originEchartData = resArr
        this.initEchart()
      }).catch(err => {
        layer.close(layerindex)
        console.log(err)
      })
    },
    initEchart () {
      let itemStyle = {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        }
      }
      let labelLine = {
        normal: {
          show: false
        }
      }
      let label = {
        normal: {
          position: 'inside',
          formatter (params) {
            return params.percent.toFixed(0) + '%'
          }
        }
      }
      let title = []
      for (let i = 0; i < 3; i++) {
        let tit = {
          text: grids[i].title,
          left: i === 2 ? (parseFloat(grids[i].x) + parseFloat(grids[i].width) / 2) + '%' : grids[i].x,
          top: grids[i].y,
          textAlign: 'center',
          textStyle: {
            fontSize: 12,
            align: 'center'
          }
        }
        title.push(tit)
      }
      let legendTitle = this.usedEchartData.area.map(item => item.name)
      let series = [
        {
          name: title[0].text,
          type: 'pie',
          radius : grids[0].radius,
          center: [grids[0].x, grids[0].y1],
          data: this.usedEchartData.area,
          itemStyle,
          label,
          labelLine,
          tooltip: {
            formatter (params) {
              return `${params.seriesName}<br/>
                      ${params.marker + params.name}:${formatNumber(params.value, 0, 1)}<br/>
                      ${params.percent ? '占比:' + params.percent.toFixed(0) + '%' : ''}`
            }
          }
        },
        {
          name: title[1].text,
          type: 'pie',
          radius : grids[1].radius,
          center: [grids[1].x, grids[1].y1],
          data: this.usedEchartData.sales,
          itemStyle,
          label,
          labelLine,
          tooltip: {
            formatter (params) {
              return `${params.seriesName}<br/>
                      ${params.marker + params.name}:${formatNumber(params.value, 0, 1)}<br/>
                      ${params.percent ? '占比:' + params.percent.toFixed(0) + '%' : ''}`
            }
          }
        },
        {
          name: '本月',
          type: 'bar',
          data: this.usedEchartData.effact,
          itemStyle,
          label,
          labelLine
        },
        {
          name: '去年同期',
          type: 'bar',
          data: this.usedEchartData.lastYearEffact
        },
        {
          name: '上月',
          type: 'bar',
          data: this.usedEchartData.lastMonthEffact
        }
      ]
      // 绑定图例点击事件
      this.echart.on('legendselectchanged', params => {
        // 筛选柱状图 具体数值
        series[2].data = this.usedEchartData.effact.filter((item, index) => {
          return Object.values(params.selected)[index] === true
        })
        series[3].data = this.usedEchartData.lastYearEffact.filter((item, index) => {
          return Object.values(params.selected)[index] === true
        })
        series[4].data = this.usedEchartData.lastMonthEffact.filter((item, index) => {
          return Object.values(params.selected)[index] === true
        })
        this.echart.setOption({
          xAxis: {
            data: this.usedEchartData.area.filter(item => params.selected[item.name]).map(item => item.name)
          },
          series
        })
      })
      this.echart.setOption({
        title,
        textStyle: {
          fontSize: 8
        },
        tooltip: {
          formatter (params) {
            let title = '30天月化坪效'
            let subTitle = params[0].axisValue
            let para = ''
            for (let i = 0; i < params.length; i++) {
              para += `${params[i].marker + params[i].seriesName}：${formatNumber(params[i].value, 0, 1)}<br/>`
            }
            return `${title}<br/>${subTitle}<br/>${para}`
          }
        },
        legend: {
          type: 'scroll',
          left: 'center',
          top: 320,
          data: this.usedEchartData.area.map(item => item.name),
          itemHeight: 8
        },
        grid: {
          top: grids[2].y1,
          left: grids[2].x,
          width: grids[2].width,
          height: grids[2].height,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          }
        },
        xAxis: {
          type: 'category',
          show: true,
          boundaryGap: true,
          axisLabel: {
            fontSize: 8
          },
          data: legendTitle
        },
        yAxis: {
          type: 'value',
          name: '月化坪效(元)',
          nameGap: 8,
          axisLabel: {
            fontSize: 8
          }
        },
        series
      })
    },
    checkDetail (type) {
      let activeMallIndex = this.activeMallIndex
      let endMonth = this.endMonth
      this.$router.push({
        name: 'shopall',
        params: {
          activeMallIndex,
          endMonth,
          location: type
        }
      })
    },
    radioChange (e) {
      this.activeTypeIndex = parseInt(e.target.value)
      this.getEchartData()
      this.getStatistics()
    }
  }
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.floor-total {
  .point-title{
    &:first-child {
      margin-top:0;
    }
  }
  .detail-statistics-echart{
    width:100%;
    height:16rem;
  }
  .mytable{
    margin:1rem -.5rem 1rem;
    position: relative;
    .table{
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      &.fixed{
        position: absolute;
        left:0;
        top:0;
        width:3.8rem;
        overflow: hidden;
        box-shadow: 0 0 1px 0 rgba(0,0,0,.2);
        z-index:10;
        .table-wrapper{
          tr{
            td,th{
                div{
                  background: #fff;
                }
              }
            &.mark-line{
              td,th{
                div{
                  background: #f0f0f0 !important;
                }
              }
            }
          }
        }
        & + .table{
          .table-wrapper{
            tr{
              th,td{
                &:first-child{
                  div{
                    color:transparent
                  }
                }
              }
            }
          }
        }
      }
      .table-wrapper{
        border-top:1px solid #ddd;
        .mark-line{
          background:#f0f0f0;
        }
        .mark-line1{
          background:#ddd;
          td{
            border-right-color: #ccc;
            border-color: #ccc;
            div{
              background:#ddd !important;
            }
          }
        }
        tr{
          th,td{
            text-align:right;
            line-height:1.3;
            vertical-align: middle;
            font-size:.5rem;
            border-right:1px solid #ddd;
            border-bottom:1px solid #ddd;
            &:first-child{
              text-align: center;
              div{
                font-weight: 600;
              }
            }
            &:last-child{
              border-right:none;
            }
            div{
              padding:.3rem .1rem;
            }
            .column-head{
              width:3.8rem;
              padding: .3rem 0;
            }
            .column-repeat{
              width:3rem
            }
          }
          th{
            background:#f2f2f2;
            font-size:.5rem;
            text-align: center;
            div{
              font-weight: 600;
              padding: .3rem .1rem;
            }
            &.sp{
              text-decoration: underline;
              font-size:.5rem;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
}
</style>
