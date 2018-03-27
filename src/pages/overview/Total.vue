<template>
  <div class="overview-total">
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
        :clearable=false :editable=false :default-value="new Date(selectedMonth)"
        placeholder="选择月" class="month-select" popper-class="datepick-pop"
        @change="totalQueries"></el-date-picker>
    </div>
    <div class="content">
      <div class="table">
        <table class="table-wrapper">
          <thead>
            <tr>
              <th></th>
              <th class="noright">本月</th>
              <th class="noright">同比</th>
              <th>环比</th>
              <th class="noright">本年</th>
              <th>同比</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>客流(车次)</td>
              <td class="noright">{{usedTableData.curMonth.knum}}</td>
              <td class="noright">{{usedTableData.prevYearMonth.knum}}</td>
              <td>{{usedTableData.prevMonth.knum}}</td>
              <td class="noright">{{usedTableData.curYear.knum}}</td>
              <td>{{usedTableData.prevYear.knum}}</td>
            </tr>
            <tr>
              <td>车流(人次)</td>
              <td class="noright">{{usedTableData.curMonth.cnum}}</td>
              <td class="noright">{{usedTableData.prevYearMonth.cnum}}</td>
              <td>{{usedTableData.prevMonth.cnum}}</td>
              <td class="noright">{{usedTableData.curYear.cnum}}</td>
              <td>{{usedTableData.prevYear.cnum}}</td>
            </tr>
            <tr>
              <td>营业额(元)</td>
              <td class="noright">{{usedTableData.curMonth.grosssales}}</td>
              <td class="noright">{{(usedTableData.prevYearMonth.grosssales)}}</td>
              <td>{{usedTableData.prevMonth.grosssales}}</td>
              <td class="noright">{{usedTableData.curYear.grosssales}}</td>
              <td>{{usedTableData.prevYear.grosssales}}</td>
            </tr>
            <!-- <tr>
              <td>面积(㎡)</td>
              <td class="noright">{{usedTableData.curMonth.grosssales|thousand}}</td>
              <td class="noright">{{(usedTableData.prevYearMonth.grosssales * 100).toFixed(0)}}%</td>
              <td>{{(usedTableData.prevMonth.grosssales * 100).toFixed(0)}}%</td>
              <td class="noright">{{usedTableData.curYear.grosssales|thousand}}</td>
              <td>{{(usedTableData.prevYear.grosssales * 100).toFixed(0)}}%</td>
            </tr>
            <tr>
              <td>店铺数</td>
              <td class="noright">{{usedTableData.curMonth.grosssales|thousand}}</td>
              <td class="noright">{{(usedTableData.prevYearMonth.grosssales * 100).toFixed(0)}}%</td>
              <td>{{(usedTableData.prevMonth.grosssales * 100).toFixed(0)}}%</td>
              <td class="noright">{{usedTableData.curYear.grosssales|thousand}}</td>
              <td>{{(usedTableData.prevYear.grosssales * 100).toFixed(0)}}%</td>
            </tr> -->
          </tbody>
        </table>
      </div>
      <div class="open-rate">
        <h3 class="point-title"><span class="text">开业率</span></h3>
        <div class="open-rate-echart" ref="openrateechart"></div>
      </div>
      <div class="detail-statistics">
        <h3 class="point-title"><span class="text">客/车流及营业额</span></h3>
        <div class="detail-statistics-echart" ref="detaildataechart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import layer from 'common/js/layer'
import 'common/scss/layer.css'
import api from 'common/api'
import { malls, position } from 'common/js/config'
import { formatNumber } from 'common/js/util'
import { formatDate, getPrevMonth } from 'common/js/date'
import echarts from 'echarts'
require('echarts/lib/chart/line')

export default {
  name: 'overview-total',
  data () {
    return {
      eldate: '',
      malls: malls,
      activeMallIndex: 0,
      selectedMonth: '',
      tableData: null,
      originOpenData: {},
      openRateEchart: {},
      originDetailData: {},
      detailDataEchart: {}
    }
  },
  computed: {
    endMonth () {
      let date = new Date(this.selectedMonth)
      return formatDate(date, 'yyyy-MM')
    },
    startMonth () {
      let date = new Date(this.selectedMonth)
      let half = date.setMonth(date.getMonth() - 5)
      return formatDate(new Date(half), 'yyyy-MM')
    },
    usedTableData () {
      let curMonth = {}
      let prevMonth = {}
      let prevYearMonth = {}
      let curYear = {}
      let prevYear = {}
      if (this.tableData) {
        let grosssales = this.tableData.GrossSales
        let knum = this.tableData.KNum
        let cnum = this.tableData.CNum
        curMonth = {
          grosssales: formatNumber(grosssales.month1, 0, 1),
          knum: formatNumber(knum.month1, 0, 1),
          cnum: formatNumber(cnum.month1, 0, 1)
        }
        prevMonth = {
          grosssales: grosssales.month2 ? (100 * (grosssales.month1 - grosssales.month2) / grosssales.month2).toFixed(0) + '%' : '--',
          knum: knum.month2 ? (100 * (knum.month1 - knum.month2) / knum.month2).toFixed(0) + '%' : '--',
          cnum: cnum.month2 ? (100 * (cnum.month1 - cnum.month2) / cnum.month2).toFixed(0) + '%' : '--'
        }
        prevYearMonth = {
          grosssales: grosssales.month3 ? (100 * (grosssales.month1 - grosssales.month3) / grosssales.month3).toFixed(0) + '%' : '--',
          knum: knum.month3 ? (100 * (knum.month1 - knum.month3) / knum.month3).toFixed(0) + '%' : '--',
          cnum: cnum.month3 ? (100 * (cnum.month1 - cnum.month3) / cnum.month3).toFixed(0) + '%' : '--'
        }
        curYear = {
          grosssales: formatNumber(grosssales.year1, 0, 1),
          knum: formatNumber(knum.year1, 0, 1),
          cnum: formatNumber(cnum.year1, 0, 1)
        }
        prevYear = {
          grosssales: grosssales.year2 ? (100 * (grosssales.year1 - grosssales.year2) / grosssales.year2).toFixed(0) + '%' : '--',
          knum: knum.year2 ? (100 * (knum.year1 - knum.year2) / knum.year2).toFixed(0) + '%' : '--',
          cnum: cnum.year2 ? (100 * (cnum.year1 - cnum.year2) / cnum.year2).toFixed(0) + '%' : '--'
        }
      }
      return {
        curMonth,
        prevMonth,
        prevYearMonth,
        curYear,
        prevYear
      }
    },
    usedOpenData () {
      let xlabel = this.originOpenData.Month
      let series = []
      for (let i = 0; i < this.originOpenData.OpeningRate.length; i++) {
        series.push((this.originOpenData.OpeningRate[i] * 100).toFixed(1))
      }
      return {
        xlabel,
        series
      }
    },
    usedDetailData () {
      let xlabel = this.originDetailData.Month
      let series = {
        grosssale: this.originDetailData.GrossSales.map(num => {
          return num.toFixed(0)
        }),
        knum: this.originDetailData.KNum,
        cnum: this.originDetailData.CNum
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
    this.selectedMonth = getPrevMonth()
    this.totalQueries()
  },
  methods: {
    totalQueries () {
      this.getStatistics()
      this.getOpenRate()
      this.getDetailStatistics()
    },
    getStatistics () {
      let opt = {
          v: 'GetOverViewData',
          month: this.endMonth,
          MallID: this.malls[this.activeMallIndex].mallid
      }
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
          this.tableData = res.data.Data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getOpenRate () {
      // 获取数据
      let opt = {
        v: 'GetOpeningRate',
        month1: this.startMonth,
        month2: this.endMonth,
        MallID: this.malls[this.activeMallIndex].mallid
      }
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
          this.originOpenData = res.data.Data
          this.initOpenRateEchart()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getDetailStatistics () {
      let opt = {
        v: 'GetGrossSalesAndCK',
        month1: this.startMonth,
        month2: this.endMonth,
        MallID: this.malls[this.activeMallIndex].mallid
      }
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
          this.originDetailData = res.data.Data
          this.initDetailDataEchart()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    initOpenRateEchart () {
      this.openRateEchart = echarts.init(this.$refs.openrateechart)
      this.openRateEchart.setOption({
        grid: {
          top: 40
        },
        tooltip: {
          trigger: 'axis',
          position,
          formatter (params) {
            return `${params[0].axisValue}<br/>${params[0].marker}${params[0].seriesName}：${params[0].value}%`
          }
        },
        legend: {
          type: 'scroll',
          data: ['开业率'],
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
            fontSize: 8
          },
          data: this.usedOpenData.xlabel
        },
        yAxis: {
          name: '开业率(%)',
          type: 'value',
          axisLabel: {
            formatter (value, index) {
              return value.toFixed(0)
            },
            fontSize: 8
          },
          min: 60,
          max: 100
        },
        series: {
          name: '开业率',
          type: 'line',
          data: this.usedOpenData.series
        }
      })
    },
    initDetailDataEchart () {
      this.detailDataEchart = echarts.init(this.$refs.detaildataechart)
      this.detailDataEchart.setOption({
        grid: {
          top: 40
        },
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
            fontSize: 8
          },
          data: this.usedDetailData.xlabel
        },
        yAxis: [
          {
            name: '营业额(百万)',
            type: 'value',
            axisLabel: {
              formatter (value, index) {
                return (value / 1000000).toFixed(0)
              },
              fontSize: 8
            }
          },
          {
            type: 'value',
            name: '客/车流量(千次)',
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
            data: this.usedDetailData.series.grosssale,
            itemStyle:{
              normal:{
                color:'#278dd3'
              }
            }
          },
          {
            name: '车流量',
            type: 'bar',
            yAxisIndex: 1,
            data: this.usedDetailData.series.cnum,
            itemStyle:{
              normal:{
                color:'#666'
              }
            }
          },
          {
            name: '客流量',
            type: 'bar',
            yAxisIndex: 1,
            data: this.usedDetailData.series.knum,
            itemStyle: {
              normal: {
                color: '#e78f72'
              }
            }
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.overview-total {
  .table{
    margin:0 -.5rem 1rem;
    .table-wrapper{
      width:100%;
      border-top:1px solid #ddd;
      tr{
        th,td{
          text-align:right;
          border-right:1px solid #ddd;
          border-bottom:1px solid #ddd;
          padding:.4rem .2rem;
          vertical-align: middle;
          &.noright{
            border-right:none;
          }
          &:last-child{
            border-right:none;
          }
        }
        td{
          font-size:.5rem;
          &:first-child{
            text-align: left;
            font-size:.5rem;
          }
        }
        th{
          background:#f2f2f2;
          font-weight: 600;
        }

      }
    }
  }
  .open-rate-echart{
    width:100%;
    height:8rem;
  }
  .detail-statistics-echart{
    width:100%;
    height:10rem;
  }
}
</style>
