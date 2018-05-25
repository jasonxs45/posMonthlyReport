<template>
  <div class="monthly-total">
    <div class="query-conditions">
      <el-select v-model="activeMallIndex" placeholder="请选择" class="mall-select" popper-class="mall-pop"
      @change="totalQueries">
          <el-option
            v-for="(item, index) in malls"
            :key="item.name"
            :label="item.name"
            :value="index">
          </el-option>
        </el-select>
        <el-date-picker v-model="selectedMonth" type="month" format="yyyy年MM月"
        :clearable=false :editable=false
        placeholder="选择月" class="month-select" popper-class="datepick-pop"
        @change="totalQueries"></el-date-picker>
    </div>
    <div class="content">
      <div class="detail-statistics">
        <h3 class="point-title"><span class="text">每日变化</span></h3>
        <div class="detail-statistics-echart" ref="detaildataechart"></div>
      </div>
      <h3 class="point-title"><span class="text">环比与同比</span></h3>
      <div class="table">
        <table class="table-wrapper">
          <thead>
            <tr>
              <th>{{endMonth}}</th>
              <th>开业率</th>
              <th>客流<br/>(千次)</th>
              <th>车流<br/>(千次)</th>
              <th>营业额<br/>(百万元)</th>
              <th>月化坪效<br/>(元/㎡)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>本月</td>
              <td>{{(usedTableData.curMonth.openingrate*100).toFixed(0)}}%</td>
              <td>{{(usedTableData.curMonth.knum/1000)|thousand}}</td>
              <td>{{(usedTableData.curMonth.cnum/1000)|thousand}}</td>
              <td>{{(usedTableData.curMonth.grosssales/1000000).toFixed(0)}}</td>
              <td>{{usedTableData.curMonth.effact|thousand}}</td>
            </tr>
            <tr>
              <td>去年同期</td>
              <td>{{(usedTableData.prevYearMonth.openingrate*100).toFixed(0)}}%</td>
              <td>{{(usedTableData.prevYearMonth.knum/1000)|thousand}}</td>
              <td>{{(usedTableData.prevYearMonth.cnum/1000)|thousand}}</td>
              <td>{{(usedTableData.prevYearMonth.grosssales/1000000).toFixed(0)}}</td>
              <td>{{usedTableData.prevYearMonth.effact|thousand}}</td>
            </tr>
            <tr class="mark-line">
              <td>同比</td>
              <td>{{usedTableData.monthTB.openingrate}}</td>
              <td>{{usedTableData.monthTB.knum}}</td>
              <td>{{usedTableData.monthTB.cnum}}</td>
              <td>{{usedTableData.monthTB.grosssales}}</td>
              <td>{{usedTableData.monthTB.effact}}</td>
            </tr>
            <tr>
              <td>本年累计<br/>(YTD)</td>
              <td>{{(usedTableData.curYear.openingrate*100).toFixed(0)}}%</td>
              <td>{{(usedTableData.curYear.knum/1000)|thousand}}</td>
              <td>{{(usedTableData.curYear.cnum/1000)|thousand}}</td>
              <td>{{(usedTableData.curYear.grosssales/1000000).toFixed(0)}}</td>
              <td>{{usedTableData.curYear.effact|thousand}}</td>
            </tr>
            <tr class="mark-line">
              <td>YTD同比</td>
              <td>{{usedTableData.yearTB.openingrate}}</td>
              <td>{{usedTableData.yearTB.knum}}</td>
              <td>{{usedTableData.yearTB.cnum}}</td>
              <td>{{usedTableData.yearTB.grosssales}}</td>
              <td>{{usedTableData.yearTB.effact}}</td>
            </tr>
            <tr>
              <td>上月</td>
              <td>{{(usedTableData.prevMonth.openingrate*100).toFixed(0)}}%</td>
              <td>{{(usedTableData.prevMonth.knum/1000)|thousand}}</td>
              <td>{{(usedTableData.prevMonth.cnum/1000)|thousand}}</td>
              <td>{{(usedTableData.prevMonth.grosssales/1000000).toFixed(0)}}</td>
              <td>{{usedTableData.prevMonth.effact|thousand}}</td>
            </tr>
            <tr class="mark-line">
              <td>环比</td>
              <td>{{usedTableData.monthHB.openingrate}}</td>
              <td>{{usedTableData.monthHB.knum}}</td>
              <td>{{usedTableData.monthHB.cnum}}</td>
              <td>{{usedTableData.monthHB.grosssales}}</td>
              <td>{{usedTableData.monthHB.effact}}</td>
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
import { malls, position } from 'common/js/config'
import { formatNumber, color } from 'common/js/util'
import { formatDate } from 'common/js/date'
import echarts from 'echarts'
export default {
  name: 'monthly-total',
  data () {
    return {
      malls: malls,
      tableData: null,
      originEchartData: null,
      echart: {}
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
      return formatDate(date, 'yyyy/MM')
    },
    startMonth () {
      let date = new Date(this.selectedMonth)
      let half = date.setMonth(date.getMonth() - 5)
      return formatDate(new Date(half), 'yyyy/MM')
    },
    usedTableData () {
      let curMonth = {}
      let prevMonth = {}
      let prevYearMonth = {}
      let monthHB = {}
      let monthTB = {}
      let curYear = {}
      let prevYear = {}
      let yearTB = {}
      if (this.tableData) {
        let grosssales = this.tableData.GrossSales
        let knum = this.tableData.KNum
        let cnum = this.tableData.CNum
        let openingrate = this.tableData.OpeningRate
        let effact = this.tableData.Effact
        curMonth = {
          grosssales: grosssales[0],
          knum: knum[0],
          cnum: cnum[0],
          openingrate:openingrate[0],
          effact: effact[0]
        }
        prevMonth = {
          grosssales: grosssales[1],
          knum: knum[1],
          cnum: cnum[1],
          openingrate:openingrate[1],
          effact: effact[1]
        }
        monthHB = {
          grosssales: grosssales[1] ? (100 * (grosssales[0] - grosssales[1]) / grosssales[1]).toFixed(0) + '%' : '--',
          knum: knum[1] ? (100 * (knum[0] - knum[1]) / knum[1]).toFixed(0) + '%' : '--',
          cnum: cnum[1] ? (100 * (cnum[0] - cnum[1]) / cnum[1]).toFixed(0) + '%' : '--',
          openingrate: openingrate[1] ? (100 * (openingrate[0] - openingrate[1]) / openingrate[1]).toFixed(0) + '%' : '--',
          effact: effact[1] ? (100 * (effact[0] - effact[1]) / effact[1]).toFixed(0) + '%' : '--'
        }
        prevYearMonth = {
          grosssales: grosssales[2],
          knum: knum[2],
          cnum: cnum[2],
          openingrate:openingrate[2],
          effact: effact[2]
        }
        monthTB = {
          grosssales: grosssales[2] ? (100 * (grosssales[0] - grosssales[2]) / grosssales[2]).toFixed(0) + '%' : '--',
          knum: knum[2] ? (100 * (knum[0] - knum[2]) / knum[2]).toFixed(0) + '%' : '--',
          cnum: cnum[2] ? (100 * (cnum[0] - cnum[2]) / cnum[2]).toFixed(0) + '%' : '--',
          openingrate: openingrate[2] ? (100 * (openingrate[0] - openingrate[2]) / openingrate[2]).toFixed(0) + '%' : '--',
          effact: effact[2] ? (100 * (effact[0] - effact[2]) / effact[2]).toFixed(0) + '%' : '--'
        }
        curYear = {
          grosssales: grosssales[3],
          knum: knum[3],
          cnum: cnum[3],
          openingrate:openingrate[3],
          effact: effact[3]
        }
        prevYear = {
          grosssales: grosssales[4],
          knum: knum[4],
          cnum: cnum[4],
          openingrate:openingrate[4],
          effact: effact[4]
        }
        yearTB = {
          grosssales: grosssales[4] ? (100 * (grosssales[3] - grosssales[4]) / grosssales[4]).toFixed(0) + '%' : '--',
          knum: knum[4] ? (100 * (knum[3] - knum[4]) / knum[4]).toFixed(0) + '%' : '--',
          cnum: cnum[4] ? (100 * (cnum[3] - cnum[4]) / cnum[4]).toFixed(0) + '%' : '--',
          openingrate: openingrate[4] ? (100 * (openingrate[3] - openingrate[4]) / openingrate[4]).toFixed(0) + '%' : '--',
          effact: effact[4] ? (100 * (effact[3] - effact[4]) / effact[4]).toFixed(0) + '%' : '--'
        }
      }
      return {
        curMonth,
        prevMonth,
        monthHB,
        prevYearMonth,
        monthTB,
        curYear,
        prevYear,
        yearTB
      }
    },
    usedEchartData () {
      let xlabel = this.originEchartData.Days
      let grosssales = this.originEchartData.GrossSales.map(num => {
        return num.toFixed(0)
      })
      let knum = this.originEchartData.KNum
      let cnum = this.originEchartData.CNum
      let series = {}
      series = {
        grosssales,
        knum,
        cnum
      }
      return {
        xlabel,
        series
      }
    }
  },
  filters: {
    thousand (num) {
      return formatNumber(num, 0, 1)
    }
  },
  components: {
  },
  created () {
    this.totalQueries()
  },
  mounted () {
    // 绘制图表
    this.$nextTick(() => {
    })
  },
  methods: {
    totalQueries () {
      this.getStatistics()
      this.getEchartData()
    },
    getStatistics () {
      let opt = {
        v: 'Get_MonthTotal_Table',
        month: this.endMonth,
        MallID: this.malls[this.activeMallIndex].mallid
      }
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
          let tableData = res.data.Data
          tableData.Effact = []
          for (let i = 0; i < tableData.GrossSales.length; i++) {
            let effact = Math.round(30 * tableData.GrossSales[i] / tableData.OpeningArea[i])
            tableData.Effact.push(effact)
          }
          this.tableData = tableData
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getEchartData () {
      let opt = {
        v: 'Get_MonthTotal_Chart',
        month: this.endMonth,
        MallID: this.malls[this.activeMallIndex].mallid
      }
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
         this.originEchartData = res.data.Data
         this.initEchart()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    initEchart () {
      this.echart = echarts.init(this.$refs.detaildataechart)
      this.echart.setOption({
        color,
        tooltip: {
          trigger: 'axis',
          position
        },
        legend: {
          type: 'scroll',
          data: ['营业额', '车流量', '客流量'],
          bottom: 5,
          itemHeight: 8
        },
        textStyle: {
          fontSize: 8
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisLabel: {
            fontSize: 8,
            formatter (value, index) {
              return parseInt(value.substring(value.length - 2, value.length))
            }
          },
          data: this.usedEchartData.xlabel
        },
        yAxis: [
          {
            name: '营业额\n(百万元)',
            type: 'value',
            axisLabel: {
              formatter (value, index) {
                return value / 1000000
              },
              fontSize: 8
            }
          },
          {
            type: 'value',
            name: '客/车流量\n(千次)',
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter (value, index) {
                return (value / 1000).toFixed(0)
              },
              fontSize: 8
            }
          }
        ],
        series: [{
            name: '营业额',
            type: 'line',
            data: this.usedEchartData.series.grosssales
          },
          {
            name: '车流量',
            type: 'bar',
            stack: '流量',
            yAxisIndex: 1,
            data: this.usedEchartData.series.cnum
          },
          {
            name: '客流量',
            type: 'bar',
            stack: '流量',
            yAxisIndex: 1,
            data: this.usedEchartData.series.knum
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.monthly-total {
  .point-title{
    &:first-child{
      margin-top:0;
    }
  }
  .table{
    margin:1rem -.5rem 1rem;
    .table-wrapper{
      width:100%;
      border-top:1px solid #ddd;
      thead,
      tbody{
        tr{
          &.mark-line{
            background: #f0f0f0;
          }
          th,td{
            text-align:right;
            border-right:1px solid #ddd;
            border-bottom:1px solid #ddd;
            padding:.3rem;
            line-height:1.3;
            vertical-align: middle;
            font-size:.5rem;
            &:last-child{
              border-right: none;
            }
          }
          td{
            &:first-child{
              text-align: center;
              font-size:.5rem;
            }
          }
          th{
            background:#f2f2f2;
            font-weight: 600;
            font-size:.5rem;
            text-align: center;
          }
        }
      }
      tbody{
        tr{
          &.mark-line{
            background: #ddd;
            td{
              font-weight: 600;
              border-right:1px solid #ccc;
            }
          }
        }
      }
    }
  }
  .detail-statistics-echart{
    width:100%;
    height:11rem;
  }
}
</style>
