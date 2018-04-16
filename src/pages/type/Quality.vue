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
              <td>本月<br/>(元)</td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'curMonthSale-'+index">
                {{item|thousand}}
                </td>
            </tr>
            <tr v-show="activeTypeIndex>2">
              <td>上月<br/>(元)</td>
              <td v-for="(item, index) in usedTableData.Month2" :key="'prevMonthSale-'+index">
                {{item|thousand}}
              </td>
            </tr>
            <tr  v-show="activeTypeIndex>2" class="mark-line">
              <td>环比</td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'rate1-'+index">
                {{usedTableData.Month2[index]?(100*item/usedTableData.Month2[index] - 100).toFixed(0)+'%':'--'}}
              </td>
            </tr>
            <tr v-show="activeTypeIndex<3">
              <td>去年同期<br/>(元)</td>
              <td v-for="(item, index) in usedTableData.Month3" :key="'prevYearMonthSales-'+index">
                {{item|thousand}}
              </td>
            </tr>
            <tr v-show="activeTypeIndex<3" class="mark-line">
              <td>同比</td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'rate2-'+index">
                {{usedTableData.Month3[index]?(100*item/usedTableData.Month3[index] - 100).toFixed(0)+'%':''}}
              </td>
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
import { formatNumber } from 'common/js/util'
import { formatDate, getPrevMonth } from 'common/js/date'
import echarts from 'echarts'
const color = ['#f28227', '#2b91d5']
export default {
  name: 'type-quality',
  data () {
    return {
      malls: malls,
      compareType: [
        {
          typeId: 0,
          name: '全月同比'
        },
        {
          typeId: 1,
          name: '工作日同比'
        },
        {
          typeId: 2,
          name: '节假日同比'
        },
        {
          typeId: 3,
          name: '全月环比'
        },
        {
          typeId: 4,
          name: '工作日环比'
        },
        {
          typeId: 5,
          name: '节假日环比'
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
        MallID: this.malls[this.activeMallIndex].mallid,
        compareType: this.compareType[this.activeTypeIndex].typeId
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
      let width = this.echart.getWidth()
      let data1 = this.usedEchartData.series.monthly
      let data2 = this.usedEchartData.series.workday
      console.log(this.usedEchartData)
      let labelOption = {
        normal: {
          show: true,
          position: 'right',
          distance: 2,
          formatter (params) {
            let val1 = params.value
            let val2 = data2[params.dataIndex]
            let res
            if (val2) {
              if (val1 - val2 > 0) {
                res = `+${(100 * (val1 - val2) / val2).toFixed(0)}%`
              } else {
                res = `${(100 * (val1 - val2) / val2).toFixed(0)}%`
              }
            } else {
              res = '--'
            }
            return res
          },
          fontSize: 8
        }
      }
      this.echart.setOption({
        color,
        title: {
          show: false
        },
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
        legend: {
          type: 'scroll',
          data: ['去年同期', '本月'],
          bottom: 10,
          itemHeight: 8
        },
        grid: {
          top: 20
        },
        textStyle: {
          fontSize: 8
        },
        xAxis: {
          type: 'value',
          boundaryGap: true,
          axisLabel: {
            fontSize: 8
          }
        },
        yAxis: {
          type: 'category',
          name: '日均坪效(元)',
          nameLocation: 'center',
          nameGap: 50 - width,
          nameRotate: -90,
          axisLabel: {
            fontSize: 8
          },
          data: this.usedEchartData.xlabel
        },
        series: [
          {
            name: '去年同期',
            type: 'bar',
            barGap: '20%',
            data: data2
          },
          {
            name: '本月',
            type: 'bar',
            barGap: '20%',
            label: labelOption,
            data: data1
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
      this.getStatistics()
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
  .detail-statistics-echart{
    width:100%;
    height:10rem;
  }
  .effacttype-switch{
    text-align:center;
    .dot{
      display: inline-block;
      width:4rem;
      margin:.5rem .5rem 0;
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
  .table{
    margin:.5rem -.5rem 1rem;
    .table-wrapper{
      width:100%;
      border-top:1px solid #ddd;
      border-left:1px solid #ddd;
      .mark-line{
        background: #ddd;
        td{
          border-right-color:#ccc;
        }
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
            font-weight: 600;
          }
          &:last-child{
            border-right:none;
          }
        }
        th{
          background:#f2f2f2;
          font-weight: 600;
          font-size:.5rem;
          text-align: center;
          &.sp{
            text-decoration: underline;
            font-size:.5rem;
          }
        }
      }
    }
  }
}
</style>
