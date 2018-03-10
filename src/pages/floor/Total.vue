<template>
  <div class="floor-total">
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
      <h3 class="point-title"><span class="text">各楼层月度营业额对比</span></h3>
      <div class="mytable">
        <div class="table fixed">
          <table class="table-wrapper">
            <thead>
              <tr class="mark-line">
                <th>
                  <div class="column-head">楼层</div>
                </th>
                <th v-for="(item, index) in usedTableData.Location"
                :key="'category-'+index" class="sp"
                @click="checkDetail(item)">
                  <div class="column-repeat">{{item}}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="column-head">面积<br/>(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat">{{item|thousand}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="column-head">本月<br/>(百万元)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Month1" :key="'curMonthSale-'+index">
                  <div class="column-repeat">{{(item/1000000).toFixed(0)}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="column-head">上月<br/>(百万元)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Month2" :key="'prevMonthSale-'+index">
                  <div class="column-repeat">{{(item/1000000).toFixed(0)}}</div>
                </td>
              </tr>
              <tr class="mark-line">
                <td><div class="column-head">环比</div></td>
                <td v-for="(item, index) in usedTableData.Month1" :key="'rate1-'+index">
                  <div class="column-repeat">{{(100*item/usedTableData.Month2[index]).toFixed(0)}}%</div>
                  </td>
              </tr>
              <tr>
                <td><div class="column-head">去年同期<br/>(百万元)</div></td>
                <td v-for="(item, index) in usedTableData.Month3" :key="'prevYearMonthSales-'+index">
                  <div class="column-repeat">{{(item/1000000).toFixed(0)}}</div>
                </td>
              </tr>
              <tr class="mark-line">
                <td><div class="column-head">同比</div></td>
                <td v-for="(item, index) in usedTableData.Month1" :key="'rate2-'+index">
                  <div class="column-repeat">{{(100*item/usedTableData.Month3[index]).toFixed(0)}}%</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table">
          <table class="table-wrapper">
            <thead>
              <tr>
                <th>
                  <div class="column-head">楼层</div>
                </th>
                <th v-for="(item, index) in usedTableData.Location"
                :key="'category-'+index" class="sp"
                @click="checkDetail(item)">
                  <div class="column-repeat">{{item}}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="column-head">面积<br/>(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat">{{item|thousand}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="column-head">本月<br/>(百万元)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Month1" :key="'curMonthSale-'+index">
                  <div class="column-repeat">{{(item/1000000).toFixed(0)}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="column-head">上月<br/>(百万元)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Month2" :key="'prevMonthSale-'+index">
                  <div class="column-repeat">{{(item/1000000).toFixed(0)}}</div>
                </td>
              </tr>
              <tr class="mark-line">
                <td><div class="column-head">环比</div></td>
                <td v-for="(item, index) in usedTableData.Month1" :key="'rate1-'+index">
                  <div class="column-repeat">
                    {{usedTableData.Month2[index]?(100*item/usedTableData.Month2[index] - 100).toFixed(0)+'%':'--'}}
                  </div>
                </td>
              </tr>
              <tr>
                <td><div class="column-head">去年同期<br/>(百万元)</div></td>
                <td v-for="(item, index) in usedTableData.Month3" :key="'prevYearMonthSales-'+index">
                  <div class="column-repeat">{{(item/1000000).toFixed(0)}}</div>
                </td>
              </tr>
              <tr class="mark-line">
                <td><div class="column-head">同比</div></td>
                <td v-for="(item, index) in usedTableData.Month1" :key="'rate2-'+index">
                  <div class="column-repeat">
                    {{usedTableData.Month3[index]?(100*item/usedTableData.Month3[index] - 100).toFixed(0)+'%':''}}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="detail-statistics">
        <h3 class="point-title"><span class="text">当月各楼层情况</span></h3>
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
  {color: '#f28227', borderWidth: 1, borderColor: '#fff', borderType: 'solid'},
  {color: '#1fb922', borderWidth: 1, borderColor: '#fff', borderType: 'solid'}
]
// const grids = [
//   {x: '16.7%', y: '40%', x1: 0, y1: '5%', width: '50%', height: '100%'},
//   {x: '50%', y: '40%', x1: 0, y1: '5%', width: '50%', height: '100%'},
//   {x: '83.5%', y: '40%', x1: 0, y1: '5%', width: '50%', height: '100%'}
// ]
const grids = [
  {x: '25%', y: '40%', x1: 0, y1: '5%', width: '50%', height: '100%'},
  {x: '75%', y: '40%', x1: 0, y1: '5%', width: '50%', height: '100%'}
]
export default {
  name: 'floor-total',
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
      // let curMonthSale = {}
      return this.tableData
    },
    usedEchartData () {
      let data = {
        area: [],
        staytime: [],
        sales: []
      }
      for (let i = 0; i < this.originEchartData.Location.length; i++) {
        data.area.push(
          {
            value: this.originEchartData.Area[i].toFixed(0),
            name: this.originEchartData.Location[i],
            itemStyle: pieItemstyle[i]
          }
        )
        data.staytime.push(
          {
            value: this.originEchartData.StopTime[i],
            name: this.originEchartData.Location[i],
            itemStyle: pieItemstyle[i]
          }
        )
        data.sales.push(
          {
            value: this.originEchartData.Sales[i].toFixed(0),
            name: this.originEchartData.Location[i],
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
        v: 'Get_LocationSales_Table',
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
        v: 'Get_LocationSales_Chart',
        MallID: this.malls[this.activeMallIndex].mallid,
        month: this.endMonth
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
          show: true,
          length: 10,
          length2: 10
        }
      }
      let label = {
        normal: {
          position: 'inside',
          formatter (params) {
            return `${params.percent.toFixed(0)}%`
          }
        }
      }
      let title = [
        {
          text: '面积',
          // left: '15%',
          left:grids[0].x,
          top: grids[0].y1,
          textAlign: 'center',
          textStyle: {
            fontSize: 12
          }
        },
        // {
        //   text: '停留时间',
        //   left: '49%',
        //   top: grids[1].y1,
        //   textAlign: 'center',
        //   textStyle: {
        //     fontSize: 12
        //   }
        // },
        {
          text: '营业额',
          // left: '81%',
          left:grids[1].x,
          // top: grids[2].y1,
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
          radius : '47%',
          center: [grids[0].x, grids[0].y],
          data: this.usedEchartData.area,
          itemStyle,
          label,
          labelLine
        },
        // {
        //   name: '停留时间',
        //   type: 'pie',
        //   radius : '40%',
        //   center: [grids[1].x, grids[1].y],
        //   data: this.usedEchartData.staytime,
        //   itemStyle,
        //   label,
        //   labelLine
        // },
        {
          name: '营业额',
          type: 'pie',
          radius : '47%',
          // center: [grids[2].x, grids[2].y],
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
          bottom: '5%',
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
          location: type
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.floor-total {
  .point-title{
    margin-top:0;
  }
  .mytable{
    margin:.5rem -.5rem 1rem;
    position: relative;
    .table{
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      &.fixed{
        position: absolute;
        left:0;
        top:0;
        width:3rem;
        overflow: hidden;
        box-shadow: 0 0 1px 0 rgba(0,0,0,.2);
        z-index:10;
        .table-wrapper{
          tr{
            td,th{
                div{
                  background: #fff;
                }
              }
            &.mark-line{
              td,th{
                div{
                  background: #f0f0f0 !important;
                }
              }
            }
          }
        }
        & + .table{
          .table-wrapper{
            tr{
              th,td{
                &:first-child{
                  div{
                    color:transparent
                  }
                }
              }
            }
          }
        }
      }
      .table-wrapper{
        border-top:1px solid #ddd;
        .mark-line{
          background:#f0f0f0;
        }
        tr{
          th,td{
            text-align:right;
            line-height:1.3;
            vertical-align: middle;
            font-size:.5rem;
            border-right:1px solid #ddd;
            border-bottom:1px solid #ddd;
            &:first-child{
              text-align: center;
            }
            div{
              padding:.3rem;
            }
            .column-head{
              width:3rem
            }
            .column-repeat{
              width:3.5rem
            }
          }
          th{
            background:#f2f2f2;
            font-size:.5rem;
            div{
              font-weight: 600;
            }
            &.sp{
              text-decoration: underline;
              font-size:.5rem;
              font-weight: 500;
            }
          }
        }
      }
    }
  }
  .detail-statistics-echart{
    width:100%;
    height:10rem;
  }
}
</style>
