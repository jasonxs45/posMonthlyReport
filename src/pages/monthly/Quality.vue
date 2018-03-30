<template>
  <div class="monthly-quality">
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
      <h3 class="point-title"><span class="text">工作日与节假日分解对比</span></h3>
      <div class="echarts">
        <div class="customer-echart" ref="customerechart"></div>
        <div class="table">
          <table class="table-wrapper">
            <thead>
              <tr>
                <th rowspan="2"></th>
                <th colspan="3" style="text-align:center">客流(千次)</th>
                <th colspan="3" style="text-align:center">车流(千次)</th>
              </tr>
              <tr>
                <th>全月</th>
                <th>节假日</th>
                <th>工作日</th>
                <th>全月</th>
                <th>节假日</th>
                <th>工作日</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>上月</td>
                <td v-for="(item, index) in usedCustomerEchartData.series.prevKnum" :key="item+'-'+index">{{(item/1000).toFixed(0)}}</td>
                <td v-for="(item, index) in usedCustomerEchartData.series.prevCnum" :key="item+'-'+index">{{(item/1000).toFixed(1)}}</td>
              </tr>
              <tr>
                <td>本月</td>
                <td v-for="(item, index) in usedCustomerEchartData.series.curKnum" :key="item+'-'+index">{{(item/1000).toFixed(0)}}</td>
                <td v-for="(item, index) in usedCustomerEchartData.series.curCnum" :key="item+'-'+index">{{(item/1000).toFixed(1)}}</td>
              </tr>
              <tr>
                <td>环比</td>
                <td v-for="(item, index) in usedCustomerEchartData.monthHB" :key="'ra1'+index">
                  {{item}}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="sales-echart" ref="salesechart"></div>
        <div class="table">
          <table class="table-wrapper">
            <thead>
              <tr>
                <th rowspan="2"></th>
                <th colspan="3" style="text-align:center">日均营业额(百万元)</th>
              </tr>
              <tr>
                <th>全月</th>
                <th>节假日</th>
                <th>工作日</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>上月</td>
                <td v-for="(item, index) in usedSalesEchartData.series.prevGrossSales" :key="item+'-'+index">{{(item/1000000).toFixed(1)}}</td>
              </tr>
              <tr>
                <td>本月</td>
                <td v-for="(item, index) in usedSalesEchartData.series.curGrossSales" :key="item+'-'+index">{{(item/1000000).toFixed(1)}}</td>
              </tr>
              <tr>
                <td>环比</td>
                <td v-for="(item, index) in usedSalesEchartData.monthHB" :key="'rate'+index">
                  {{item}}
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
import { malls, position } from 'common/js/config'
import { formatNumber } from 'common/js/util'
import { formatDate, getPrevMonth } from 'common/js/date'
import echarts from 'echarts'
require('echarts/lib/chart/line')

export default {
  name: 'monthly-quality',
  data () {
    return {
      malls: malls,
      activeMallIndex: 0,
      selectedMonth: '',
      customerEchartData: null,
      salesEchartData: null,
      customerEchart: {},
      salesEchart: {}
    }
  },
  computed: {
    endMonth () {
      let date = new Date(this.selectedMonth)
      return formatDate(date, 'yyyy/MM')
    },
    startMonth () {
      let date = new Date(this.selectedMonth)
      let half = date.setMonth(date.getMonth() - 1)
      return formatDate(new Date(half), 'yyyy/MM')
    },
    usedCustomerEchartData () {
      let xlabel = ['全月日均', '节假日日均', '工作日日均']
      let series = {}
      let monthHB = []
      let monthKHB = []
      let monthCHB = []
      if (this.customerEchartData) {
        series = {
          prevKnum: this.customerEchartData.LastMonthKNum,
          prevCnum: this.customerEchartData.LastMonthCNum,
          curKnum: this.customerEchartData.ThisMonthKNum,
          curCnum: this.customerEchartData.ThisMonthCNum
        }
        for (let i = 0; i < series.prevKnum.length; i++) {
          let rate = series.prevKnum[i] ? (100 * (series.curKnum[i] - series.prevKnum[i]) /
                    series.prevKnum[i]).toFixed(0) + '%' : '--'
          monthKHB.push(rate)
        }
        for (let i = 0; i < series.prevCnum.length; i++) {
          let rate = series.prevCnum[i] ? (100 * (series.curCnum[i] - series.prevCnum[i]) /
                    series.prevCnum[i]).toFixed(0) + '%' : '--'
          monthKHB.push(rate)
        }
        monthHB = monthKHB.concat(monthCHB)
      }
      return {
        xlabel,
        series,
        monthHB
      }
    },
    usedSalesEchartData () {
      let xlabel = ['全月日均', '节假日日均', '工作日日均']
      let series = {}
      let monthHB = []
      if (this.salesEchartData) {
        series = {
          prevGrossSales: this.salesEchartData.LastMonth.map(item => {
            return item.toFixed(0)
          }),
          curGrossSales: this.salesEchartData.ThisMonth.map(item => {
            return item.toFixed(0)
          })
        }
        for (let i = 0; i < series.prevGrossSales.length; i++) {
          let rate = series.prevGrossSales[i] ? (100 * (series.curGrossSales[i] - series.prevGrossSales[i]) /
                    series.prevGrossSales[i]).toFixed(0) + '%' : '--'
          monthHB.push(rate)
        }
      }
      return {
        xlabel,
        series,
        monthHB
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
  mounted () {
    // 绘制图表
    this.$nextTick(() => {
    })
  },
  methods: {
    totalQueries () {
      this.getCustomerEchartData()
      this.getSalesEchartData()
    },
    getCustomerEchartData () {
      let opt = {
        v: 'Get_MonthQuality_Chart1',
        month1: this.startMonth,
        month2: this.endMonth,
        MallID: this.malls[this.activeMallIndex].mallid
      }
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
         this.customerEchartData = res.data.Data
         this.initCustomerEchart()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getSalesEchartData () {
      let opt = {
        v: 'Get_MonthQuality_Chart2',
        month1: this.startMonth,
        month2: this.endMonth,
        MallID: this.malls[this.activeMallIndex].mallid
      }
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
         this.salesEchartData = res.data.Data
         this.initSalesEchart()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    initCustomerEchart () {
      this.customerEchart = echarts.init(this.$refs.customerechart)
      this.customerEchart.setOption({
        tooltip: {
          trigger: 'axis',
          position
        },
        title: {
          text: '日均客/车流',
          left: 'center',
          top: 5,
          textStyle: {
            fontSize: 12
          }
        },
        legend: {
          type: 'scroll',
          data: ['上月车流', '上月客流', '本月车流', '本月客流'],
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
          data: this.usedCustomerEchartData.xlabel
        },
        yAxis: {
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
        },
        series: [
          {
            name: '上月车流',
            type: 'bar',
            data: this.usedCustomerEchartData.series.prevCnum,
            itemStyle:{
              normal:{
                color:'#a7d2ef'
              }
            }
          },
          {
            name: '上月客流',
            type: 'bar',
            data: this.usedCustomerEchartData.series.prevKnum,
            itemStyle:{
              normal:{
                color:'#278dd3'
              }
            }
          },
          {
            name: '本月车流',
            type: 'bar',
            data: this.usedCustomerEchartData.series.curCnum,
            itemStyle: {
              normal: {
                color: '#fdb984'
              }
            }
          },
          {
            name: '本月客流',
            type: 'bar',
            data: this.usedCustomerEchartData.series.curKnum,
            itemStyle: {
              normal: {
                color: '#f28227'
              }
            }
          }
        ]
      })
    },
    initSalesEchart () {
      this.salesEchart = echarts.init(this.$refs.salesechart)
      this.salesEchart.setOption({
        tooltip: {
          trigger: 'axis',
          position
        },
        title: {
          text: '日均营业额',
          left: 'center',
          top: 5,
          textStyle: {
            fontSize: 12
          }
        },
        legend: {
          type: 'scroll',
          data: ['上月', '本月'],
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
          data: this.usedSalesEchartData.xlabel
        },
        yAxis: {
          type: 'value',
          name: '营业额(百万元)',
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter (value, index) {
              return (value / 1000000).toFixed(0)
            },
            fontSize: 8
          }
        },
        series: [
          {
            name: '上月',
            type: 'bar',
            data: this.usedSalesEchartData.series.prevGrossSales,
            itemStyle:{
              normal:{
                color:'#278dd3'
              }
            }
          },
          {
            name: '本月',
            type: 'bar',
            data: this.usedSalesEchartData.series.curGrossSales,
            itemStyle: {
              normal: {
                color: '#f28227'
              }
            },
            label: {
              normal: {
                show: false,
                position: 'top',
                formatter (params) {
                  return params.value / 100000
                }
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
.monthly-quality {
  .point-title{
    margin:0;
  }
  .customer-echart,
  .sales-echart{
    width:100%;
    height:10rem;
    margin-top:.5rem;
  }
  .table{
    margin:1rem -.5rem 0;
    .table-wrapper{
      width:100%;
      border-top:1px solid #ddd;
      tr{
        th,td{
          text-align:right;
          border-right:1px solid #ddd;
          border-bottom:1px solid #ddd;
          padding:.3rem .3rem;
          vertical-align: middle;
          font-size:.5rem;
          &:last-child{
            border-right: none;
          }
        }
        td:first-child{
          text-align: left;
          padding:.4rem .3rem;
        }
        th{
          background:#f2f2f2;
          font-weight: 600;
          line-height:1.5;
          &:first-child{
            // text-align: left;
          }
        }
      }
    }
  }
}
</style>
