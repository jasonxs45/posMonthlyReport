<template>
  <div class="shop-main">
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
      <div class="detail-statistics">
        <div class="detail-statistics-echart" ref="detaildataechart"></div>
      </div>
      <p style="text-align:center;font-size:.55rem;color:#ff5500;margin:10px 0">注：此处食悦天仅包括美食广场部分</p>
      <div class="table">
        <table class="table-wrapper">
          <thead>
            <tr>
              <th>日期</th>
              <th>营业额合计<br/>(百万元)</th>
              <th>占全场比重<br/>(%)</th>
              <th>客流合计<br/>(千人次)</th>
              <th>占全场比重<br/>(%)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in usedTableData" :key="item.Month+'-'+index">
              <td>{{item.Month}}</td>
              <td>{{(item.Sales/1000000).toFixed(0)}}</td>
              <td>{{(100*item.Sales/item.AllSales).toFixed(0)}}%</td>
              <td>{{(item.GuestNum/1000).toFixed(0)}}</td>
              <td>{{item.AllGuestNum ? (100*item.GuestNum/item.AllGuestNum).toFixed(0) + '%' : '--'}}</td>
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
  name: 'shop-main',
  data () {
    return {
      show: true,
      malls,
      activeMallIndex: 0,
      selectedMonth: '',
      selectedStartMonth: '',
      tableData: null,
      originEchartData: null,
      detailDataEchart: {}
    }
  },
  computed: {
    endMonth () {
      let date = new Date(this.selectedMonth)
      return formatDate(date, 'yyyy/MM')
    },
    startMonth () {
      if (this.selectedStartMonth) {
        return formatDate(new Date(this.selectedStartMonth), 'yyyy/MM')
      } else {
        let date = new Date(this.selectedMonth)
        let half = date.setMonth(date.getMonth() - 5)
        return formatDate(new Date(half), 'yyyy/MM')
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
    usedEchartData () {
      return this.originEchartData
    }
  },
  filters: {
    thousand (num) {
      return formatNumber(num, 0, 1)
    }
  },
  created () {
    let day = this.$route.query.day
    let mallid = parseInt(this.$route.query.mallid)
    day = day ? day.substr(0, 4) + '-' + day.substr(4, 2) : ''
    this.activeMallIndex = mallid ? malls.findIndex(item => item.mallid === mallid) : this.activeMallIndex
    this.selectedMonth = this.$route.query.day ? day : getPrevMonth()
    this.selectedStartMonth = this.startMonth.replace('/', '-')
    this.totalQueries()
  },
  methods: {
    totalQueries () {
      this.getEchartData()
      this.getTableData()
    },
    getTableData () {
      let opt = {
        v: 'Get_Mainshop_MonthTable',
        month1: this.startMonth,
        month2: this.endMonth,
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
    getEchartData () {
      let opt = {
        v: 'Get_Mainshop_MonthChart',
        month1: this.startMonth,
        month2: this.endMonth,
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
      this.detailDataEchart = echarts.init(this.$refs.detaildataechart)
      let legendName = this.usedEchartData.Data.map(item => {
        return item.ShopName
      })
      let legend = {
        data: legendName,
        bottom: 5,
        itemHeight: 8
      }
      let series = []
      for (let i = 0; i < this.usedEchartData.Data.length; i++) {
        let item = {
          name: this.usedEchartData.Data[i].ShopName,
          type: 'line',
          data: this.usedEchartData.Data[i].Sales.map(num => {
            return num.toFixed(0)
          })
        }
        series.push(item)
      }
      console.log(series)
      this.detailDataEchart.setOption({
        grid: [
          {
            y: 40,
            height: '50%'
          }
        ],
        tooltip: {
          trigger: 'axis',
          position
        },
        legend,
        textStyle: {
          fontSize: 8
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisLabel: {
            fontSize: 8
          },
          data: this.usedEchartData.Month
        },
        yAxis: [
          {
            type: 'value',
            name: '营业额\n(百万元)',
            axisLabel: {
              formatter: function (value, index) {
                return (value / 1000000).toFixed(0)
              },
              fontSize: 8
            }
          }
        ],
        series
      })
    }
  }
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.shop-main {
  .mall-select {
    width: 25vw;
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
  .detail-statistics-echart{
    width:100%;
    height:10rem;
  }
  .table{
    margin:1rem -.5rem 0;
    .red{
      color:$success-color;
    }
    .table-wrapper{
      width:100%;
      border-top:1px solid #ddd;
      border-left:1px solid #ddd;
      tr{
        th,td{
          text-align:right;
          border-right:1px solid #ddd;
          border-bottom:1px solid #ddd;
          padding:.3rem .3rem;
          vertical-align: middle;
          font-size:.5rem;
        }
        td:first-child{
          text-align: left;
        }
        th{
          background:#f2f2f2;
          font-weight: 600;
          line-height:1.5;
          &:first-child{
            text-align: left;
          }
        }
      }
    }
  }
}
</style>
