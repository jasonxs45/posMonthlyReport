<template>
  <div class="type-quality">
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
      <h3 class="point-title"><span class="text">各业态日均坪效对比</span></h3>
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
              <td>面积<br/>(㎡)</td>
              <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">{{item|thousand}}</td>
            </tr>
            <tr>
              <td>本月<br/>(元)</td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'curMonthSale-'+index">
                {{item|thousand}}
                </td>
            </tr>
            <tr>
              <td>上月<br/>(元)</td>
              <td v-for="(item, index) in usedTableData.Month2" :key="'prevMonthSale-'+index">
                {{item|thousand}}
              </td>
            </tr>
            <tr class="mark-line">
              <td>环比</td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'rate1-'+index">
                {{usedTableData.Month2[index]?(100*item/usedTableData.Month2[index] - 100).toFixed(0)+'%':'--'}}
              </td>
            </tr>
            <tr>
              <td>去年同期<br/>(元)</td>
              <td v-for="(item, index) in usedTableData.Month3" :key="'prevYearMonthSales-'+index">
                {{item|thousand}}
              </td>
            </tr>
            <tr class="mark-line">
              <td>同比</td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'rate2-'+index">
                {{usedTableData.Month3[index]?(100*item/usedTableData.Month3[index] - 100).toFixed(0)+'%':''}}
              </td>
            </tr>
            <tr>
              <td>本年累计<br/>(元)</td>
              <td v-for="(item, index) in usedTableData.Year1" :key="'curYearSales-'+index">
                {{item|thousand}}
              </td>
            </tr>
            <tr class="mark-line">
              <td>YTD同比</td>
              <td v-for="(item, index) in usedTableData.Year1" :key="'yearrate-'+index">
                {{usedTableData.Year2[index]?(100*item/usedTableData.Year2[index]-100).toFixed(0)+'%':''}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="detail-statistics">
        <h3 class="point-title"><span class="text">各业态日均坪效对比</span></h3>
        <div class="effacttype-switch">
          <label class="dot" v-for="(item, index) in compareType" :key="item.name">
            <input type="radio" name="compareType" :value="index" :checked="index===parseInt(activeTypeIndex)" @change="radioChange"/>
            <span class="text">{{item.name}}</span>
          </label>
        </div>
        <div class="detail-statistics-echart" ref="detaildataechart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import layer from 'common/js/layer'
import 'common/scss/layer.css'
import api from 'common/api'
import { malls } from 'common/js/config'
import { formatNumber } from 'common/js/util'
import { formatDate, getPrevMonth } from 'common/js/date'
import echarts from 'echarts'
const color = ['#f28227', '#feda66', '#87d850']
const grids = [
  {x: '20%', y: '50%', x1: 0, y1: '3%', width: '50%', height: '100%'},
  {x: '20%', y: '50%', x1: 0, y1: '3%', width: '50%', height: '100%'}
]
export default {
  name: 'type-quality',
  data () {
    return {
      malls: malls,
      compareType: [
        {
          typeId: 0,
          name: '环比'
        },
        {
          typeId: 1,
          name: '同比'
        }
      ],
      activeMallIndex: 0,
      activeTypeIndex: 0,
      selectedMonth: '',
      tableData: {},
      originEchartData: null,
      echart: {}
    }
  },
  computed: {
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
      return this.tableData
    },
    usedEchartData () {
      let echartdata = {}
      echartdata = {
        xlabel:  this.originEchartData.Operation.concat(this.originEchartData.Operation),
        series: {
          monthly: this.originEchartData.Month1.AllDay.concat(this.originEchartData.Month2.AllDay),
          workday: this.originEchartData.Month1.WorkDay.concat(this.originEchartData.Month2.WorkDay),
          weekly: this.originEchartData.Month1.Holiday.concat(this.originEchartData.Month2.Holiday)
        }
      }
      return echartdata
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
  },
  methods: {
    totalQueries () {
      this.getStatistics()
      this.getEchartData()
    },
    getStatistics () {
      let opt = {
        v: 'Get_OperationEffect_Table',
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
    getEchartData () {
      let opt = {
        v: 'Get_OperationEffect_Chart',
        month: this.endMonth,
        MallID: this.malls[this.activeMallIndex].mallid,
        compareType: this.compareType[this.activeTypeIndex].typeId
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
      let _self = this
      this.echart = echarts.init(this.$refs.detaildataechart)
      this.echart.setOption({
        color,
        tooltip: {
          trigger: 'axis',
          position (point, params, dom, rect, size) {
            // 固定在顶部
            var arr = [point[0], '10%']
            if (point[0] + dom.clientWidth > size.viewSize[0]) {
              arr[0] = point[0] - dom.clientWidth
            }
            return arr
          },
          axisPointer : {
            type : 'shadow'
          },
          formatter (params) {
            let title = params[0].dataIndex < 4 ? '本月' : _self.activeTypeIndex === 0 ? '上月' : '去年同期'
            let text = ''
            for (let i = 0; i < params.length; i++) {
              text += `<br/>${params[i].marker}${params[i].seriesName}:${formatNumber(params[i].value, 0, 1)}`
            }
            return title + text
          }
        },
        title: [
          {
            text: '本月',
            left: '20%',
            top: grids[0].y1,
            textStyle: {
              fontSize: 12
            }
          },
          {
            text: this.activeTypeIndex === 0 ? '上月' : '去年同期',
            right: '20%',
            top: grids[1].y1,
            textStyle: {
              fontSize: 12
            }
          }
        ],
        legend: {
          type: 'scroll',
          data: ['全月', '工作日', '节假日'],
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
          splitLine: {
            show: true,
            interval: 3,
            lineStyle: {
              color: '#000'
            }
          },
          data: this.usedEchartData.xlabel
        },
        yAxis: [
          {
            type: 'value',
            name: '日均坪效(元)',
            axisLabel: {
              fontSize: 8
            },
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
          }
        ],
        series: [
          {
            name: '全月',
            type: 'bar',
            barGap: '20%',
            data: this.usedEchartData.series.monthly
          },
          {
            name: '工作日',
            type: 'bar',
            barGap: '20%',
            data: this.usedEchartData.series.workday
          },
          {
            name: '节假日',
            type: 'bar',
            barGap: '20%',
            data: this.usedEchartData.series.weekly
          }
        ]
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
    },
    radioChange (e) {
      this.activeTypeIndex = parseInt(e.target.value)
      this.getEchartData()
    }
  }
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.type-quality {
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
        background: #f0f0f0;
      }
      tr{
        th,td{
          text-align:right;
          border-right:1px solid #ddd;
          border-bottom:1px solid #ddd;
          padding:.3rem;
          line-height:1.3;
          vertical-align: middle;
          font-size:.5rem;
          &:first-child{
            text-align: center;
          }
        }
        th{
          background:#f2f2f2;
          font-weight: 600;
          font-size:.5rem;
          &.sp{
            text-decoration: underline;
            font-size:.5rem;
            font-weight: 500;
          }
        }
      }
    }
  }
  .effacttype-switch{
    text-align:center;
    .dot{
      display: inline-block;
      width:5rem;
      margin:1rem .5rem .5rem;
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
        line-height:1.5;
        padding:.3rem;
        font-size:.5rem;
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
    height:12rem;
  }
}
</style>
