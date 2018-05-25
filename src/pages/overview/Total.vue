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
        <h3 class="point-title"><span class="text">客/车流及营业额</span></h3>
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
              <td>{{item}}</td>
              <td>{{usedTableData.OpeningRate[index]}}</td>
              <td>{{usedTableData.KNum[index]}}</td>
              <td>{{usedTableData.CNum[index]}}</td>
              <td>{{usedTableData.GrossSales[index]}}</td>
              <td>{{usedTableData.Effact[index]}}</td>
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
require('echarts/lib/chart/line')

export default {
  name: 'overview-total',
  data () {
    return {
      eldate: '',
      malls: malls,
      selectedStartMonth: '',
      tableData: null,
      originOpenData: {},
      openRateEchart: {},
      originDetailData: {},
      detailDataEchart: {}
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
      if (this.selectedStartMonth) {
        return formatDate(new Date(this.selectedStartMonth), 'yyyy-MM')
      } else {
        let date = new Date(this.selectedMonth)
        let half = date.setMonth(date.getMonth() - 5)
        return formatDate(new Date(half), 'yyyy-MM')
      }
    },
    startPickerOptions () {
      let _self = this
      return {
        disabledDate (time) {
          let minDate = new Date('2017/01')
          return time.getTime() < minDate.getTime() || time.getTime() > new Date(_self.endMonth).getTime()
        }
      }
    },
    endPickerOptions () {
      let _self = this
      return {
        disabledDate (time) {
          let minDate = new Date(_self.startMonth)
          return time.getTime() < minDate.getTime()
        }
      }
    },
    usedTableData () {
      return this.tableData
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
    this.selectedStartMonth = this.startMonth
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
          v: 'NewGetOverViewData',
          month1: this.startMonth,
          month2: this.endMonth,
          MallID: this.malls[this.activeMallIndex].mallid
      }
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
          let tableData = res.data.Data
          tableData.Effact = []
          for (let i = 0; i < tableData.Month.length; i++) {
            let effact = Math.round(30 * tableData.GrossSales[i] / tableData.OpeningArea[i])
            effact = formatNumber(effact, 0, 1)
            tableData.Effact.push(effact)
            tableData.OpeningRate[i] = (tableData.OpeningRate[i] * 100).toFixed(1)
            tableData.GrossSales[i] = formatNumber(tableData.GrossSales[i] / 1000000, 1, 1)
            tableData.KNum[i] = formatNumber(tableData.KNum[i], 0, 1)
            tableData.CNum[i] = formatNumber(tableData.CNum[i], 0, 1)
          }
          this.tableData = tableData
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
        color,
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
            data: this.usedDetailData.series.grosssale
          },
          {
            name: '车流量',
            type: 'bar',
            yAxisIndex: 1,
            data: this.usedDetailData.series.cnum
          },
          {
            name: '客流量',
            type: 'bar',
            yAxisIndex: 1,
            data: this.usedDetailData.series.knum
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
  .mall-select {
    width: 25vw;
  }
  .point-title{
    margin-top: 0;
  }
  .month-select{
    width: 55vw !important;
    height:1.4rem;
    border:1px solid #ddd;
    overflow: hidden;
    font-size:0;
    border-radius:.2rem;
    .line{
      display: inline-block;
      vertical-align: top;
      width:10%;
      font-size:.5rem;
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
