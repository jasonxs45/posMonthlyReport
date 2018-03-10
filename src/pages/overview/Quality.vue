<template>
  <div class="overview-quality">
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
        <div class="effacttype-switch">
          <label class="dot" v-for="(item, index) in effactType" :key="item.name">
            <input type="radio" name="effacttype" :value="index" :checked="index===parseInt(activeTypeIndex)" @change="radioChange"/>
            <span class="text">{{item.sname}}</span>
          </label>
        </div>
        <div class="detail-statistics-echart" ref="detaildataechart"></div>
      </div>
      <div class="table">
        <table class="table-wrapper">
          <thead>
            <tr>
              <th rowspan="2">日期</th>
              <th colspan="2" style="text-align:center">工作日</th>
              <th colspan="2" style="text-align:center">节假日</th>
            </tr>
            <tr>
              <th>客流量(千人)</th>
              <th>坪效(元)</th>
              <th>客流量(千人)</th>
              <th>坪效(元)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in usedTableData" :key="item.month+'-'+index">
              <td style="text-decoration:underline" @click="showMonthTable(item.month)">{{item.month}}</td>
              <td>{{(item.workdayknum/1000).toFixed(0)}}</td>
              <td>{{item.workdayeffact|thousand}}</td>
              <td>{{(item.weekendknum/1000).toFixed(0)}}</td>
              <td>{{item.weekendeffact|thousand}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <transition name="scale">
      <div class="month-detail" v-if="showMonthDetail&&canShow">
        <!-- <h3 class="title">{{queriedMonth}}每日详单</h3> -->
        <div class="strange-table">
          <div class="table fixed">
            <table class="table-wrapper">
              <thead>
                <tr>
                  <th @click="sortArr('MonthDate')" :class="sortProp==='MonthDate'?'active':''">
                    <div class="th sortcolumn" :class="sortup?'up':'down'">
                      <span class="txt">日期</span>
                      <span class="arrow">
                        <i class="el-icon-caret-top"></i>
                        <i class="el-icon-caret-bottom"></i>
                      </span>
                    </div>
                  </th>
                  <!-- <th @click="sortArr('dateType')" :class="sortProp==='dateType'?'active':''">
                    <div class="th sortcolumn" :class="sortup?'up':'down'">
                      <span class="txt">工作/<br/>节假日</span>
                      <span class="arrow">
                        <i class="el-icon-caret-top"></i>
                        <i class="el-icon-caret-bottom"></i>
                      </span>
                    </div>
                  </th> -->
                  <th :class="sortProp==='dateType'?'active':''">
                    <div class="th sortcolumn" :class="sortup?'up':'down'">
                      <span class="txt">工作/<br/>节假日</span>
                      <!-- <span class="arrow">
                        <i class="el-icon-caret-top"></i>
                        <i class="el-icon-caret-bottom"></i>
                      </span> -->
                    </div>
                  </th>
                  <th>
                    <div class="th">
                      <span class="txt">客流<br/>(次)</span>
                    </div>
                  </th>
                  <th>
                    <div class="th">
                      <span class="txt">车流<br/>(次)</span>
                    </div>
                  </th>
                  <th @click="sortArr('GrossSales')" :class="sortProp==='GrossSales'?'active':''">
                    <div class="th sortcolumn" :class="sortup?'up':'down'">
                      <span class="txt">营业额<br/>(元)</span>
                      <span class="arrow">
                        <i class="el-icon-caret-top"></i>
                        <i class="el-icon-caret-bottom"></i>
                      </span>
                    </div>
                  </th>
                  <th @click="sortArr('Effact')" :class="sortProp==='Effact'?'active':''">
                    <div class="th sortcolumn" :class="sortup?'up':'down'">
                      <span class="txt">日坪效<br/>(元)</span>
                      <span class="arrow">
                        <i class="el-icon-caret-top"></i>
                        <i class="el-icon-caret-bottom"></i>
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in usedMonthData" :key="item.monthdate+'-0'+index">
                  <td>{{item.monthdate}}<br/><span :class="item.weekday==='日'||item.weekday==='六'?'red':''">星期{{item.weekday}}</span></td>
                  <td>{{item.holiday?'节假日':'工作日'}}</td>
                  <td>{{item.knum|thousand}}</td>
                  <td>{{item.cnum|thousand}}</td>
                  <td>{{item.grosssales|thousand}}</td>
                  <td>{{item.effact|thousand}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="table">
            <table class="table-wrapper">
              <thead>
                <tr>
                  <th @click="sortArr('MonthDate')" :class="sortProp==='MonthDate'?'active':''" >
                    <div class="th sortcolumn" :class="sortup?'up':'down'">
                      <span class="txt">日期</span>
                      <span class="arrow">
                        <i class="el-icon-caret-top"></i>
                        <i class="el-icon-caret-bottom"></i>
                      </span>
                    </div>
                  </th>
                  <!-- <th @click="sortArr('dateType')" :class="sortProp==='dateType'?'active':''">
                    <div class="th sortcolumn" :class="sortup?'up':'down'">
                      <span class="txt">工作/<br/>节假日</span>
                      <span class="arrow">
                        <i class="el-icon-caret-top"></i>
                        <i class="el-icon-caret-bottom"></i>
                      </span>
                    </div>
                  </th> -->
                  <th :class="sortProp==='dateType'?'active':''">
                    <div class="th sortcolumn" :class="sortup?'up':'down'">
                      <span class="txt">工作/<br/>节假日</span>
                      <!-- <span class="arrow">
                        <i class="el-icon-caret-top"></i>
                        <i class="el-icon-caret-bottom"></i>
                      </span> -->
                    </div>
                  </th>
                  <th>
                    <div class="th">
                      <span class="txt">客流<br/>(次)</span>
                    </div>
                  </th>
                  <th>
                    <div class="th">
                      <span class="txt">车流<br/>(次)</span>
                    </div>
                  </th>
                  <th @click="sortArr('GrossSales')" :class="sortProp==='GrossSales'?'active':''">
                    <div class="th sortcolumn" :class="sortup?'up':'down'">
                      <span class="txt">营业额<br/>(元)</span>
                      <span class="arrow">
                        <i class="el-icon-caret-top"></i>
                        <i class="el-icon-caret-bottom"></i>
                      </span>
                    </div>
                  </th>
                  <th @click="sortArr('Effact')" :class="sortProp==='Effact'?'active':''">
                    <div class="th sortcolumn" :class="sortup?'up':'down'">
                      <span class="txt">日坪效<br/>(元)</span>
                      <span class="arrow">
                        <i class="el-icon-caret-top"></i>
                        <i class="el-icon-caret-bottom"></i>
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in usedMonthData" :key="item.monthdate+'-'+index">
                  <td>{{item.monthdate}}<br/><span :class="item.weekday==='日'||item.weekday==='六'?'red':''">星期{{item.weekday}}</span></td>
                  <td>{{item.holiday?'节假日':'工作日'}}</td>
                  <td>{{item.knum|thousand}}</td>
                  <td>{{item.cnum|thousand}}</td>
                  <td>{{item.grosssales|thousand}}</td>
                  <td>{{item.effact|thousand}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="foot">
          <span class="btn" @click="showMonthTable">返回</span>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import layer from 'common/js/layer'
import 'common/scss/layer.css'
import api from 'common/api'
import { malls, effactType, position } from 'common/js/config'
import { formatNumber } from 'common/js/util'
import { formatDate, getPrevMonth, transferWeek } from 'common/js/date'
import echarts from 'echarts'
require('echarts/lib/chart/line')

export default {
  name: 'overview-quality',
  data () {
    return {
      show: true,
      malls,
      effactType,
      activeMallIndex: 0,
      activeTypeIndex: 0,
      selectedMonth: '',
      selectedStartMonth: '',
      tableData: null,
      originEchartData: null,
      detailDataEchart: {},
      queriedMonth:'',
      showMonthDetail: false,
      canShow: false,
      originMonthData: null,
      sortup: true,
      sortProp: ''
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
      let tableArr = []
      if (this.originEchartData) {
        for (let i = 0; i < this.originEchartData.Month.length; i++) {
          let item = {
            month: this.originEchartData.Month[i],
            workdayeffact: this.originEchartData.WorkdayEffact[i],
            weekendeffact: this.originEchartData.WeekendEffact[i],
            workdayknum: this.originEchartData.WorkdayKNum[i],
            weekendknum: this.originEchartData.WeekendKNum[i]
          }
          tableArr.push(item)
        }
      }
      return tableArr
    },
    usedEchartData () {
      let xlabel = this.originEchartData.Month
      let WorkdayEffact = this.originEchartData.WorkdayEffact
      let WeekendEffact = this.originEchartData.WeekendEffact
      for (let i = 0; i < WeekendEffact.length; i++) {
        WorkdayEffact[i] = WorkdayEffact[i].toFixed(0)
        WeekendEffact[i] = WeekendEffact[i].toFixed(0)
      }
      let series = {
        workdayeffact: this.originEchartData.WorkdayEffact,
        weekendeffact: this.originEchartData.WeekendEffact,
        workdayknum: this.originEchartData.WorkdayKNum,
        weekendknum: this.originEchartData.WeekendKNum
      }
      return {
        xlabel,
        series
      }
    },
    usedMonthData () {
      let arr = []
      if (this.originMonthData) {
        for (let i = 0; i < this.originMonthData.length; i++) {
          let item = {}
          item.monthdate = this.originMonthData[i].MonthDate
          item.weekday = transferWeek(new Date(item.monthdate).getDay())
          item.holiday = this.originMonthData[i].Holiday
          item.knum = this.originMonthData[i].KNum
          item.cnum = this.originMonthData[i].CNum
          item.grosssales = this.originMonthData[i].GrossSales
          item.effact = this.originMonthData[i].Effact
          arr.push(item)
        }
      }
      return arr
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
        v: 'Get_OverviewQuality',
        type: this.effactType[this.activeTypeIndex].typeId,
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
      this.detailDataEchart.setOption({
        tooltip: {
          trigger: 'axis',
          position
        },
        title: {
          text: this.effactType[this.activeTypeIndex].name,
          left: 'center',
          textStyle: {
            fontSize: 12
          }
        },
        legend: {
          type: 'scroll',
          data: [ '工作日坪效', '工作日客流', '节假日坪效', '节假日客流' ],
          bottom: 5,
          itemHeight: 8,
          itemWidth: 18
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
          data: this.usedEchartData.xlabel
        },
        yAxis: [
          {
            name: '坪效(元)',
            type: 'value',
            axisLabel: {
              fontSize: 8,
              formatter (value) {
                return value.toFixed(0)
              }
            }
          },
          {
            type: 'value',
            name: '客流(千人次)',
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: function (value, index) {
                return (value / 1000).toFixed(0)
              },
              fontSize: 8
            }
          }
        ],
        series: [{
            name: '工作日坪效',
            type: 'bar',
            data: this.usedEchartData.series.workdayeffact,
            itemStyle:{
              normal:{
                color:'#a7d2ef'
              }
            }
          },
          {
            name: '工作日客流',
            type: 'line',
            yAxisIndex: 1,
            data: this.usedEchartData.series.workdayknum,
            itemStyle: {
              normal: {
                color:'#278dd3'
              }
            }
          },
          {
            name: '节假日坪效',
            type: 'bar',
            data: this.usedEchartData.series.weekendeffact,
            itemStyle:{
              normal:{
                color: '#fdb984'
              }
            }
          },
          {
            name: '节假日客流',
            type: 'line',
            yAxisIndex: 1,
            data: this.usedEchartData.series.weekendknum,
            itemStyle: {
              normal: {
                color: '#f28227'
              }
            }
          }
        ]
      })
    },
    radioChange (e) {
      this.activeTypeIndex = e.target.value
      this.totalQueries()
    },
    getMonthData (month, cb) {
      let opt = {
        v: 'Get_OverviewDayData',
        month: month,
        MallID: this.malls[this.activeMallIndex].mallid
      }
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
        //  this.originMonthData = res.data.Data
          this.originMonthData = []
          for (let i = 0; i < res.data.Data.length; i++) {
            let item = {}
            item.MonthDate = formatDate(new Date(res.data.Data[i].MonthDate), 'yyyy/MM/dd')
            item.Weekday = transferWeek(new Date(item.MonthDate).getDay())
            // item.Holiday = item.Weekday === '日' || item.Weekday === '六' ? 1 : 0
            item.Holiday = res.data.Data[i].Holiday
            item.KNum = res.data.Data[i].KNum
            item.CNum = res.data.Data[i].CNum
            item.GrossSales = res.data.Data[i].GrossSales
            item.Effact = res.data.Data[i].Effact
            this.originMonthData.push(item)
          }
          this.sortArr('MonthDate')
          this.canShow = true
          cb && cb()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    sortArr (prop) {
      if (this.sortProp === prop) {
        this.originMonthData.reverse()
        this.sortup = !this.sortup
      } else {
        this.sortProp = prop
        this.sortup = true
        if (prop === 'MonthDate') {
          this.originMonthData.sort((a, b) => {
            return new Date(a[prop]).getDate() - new Date(b[prop]).getDate()
          })
        } else {
          this.originMonthData.sort((a, b) => {
            return a[prop] - b[prop]
          })
        }
      }
    },
    showMonthTable (month) {
      let self = this
      if (!this.showMonthDetail) {
        this.getMonthData(month, function () {
          self.canShow = true
        })
      } else {
        self.canShow = false
      }
      this.showMonthDetail = !this.showMonthDetail
    }
  }
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.overview-quality {
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
  .effacttype-switch{
    text-align:center;
    .dot{
      display: inline-block;
      width:4rem;
      margin:0 .5rem .5rem;
      position: relative;
      .text{
        display: block;
        border-radius: .2rem;
        width: 100%;
        height: 100%;
        background:#eee;
        -webkit-appearance:none;
        outline:none;
        transition:all .3s;
        color:#333;
        line-height:1.3;
        padding:.3rem;
      }
      input{
        display: block;
        width:100%;
        height:100%;
        position: absolute;
        top:0;
        left:0;
        opacity:0;
        &:checked+.text{
          background:$primary-color;
        }
      }
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
      tr{
        th,td{
          text-align:right;
          border-right:1px solid #ddd;
          border-bottom:1px solid #ddd;
          padding:.4rem .2rem;
          vertical-align: middle;
          font-size:.5rem;
          &:last-child{
            border-right:none;
          }
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
.month-detail{
  width:100%;
  height:100%;
  background:#fff;
  position: fixed;
  top:0;
  left:0;
  .title{
    text-align:center;
    height:1.8rem;
    line-height: 1.8rem;
    color:$primary-color;
    font-size:.7rem;
    font-weight: 500;
    background:#fff;
  }
  .foot{
    position: absolute;
    width:100%;
    left:0;
    bottom:0;
    z-index: 2;
    height:2.2rem;
    padding-top: .4rem;
    margin-top:-2.2rem;
    .btn{
      width:5rem;
      display: block;
      height:1.4rem;
      line-height: 1.4rem;
      background: $primary-color;
      margin:0 auto;
      text-align: center;
      color:#fff;
      border-radius:.2rem;
      font-size:.7rem
    }
  }
  .strange-table{
    position: relative;
    margin:0;
    width:100%;
    height:100%;
    padding-bottom: 2.2rem;
    .table{
      margin:0;
      height:100%;
      overflow-y: auto;
      -webkit-overflow-scrolling:touch;
      &.fixed{
        position: fixed;
        top:0;
        left:0;
        width:100%;
        height: 2.3rem;
        overflow: hidden;
        z-index:1;
        .table-wrapper {
          th{
            border-right:1px solid #ddd;
            border-bottom:1px solid #ddd;
            opacity: 1;
          }
        }
      }
      .table-wrapper{
        border-left:none;
        th,td{
          border-right:1px solid #ddd;
          border-bottom:1px solid #ddd;
          font-size:.5rem;
          &:last-child{
            border-right:none;
          }
          &:first-child{
            text-align: center !important
          }
        }
        th{
          opacity:0;
          border-right:1px solid transparent;
          border-bottom:1px solid transparent;
          height:2.2rem;
          &.active{
            .th{
              &.up{
                .el-icon-caret-top{
                  color:$success-color
                }
              }
              &.down{
                .el-icon-caret-bottom{
                  color:$success-color
                }
              }
            }
          }
          .th{
            font-size:0;
            position: relative;
            span{
              display: inline-block;
              vertical-align:middle;
              height:100%;
              &.txt{
                font-size:.5rem;
                padding-right:.2rem;
              }
              &.arrow{
                .el-icon-caret-top,
                .el-icon-caret-bottom{
                  font-size:.5rem;
                  position: absolute;
                  top:50%;
                  color:#888;
                }
                .el-icon-caret-top{
                  margin-top:-.45rem;
                }
                .el-icon-caret-bottom{
                  position: relative;
                  padding-top:.3rem;
                }
              }
            }
          }
        }
        td{
          &:first-child{
            line-height:1.5;
          }
        }
      }
    }
  }
}
</style>
