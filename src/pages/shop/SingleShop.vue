<template>
  <div class="single-shop">
    <div class="shop-info">
      <div class="flexbox">
        <p class="flexbox-item shopname">租户：</p>
        <p class="flexbox-item open-date">开业时间：</p>
      </div>
      <div class="flexbox">
        <p class="flexbox-item">面积：</p>
        <p class="flexbox-item">业态：</p>
        <p class="flexbox-item">位置：</p>
      </div>
    </div>
    <div class="month-select">
      <el-date-picker v-model="selectedStartMonth" class="startMonth" type="month" format="yyyy年MM月"
      placeholder="选择开始月" popper-class="datepick-pop"
      clear-icon="none"
      :clearable=false :editable=false
      :picker-options="startPickerOptions"
      @change="totalQueries"></el-date-picker>
      <span class="line">-</span>
      <el-date-picker v-model="selectedMonth" class="endMonth" type="month" format="yyyy年MM月"
      clear-icon="none"
      :clearable=false :editable=false
      :picker-options="endPickerOptions"
      placeholder="选择结束月" popper-class="datepick-pop"
      @change="totalQueries"></el-date-picker>
    </div>
    <div class="content">
      <div class="detail-statistics-echart" ref="detaildataechart"></div>
      <div class="fktable" ref="fktable">
        <div class="table-wrapper extra"  ref="extraThead" :class="fixThead?'fixed':''">
          <div class="thead">
            <table class="mytable">
              <thead class="thead">
                <tr>
                  <th>
                    <div>日期</div>
                  </th>
                  <th>
                    <div>营业额<br/>(元)</div>
                  </th>
                  <th>
                    <div>月化坪效<br/>(元/㎡)</div>
                  </th>
                  <th>
                    <div>工作日<br/>日均营业额<br/>(元/㎡)</div>
                  </th>
                  <th>
                    <div>节假日<br/>日均营业额<br/>(元/㎡)</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in usedTableData" :key="item.monthdate+'---'+index">
                  <td><div>{{item.ShopName}}</div></td>
                  <td><div>{{item.Location}}</div></td>
                  <td><div>{{item.ShopCategory}}</div></td>
                  <td><div>{{item.Area|thousand}}</div></td>
                  <td><div>{{item.GrossSales|thousand}}</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="table-wrapper" ref="baseTable">
          <table class="mytable">
            <thead class="thead" ref="thead">
              <tr>
                <th>
                  <div>日期</div>
                </th>
                <th>
                  <div>营业额<br/>(元)</div>
                </th>
                <th>
                  <div>月化坪效<br/>(元/㎡)</div>
                </th>
                <th>
                  <div>工作日<br/>日均营业额<br/>(元/㎡)</div>
                </th>
                <th>
                  <div>节假日<br/>日均营业额<br/>(元/㎡)</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in usedTableData" :key="item.monthdate+'-'+index">
                <td><div>{{item.ShopName}}</div></td>
                <td><div>{{item.Location}}</div></td>
                <td><div>{{item.ShopCategory}}</div></td>
                <td><div>{{item.Area|thousand}}</div></td>
                <td><div>{{item.GrossSales|thousand}}</div></td>
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
import { position } from 'common/js/config'
import { formatNumber, color } from 'common/js/util'
import { formatDate, getPrevMonth } from 'common/js/date'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/dataset')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/dataZoom')
export default {
  name: 'single-shop',
  data () {
    return {
      selectedMonth: '',
      selectedStartMonth: '',
      tableData: null,
      dataset: null,
      fixThead:false
    }
  },
  computed: {
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
    }
  },
  filters: {
    thousand (num) {
      return formatNumber(num, 0, 1)
    }
  },
  created () {
    this.selectedMonth = getPrevMonth()
    this.selectedStartMonth = this.startMonth
    this.totalQueries()
  },
  mounted () {
  },
  methods: {
    totalQueries () {
      this.getEchartData()
    },
    getEchartData () {
      let opt = {
        v: 'Get_MonthTotal_Chart',
        month1: this.startMonth,
        month: this.endMonth,
        MallID: 2
      }
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
         let source = res.data.Data
         source.Days = source.Days.map(item => parseInt(item.split('/')[2]))
         source.GrossSales = source.GrossSales.map(item => Math.round(item))
         this.dataset = {
           source: {
             '日期': source.Days,
             '营业额': source.GrossSales
           }
         }
         this.initEchart()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    initEchart () {
      console.log(this.dataset)
      this.echart = echarts.init(this.$refs.detaildataechart)
      this.echart.setOption({
        color,
        tooltip: {
          trigger: 'axis',
          position
        },
        legend: {
          data: ['营业额'],
          bottom: 5,
          itemHeight: 8
        },
        textStyle: {
          fontSize: 8
        },
        dataset: this.dataset,
        // dataZoom: {
        //   type: 'inside',
        //   disabled: false
        // },
        xAxis: {
          type: 'category',
          name: '日期',
          boundaryGap: true,
          axisLabel: {
            fontSize: 8
          }
        },
        yAxis: [
          {
            name: '营业额\n(千元)',
            type: 'value',
            splitLine: {
              lineStyle: {
                color: '#ddd',
                width: 0.5
              }
            },
            axisLabel: {
              formatter (value, index) {
                return value / 1000
              },
              fontSize: 8
            }
          }
        ],
        series: [
          {
            name: '营业额',
            type: 'line'
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.flexbox{
  display: flex;
  .flexbox-item{
    flex:1;
  }
}
.single-shop {
  position: fixed;
  width:100%;
  height:100%;
  background: #fff;
  top:0;
  left:0;
  .shop-info{
    background: #f2f2f2;
    margin: .5rem;
    padding: .5rem;
    .flexbox{
      margin-top: 1rem;
      &:first-child{
        margin-top: 0;
      }
      .flexbox-item{
        font-size: .5rem;
      }
    }
    .shopname{
      font-weight: 600;
    }
  }
  .month-select{
    width: 100%;
    padding: .5rem;
    font-size: 0;
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
      width:45%;
      height:1.4rem;
      input{
        height:1.4rem;
        line-height:1.4rem;
        padding-right:5px;
      }
      .el-icon-date{
        line-height: 1.4rem;
      }
    }
    .endMonth{
      width:45%;
      input{
        height:1.4rem;
        line-height:1.4rem;
        padding-right:5px;
      }
      .el-icon-date{
        line-height: 1.4rem;
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
    height:11rem;
  }
  .fktable{
    margin-left: -.5rem;
    margin-right: -.5rem;
    margin-bottom: -.5rem;
    position: relative;
    overflow: hidden;
    .table-wrapper{
      width: 100%;
      &.extra {
        display: none;
        width: 100%;
        height:2rem;
        overflow: hidden;
        &.fixed{
          position: fixed;
          top: 0;
          left: 0;
          display: block;
          z-index: 99;
          width:100%;
          .mytable {
            th,td{
              opacity: 1;
              color: #888;
              text-align: center;
              &:first-child{
                text-align:left;
              }
            }
          }
        }
      }
      .mytable {
        width:100%;
        tr{
          th,td{
            font-size: .5rem;
            text-align: right;
            color: #333;
            line-height: 1;
            vertical-align: middle;
            border-right: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            div{
              padding:0 .2rem;
              vertical-align: middle;
            }
            &:last-child{
              div{
                border-right: none;
              }
            }
          }
          th{
            font-size: .5rem;
            text-align: center;
            color: #666;
            background: #eee;
            height: 2rem;
            div{
              position: relative;
              font-weight: 600;
              line-height:1.2;
            }
          }
        }
      }
    }
  }
}
</style>
