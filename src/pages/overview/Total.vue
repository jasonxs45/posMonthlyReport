<template>
  <div class="overview-total">
    <div class="query-conditions">
      <div class="month-select">
        <el-date-picker v-model="selectedStartMonth" class="startMonth" type="month" format="yyyy年MM月"
        placeholder="选择开始月" popper-class="datepick-pop"
        clear-icon="none"
        :clearable=false :editable=false
        :picker-options="startPickerOptions"
        @change="totalQueries"></el-date-picker>
        <span class="line">-</span>
        <el-date-picker v-model="selectedMonth" class="endMonth" type="month" format="yyyy年MM月"
        prefix-icon="none"
        clear-icon="none"
        :clearable=false :editable=false
        :picker-options="endPickerOptions"
        placeholder="选择结束月" popper-class="datepick-pop"
        @change="totalQueries"></el-date-picker>
      </div>
    </div>
    <div class="content">
      <div class="open-rate">
        <h3 class="point-title"><span class="text">开业率</span></h3>
        <div class="open-rate-echart" ref="openrateechart"></div>
      </div>
      <div class="detail-statistics">
        <h3 class="point-title"><span class="text">客流量及营业额</span></h3>
        <div class="detail-statistics-echart" ref="detaildataechart"></div>
      </div>
      <div class="table">
        <table class="table-wrapper">
          <thead>
            <tr>
              <th>月份</th>
              <th>开业率<br/>(%)</th>
              <th>客流量<br/>(人次)</th>
              <th>车流量<br/>(车次)</th>
              <th>营业额<br/>(百万元)</th>
              <th>月化坪效<br/>(元/㎡)</th>
            </tr>
          </thead>
          <tbody v-if="usedTableData">
            <tr
              v-for="(item, index) in usedTableData.Month"
              :key="'item-'+index+Math.random().toString(36).substr(2)"
            >
              <td class="line" @click="checkMonth(item)">{{item}}</td>
              <td v-html="usedTableData.OpeningRate[index]"></td>
              <td v-html="usedTableData.KNum[index]"></td>
              <td v-html="usedTableData.CNum[index]"></td>
              <td v-html="usedTableData.GrossSales[index]"></td>
              <td v-html="usedTableData.Effact[index]"></td>
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
import { formatNumber } from 'common/js/util'
import { formatDate, getPrevMonth } from 'common/js/date'
import echarts from 'echarts'
require('echarts/lib/chart/line')

export default {
  name: 'overview-total',
  data () {
    return {
      eldate: '',
      malls,
      selectedStartMonth: '',
      wholeData: [],
      tableData: null,
      originOpenData: {},
      originDetailData: {}
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
      if (!this.selectedStartMonth) {
        let date = new Date(this.endMonth)
        let dis = date.getMonth() - 5 > 0 ? date.getMonth() - 5 : 0
        let half = date.setMonth(dis)
        return formatDate(new Date(half), 'yyyy-MM')
      } else {
        return formatDate(new Date(this.selectedStartMonth), 'yyyy-MM')
      }
    },
    startPickerOptions () {
      let _self = this
      return {
        disabledDate (time) {
          let minDate = new Date(_self.endMonth)
          let year = minDate.getFullYear()
          let month = '01'
          minDate = new Date(year + '/' + month)
          return time.getTime() < minDate.getTime() || time.getTime() > new Date(_self.endMonth).getTime()
        }
      }
    },
    endPickerOptions () {
      let prevMonth = getPrevMonth()
      return {
        disabledDate (time) {
          let maxDate = new Date(prevMonth).getTime()
          return time.getTime() > maxDate
        }
      }
    },
    usedTableData () {
      let curData = {}
      let comparedData = {}
      Object.assign(
        curData,
        {
          ...this.wholeData[0],
          Effact: [],
          EffactRate: [],
          KNumRate: [],
          CNumRate: [],
          GrossSalesRate: []
        }
      )
      Object.assign(comparedData, {...this.wholeData[1], Effact: []})
      if (curData.CNum) {
        for (let i = 0; i < curData.Month.length; i++) {
          let curEffact = curData.GrossSales[i] / curData.OpeningArea[i]
          let comparedEffact = comparedData.GrossSales[i] / comparedData.OpeningArea[i]
          let effactRate = this.handleRate(curEffact, comparedEffact)
          curEffact = formatNumber(curEffact, 0, 1)
          let kNumRate = this.handleRate(curData.KNum[i], comparedData.KNum[i])
          let cNumRate = this.handleRate(curData.CNum[i], comparedData.CNum[i])
          let grossSalesRate = this.handleRate(curData.GrossSales[i], comparedData.GrossSales[i])
          curData.OpeningRate[i] = (curData.OpeningRate[i] * 100).toFixed(1)
          curData.KNum[i] = formatNumber(curData.KNum[i], 0, 1) + '<br/>' + kNumRate
          curData.CNum[i] = formatNumber(curData.CNum[i], 0, 1) + '<br/>' + cNumRate
          curData.GrossSales[i] = formatNumber(curData.GrossSales[i] / 1000000, 1, 1) + '<br/>' + grossSalesRate
          curData.Effact.push(curEffact + '<br/>' + effactRate)
          comparedData.Effact.push(comparedEffact)
        }
      }
      return curData
    },
    usedOpenData () {
      let xlabel = this.wholeData[0].Month
      let curSeries = []
      let comparedSeries = []
      for (let i = 0; i < this.wholeData[0].OpeningRate.length; i++) {
        curSeries.push((this.wholeData[0].OpeningRate[i] * 100).toFixed(1))
        comparedSeries.push((this.wholeData[1].OpeningRate[i] * 100).toFixed(1))
      }
      return {
        xlabel,
        curSeries,
        comparedSeries
      }
    },
    usedDetailData () {
      let xlabel = this.wholeData[0].Month
      let curSeries = {
        grosssale: this.wholeData[0].GrossSales.map(num => {
          return num.toFixed(0)
        }),
        knum: this.wholeData[0].KNum,
        cnum: this.wholeData[0].CNum
      }
      let comparedSeries = {
        grosssale: this.wholeData[1].GrossSales.map(num => {
          return num.toFixed(0)
        }),
        knum: this.wholeData[1].KNum,
        cnum: this.wholeData[1].CNum
      }
      return {
        xlabel,
        curSeries,
        comparedSeries
      }
    },
    openRateEchart () {
      return echarts.init(this.$refs.openrateechart)
    },
    detailDataEchart () {
      return echarts.init(this.$refs.detaildataechart)
    },
    comparedYear () {
      return new Date(this.endMonth).getFullYear()
    },
    comparedStart () {
      return (this.comparedYear - 1) + this.startMonth.substr(4)
    },
    comparedEnd () {
      return (this.comparedYear - 1) + this.endMonth.substr(4)
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
    },
    selectedMonth (newVal, oldVal) {
      let startYear = new Date(this.selectedStartMonth).getFullYear()
      let startMonth = new Date(this.selectedStartMonth).getMonth() + 1
      let endYear = new Date(newVal).getFullYear()
      let endMonth = new Date(newVal).getMonth() + 1
      if (startYear === endYear) {
        if (startMonth <= endMonth) {
          console.log(12)
        } else {
          let date = new Date(newVal)
          let dis = date.getMonth() - 5 > 0 ? date.getMonth() - 5 : 0
          let half = date.setMonth(dis)
          this.selectedStartMonth = formatDate(new Date(half), 'yyyy-MM')
        }
      } else if (startYear < endYear) {
        let date = new Date(newVal)
        let dis = date.getMonth() - 5 > 0 ? date.getMonth() - 5 : 0
        let half = date.setMonth(dis)
        this.selectedStartMonth = formatDate(new Date(half), 'yyyy-MM')
      } else {
        let date = new Date(newVal)
        let dis = date.getMonth() - 5 > 0 ? date.getMonth() - 5 : 0
        let half = date.setMonth(dis)
        this.selectedStartMonth = formatDate(new Date(half), 'yyyy-MM')
      }
    }
  },
  created () {
    this.selectedStartMonth = this.startMonth
    this.totalQueries()
  },
  methods: {
    handleRate (item, comparedItem) {
      let rate = ''
      if (comparedItem) {
        rate = Math.round(100 * (item - comparedItem) / comparedItem)
        rate = rate > 0 ? `<span class="incre">(+${rate}%)</span>` : `<span class="decre">(${rate}%)</span>`
      } else {
        rate = '<span class="down">(--)</span>'
      }
      return rate
    },
    totalQueries () {
      this.getStatistics()
    },
    _fetchStatic (start, end) {
      let opt = {
        v: 'NewGetOverViewData',
        month1: start,
        month2: end,
        MallID: this.malls[this.activeMallIndex].mallid
      }
      return api.query(opt)
    },
    getStatistics () {
      let layerindex = layer.loading('加载中')
      let curStart = this.startMonth
      let curEnd = this.endMonth
      let comparedStart = this.comparedStart
      let comparedEnd = this.comparedEnd
      Promise.all([
        this._fetchStatic(curStart, curEnd),
        this._fetchStatic(comparedStart, comparedEnd)
      ]).then(res => {
        layer.close(layerindex)
        let resArr = res.map(item => item.data.Data)
        this.wholeData = resArr
        this.initOpenRateEchart()
        this.initDetailDataEchart()
      }).catch((err) => {
        layer.close(layerindex)
        console.log(err)
      })
    },
    _fetchOpenRate (start, end) {
      let opt = {
        v: 'GetOpeningRate',
        month1: start,
        month2: end,
        MallID: this.malls[this.activeMallIndex].mallid
      }
      return api.query(opt)
    },
    _fetchDetailStatics (start, end) {
      let opt = {
        v: 'GetGrossSalesAndCK',
        month1: start,
        month2: end,
        MallID: this.malls[this.activeMallIndex].mallid
      }
      return api.query(opt)
    },
    initOpenRateEchart () {
      let legends = [`${this.comparedYear - 1}`, `${this.comparedYear}`]
      this.openRateEchart.setOption({
        color: ['#ffc2c2', '#ff0000'],
        grid: {
          top: 40
        },
        tooltip: {
          trigger: 'axis',
          position,
          formatter (params) {
            let tit = params[0].axisValue
            let content = ''
            for (let i = 0; i < params.length; i++) {
              content += `${params[i].marker}${params[i].seriesName}：${parseFloat(params[i].value).toFixed(2)}%<br/>`
            }
            return `${tit}<br/>${content}`
          }
        },
        legend: {
          type: 'scroll',
          data: legends,
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
        series: [
          {
            name: legends[0],
            type: 'line',
            data: this.usedOpenData.comparedSeries
          },
          {
            name: legends[1],
            type: 'line',
            data: this.usedOpenData.curSeries
          }
        ]
      })
    },
    initDetailDataEchart () {
      let legends = [`${this.comparedYear - 1}客流量`, `${this.comparedYear}客流量`, `${this.comparedYear - 1}营业额`, `${this.comparedYear}营业额`]
      this.detailDataEchart.setOption({
        color: ['#4472c4', '#dae3f3', '#f8cdab', '#ed7d31'],
        grid: {
          top: 40,
          bottom: 80
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          position
        },
        legend: {
          width: '70%',
          data: legends,
          bottom: 5
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
            name: '营业额\n(百万元)',
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
            name: '客流量\n(千次)',
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
        series: [
          {
            name: legends[0],
            type: 'bar',
            yAxisIndex: 1,
            data: this.usedDetailData.comparedSeries.knum
          },
          {
            name: legends[1],
            type: 'bar',
            yAxisIndex: 1,
            barMaxWidth: 70,
            data: this.usedDetailData.curSeries.knum
          },
          {
            name: legends[2],
            type: 'line',
            data: this.usedDetailData.comparedSeries.grosssale
          },
          {
            name: legends[3],
            type: 'line',
            data: this.usedDetailData.curSeries.grosssale
          }
        ]
      })
    },
    checkMonth (val) {
      let date = new Date(val.replace('/', '-'))
      this.$store.commit('getDate', new Date(date))
      this.$router.push({
        name: 'monthly'
      })
    }
  }
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.overview-total {
  .point-title{
    margin-top: 0;
  }
  .month-select{
    width: 46vw !important;
    border:1px solid #ddd;
    background: #fff;
    overflow: hidden;
    font-size:0;
    border-radius:.2rem;
    .line{
      display: inline-block;
      vertical-align: top;
      width:10%;
    }
    .line,
    .startMonth,
    .endMonth {
      display: inline-block;
      vertical-align: top;
      width:50%;
      height:1.4rem;
      input{
        border:none;
        height:1.4rem;
        line-height:1.4rem;
        padding-right:5px;
        padding-left:1rem;
        font-size:.5rem;
      }
    }
    .endMonth{
      width:40%;
      input{
        padding-left:5px;
      }
    }
    .line{
      width:10%;
      text-align:center;
      line-height:1.4rem;
    }
  }
  .table{
    margin:1rem -.5rem 1rem;
    .table-wrapper{
      width:100%;
      border-top:1px solid #ddd;
      tr{
        th,td{
          border-right:1px solid #ddd;
          border-bottom:1px solid #ddd;
          padding:.4rem .2rem;
          vertical-align: middle;
          line-height: 1.4;
          &.noright{
            border-right:none;
          }
          &:last-child{
            border-right:none;
          }
        }
        td{
          font-size:.5rem;
          text-align: right;
          &:first-child{
            text-align: center;
            font-size:.5rem;
          }
          &.line{
            text-decoration: underline;
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
  .detail-statistics{
    .point-title{
      margin-top: 1rem;
    }
    .detail-statistics-echart{
      width:100%;
      height:11rem;
      margin-top: 1rem;
    }
  }
}
</style>
