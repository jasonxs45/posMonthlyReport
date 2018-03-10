<template>
  <div class="type-total">
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
      <h3 class="point-title"><span class="text">各业态月度营业额对比</span></h3>
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
              <td>本月<br/>(百万元)</td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'curMonthSale-'+index">
                {{(item/1000000).toFixed(0)}}
                </td>
            </tr>
            <tr>
              <td>上月<br/>(百万元)</td>
              <td v-for="(item, index) in usedTableData.Month2" :key="'prevMonthSale-'+index">
                {{(item/1000000).toFixed(0)}}
              </td>
            </tr>
            <tr class="mark-line">
              <td>环比</td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'rate1-'+index">
                {{usedTableData.Month2[index]?(100*item/usedTableData.Month2[index] - 100).toFixed(0)+'%':'--'}}
                </td>
            </tr>
            <tr>
              <td>去年同期<br/>(百万元)</td>
              <td v-for="(item, index) in usedTableData.Month3" :key="'prevYearMonthSales-'+index">
                {{(item/1000000).toFixed(0)}}
              </td>
            </tr>
            <tr class="mark-line">
              <td>同比</td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'rate2-'+index">
                {{usedTableData.Month3[index]?(100*item/usedTableData.Month3[index] - 100).toFixed(0)+'%':''}}
              </td>
            </tr>
            <tr>
              <td>本年累计<br/>(百万元)</td>
              <td v-for="(item, index) in usedTableData.Year1" :key="'curYearSales-'+index">
                {{(item/1000000).toFixed(0)}}
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
        <h3 class="point-title"><span class="text">当月业态配比</span></h3>
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
const pieItemstyle = [
  {color: '#feda66', borderWidth: 1, borderColor: '#fff', borderType: 'solid'},
  {color: '#3699d9', borderWidth: 1, borderColor: '#fff', borderType: 'solid'},
  {color: '#999', borderWidth: 1, borderColor: '#fff', borderType: 'solid'},
  {color: '#f28227', borderWidth: 1, borderColor: '#fff', borderType: 'solid'}
]
const grids = [
  {x: '25%', y: '50%', x1: 0, y1: '10%', width: '50%', height: '100%'},
  {x: '75%', y: '50%', x1: 0, y1: '10%', width: '50%', height: '100%'}
]
export default {
  name: 'type-total',
  data () {
    return {
      malls: malls,
      activeMallIndex: 0,
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
      let data = {
        area: [],
        sales: []
      }
      for (let i = 0; i < this.originEchartData.Operation.length; i++) {
        data.area.push(
          {
            value: this.originEchartData.Area[i].toFixed(0),
            name: this.originEchartData.Operation[i],
            itemStyle: pieItemstyle[i]
          }
        )
        data.sales.push(
          {
            value: this.originEchartData.Sales[i].toFixed(0),
            name: this.originEchartData.Operation[i],
            itemStyle: pieItemstyle[i]
          }
        )
      }
      return data
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
        v: 'Get_OperationSales_Table',
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
        v: 'Get_OperationSales_Chart',
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
      let itemStyle = {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        }
      }
      let labelLine = {
        normal: {
          show: false
        }
      }
      let label = {
        normal: {
          position: 'inside',
          formatter (params) {
            return params.percent.toFixed(0) + '%'
          }
        }
      }
      let title = [
        {
          text: '面积',
          left: '24%',
          top: grids[0].y1,
          textAlign: 'center',
          textStyle: {
            fontSize: 12
          }
        },
        {
          text: '营业额',
          left: '74%',
          top: grids[1].y1,
          textAlign: 'center',
          textStyle: {
            fontSize: 12
          }
        }
      ]
      let series = [
        {
          name: '面积',
          type: 'pie',
          radius : '50%',
          center: [grids[0].x, grids[0].y],
          data: this.usedEchartData.area,
          itemStyle,
          label,
          labelLine
        },
        {
          name: '营业额',
          type: 'pie',
          radius : '50%',
          center: [grids[1].x, grids[1].y],
          data: this.usedEchartData.sales,
          itemStyle,
          label,
          labelLine
        }
      ]
      this.echart.setOption({
        title,
        textStyle: {
          fontSize: 8
        },
        tooltip : {
          trigger: 'item',
          formatter (params) {
            return `${params.seriesName}<br/>${params.marker + params.name}:${formatNumber(params.value, 0, 1)}<br/>占比:${params.percent.toFixed(0)}%`
          }
        },
        legend: {
          left: 'center',
          bottom: '10%',
          data: this.usedEchartData.Category,
          itemHeight: 8
        },
        series
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
    }
  }
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.type-total {
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
        background:#f0f0f0;
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
            line-height:2;
          }
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
