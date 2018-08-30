<template>
  <div class="type-total">
    <div class="query-conditions">
        <el-date-picker v-model="selectedMonth" type="month" format="yyyy年MM月"
        :clearable=false :editable=false
        placeholder="选择月" class="month-select" popper-class="datepick-pop"
        @change="totalQueries"></el-date-picker>
    </div>
    <div class="content">
      <div class="detail-statistics">
        <h3 class="point-title"><span class="text">业态配比</span></h3>
        <div class="detail-statistics-echart" ref="detaildataechart"></div>
      </div>
      <h3 class="point-title"><span class="text">各业态月度对比</span></h3>
      <div class="table">
        <table class="table-wrapper">
          <thead>
            <tr>
              <th>业态</th>
              <th v-for="(item, index) in usedTableData.Operation"
              :key="'category-'+index" class="sp"
              @click="checkDetail(item)">{{item}}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>本月面积<br/>(㎡)</td>
              <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">{{item}}</td>
            </tr>
            <tr>
              <td>本月营业额<br/>(百万元)</td>
              <td
                v-for="(item, index) in usedTableData.Month1"
                :key="'curMonthSale-'+index"
              >{{item}}</td>
            </tr>
            <tr>
              <td>本月坪效<br/>(元/㎡)</td>
              <td
                v-for="(item, index) in usedTableData.Effect1"
                :key="'curMonthSale-'+index"
              >{{item}}</td>
            </tr>
            <tr class="mark-line">
              <td>去年同期面积<br/>(㎡)</td>
              <td
                v-for="(item, index) in usedTableData.Area3"
                v-html="item"
                :key="'area-'+index"
              ></td>
            </tr>
            <tr class="mark-line">
              <td>去年同期营业额<br/>(百万元)</td>
              <td
                v-for="(item, index) in usedTableData.Month3"
                v-html="item"
                :key="'prevYearMonthSales-'+index"
              ></td>
            </tr>
            <tr class="mark-line">
              <td>去年同期坪效<br/>(元/㎡)</td>
              <td
                v-for="(item, index) in usedTableData.Effect3"
                v-html="item"
                :key="'curMonthSale-'+index"
              ></td>
            </tr>
            <tr class="mark-line1">
              <td>上月面积<br/>(㎡)</td>
              <td
                v-for="(item, index) in usedTableData.Area2"
                :key="'area-'+index"
                v-html="item"
              ></td>
            </tr>
            <tr class="mark-line1">
              <td>上月营业额<br/>(百万元)</td>
              <td
                v-for="(item, index) in usedTableData.Month2"
                v-html="item"
                :key="'prevMonthSale-'+index"
              ></td>
            </tr>
            <tr class="mark-line1">
              <td>上月坪效<br/>(元/㎡)</td>
              <td
                v-for="(item, index) in usedTableData.Effect2"
                v-html="item"
                :key="'curMonthSale-'+index"
              ></td>
            </tr>
          </tbody>
        </table>
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
  {title: '30天月化坪效', x: '10%', y: 170, y1: 210, width: '80%', height: 80}
]
export default {
  name: 'type-total',
  data () {
    return {
      malls: malls,
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
      return this.tableData
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
      for (let i = 0; i < curMonthData.Operation.length; i++) {
        data.area.push(
          {
            value: curMonthData.Area[i].toFixed(0),
            name: curMonthData.Operation[i],
            itemStyle: pieItemstyle[i]
          }
        )
        data.sales.push(
          {
            value: curMonthData.Sales[i].toFixed(0),
            name: curMonthData.Operation[i],
            itemStyle: pieItemstyle[i]
          }
        )
        data.effact.push(
          {
            value: curMonthData.Effect[i],
            name: curMonthData.Operation[i],
            itemStyle: {
              color: pieItemstyle[i].color
            }
          }
        )
        data.lastYearEffact.push(
          {
            value: lastYearData.Effect[i],
            name: lastYearData.Operation[i],
            itemStyle: {
              color: lightenDarkenColor(pieItemstyle[i].color, 40)
            }
          }
        )
        data.lastMonthEffact.push(
          {
            value: lastMonthData.Effect[i],
            name: lastMonthData.Operation[i],
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
  components: {
  },
  watch: {
    activeMallIndex (newVal, oldVal) {
      this.totalQueries()
    }
  },
  created () {
    this.totalQueries()
  },
  mounted () {
  },
  methods: {
    totalQueries () {
      this.getStatistics()
      this.getEchartData()
    },
    getStatistics () {
      let opt = {
        v: 'Get_OperationSales_Table',
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
        v: 'Get_OperationSales_Chart',
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
          gridIndex: 0,
          data: legendTitle
        },
        yAxis: [
          {
            gridIndex: 0,
            type: 'value',
            name: '月化坪效(元)',
            nameGap: 8,
            axisLabel: {
              fontSize: 8
            }
          }
        ],
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
          type
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.type-total {
  .point-title{
    margin-top:0;
  }
  .table{
    margin:.5rem -.5rem 1rem;
    .table-wrapper{
      width:100%;
      border-top:1px solid #ddd;
      border-left:1px solid #ddd;
      .mark-line{
        background:#f0f0f0;
      }
      .mark-line1{
        background:#ddd;
        td{
          border-right-color: #ccc;
          border-color: #ccc;
        }
      }
      tr{
        th,td{
          text-align:right;
          border-right:1px solid #ddd;
          border-bottom:1px solid #ddd;
          padding:.3rem .1rem;
          line-height:1.3;
          vertical-align: middle;
          font-size:.5rem;
          &:first-child{
            text-align: center;
            padding: .3rem 0;
            font-weight: 600;
          }
          &:last-child{
            border-right: none;
          }
        }
        th{
          background:#f2f2f2;
          font-weight: 600;
          font-size:.5rem;
          text-align: center;
          &.sp{
            text-decoration: underline;
            line-height:2;
          }
        }
      }
    }
  }
  .detail-statistics-echart{
    width:100%;
    height:16rem;
  }
}
</style>
