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
      <div class="detail-statistics">
        <h3 class="point-title"><span class="text">各楼层情况</span></h3>
        <div class="effacttype-switch">
          <label class="dot" v-for="(item, index) in compareType" :key="item.name">
            <input type="radio" name="compareType" :value="index" :checked="index===parseInt(activeTypeIndex)" @change="radioChange"/>
            <span class="text">{{item.name}}</span>
          </label>
        </div>
        <div class="detail-statistics-echart" ref="detaildataechart"></div>
      </div>
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
                  <div class="column-head">本月面积<br/>(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat">{{item}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="column-head">本月营业额<br/>(百万元)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Month1" :key="'curMonthSale-'+index">
                  <div class="column-repeat">{{item}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="column-head">本月坪效<br/>元/(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat">{{item}}</div>
                </td>
              </tr>
              <tr class="mark-line">
                <td>
                  <div class="column-head">去年同期面积<br/>(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line">
                <td><div class="column-head">去年同期营业额<br/>(百万元)</div></td>
                <td v-for="(item, index) in usedTableData.Month3" :key="'prevYearMonthSales-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line">
                <td>
                  <div class="column-head">去年同期坪效<br/>元/(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line1">
                <td>
                  <div class="column-head">上月面积<br/>(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line1">
                <td>
                  <div class="column-head">上月营业额<br/>(百万元)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Month2" :key="'curMonthSale-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line1">
                <td>
                  <div class="column-head">上月坪效<br/>元/(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
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
                <th
                  v-for="(item, index) in usedTableData.Location"
                  :key="'category-'+index" class="sp"
                  @click="checkDetail(item)"
                >
                  <div class="column-repeat">{{item}}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="column-head">本月面积<br/>(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat">{{item}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="column-head">本月营业额<br/>(百万元)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Month1" :key="'curMonthSale-'+index">
                  <div class="column-repeat">{{item}}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="column-head">本月坪效<br/>元/(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                  <div class="column-repeat" >{{item}}</div>
                </td>
              </tr>
              <tr class="mark-line">
                <td>
                  <div class="column-head">去年同期面积<br/>(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Month3" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line">
                <td><div class="column-head">去年同期营业额<br/>(百万元)</div></td>
                <td v-for="(item, index) in usedTableData.Month3" :key="'prevYearMonthSales-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line">
                <td>
                  <div class="column-head">去年同期坪效<br/>元/(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Month3" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line1">
                <td>
                  <div class="column-head">上月面积<br/>(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Month2" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line1">
                <td>
                  <div class="column-head">上月营业额<br/>(百万元)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Month2" :key="'curMonthSale-'+index">
                  <div class="column-repeat" v-html="item"></div>
                </td>
              </tr>
              <tr class="mark-line1">
                <td>
                  <div class="column-head">上月坪效<br/>元/(㎡)</div>
                </td>
                <td v-for="(item, index) in usedTableData.Month2" :key="'area-'+index">
                  <div class="column-repeat" v-html="item"></div>
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
import { malls } from 'common/js/config'
import {formatNumber, handleRate, color} from 'common/js/util'
import { formatDate, getPrevMonth } from 'common/js/date'
import echarts from 'echarts'
let pieItemstyle = []
for (let i = 0; i < color.length; i++) {
  let item = {
    color: color[i],
    borderWidth: 1,
    borderColor: '#fff',
    borderType: 'solid'
  }
  pieItemstyle.push(item)
}
const grids = [
  {title: '面积 ', x: '25%', y: 20, y1: 120, radius: 60},
  {title: '营业额', x: '75%', y: 20, y1: 120, radius: 60},
  {title: '30天月化坪效', x: '10%', y: 190, y1: 230, width: '80%', height: '38%'}
]
export default {
  name: 'floor-total',
  data () {
    return {
      malls: malls,
      activeMallIndex: 0,
      compareType: [
        {
          typeId: 0,
          name: '本月'
        },
        {
          typeId: 1,
          name: '去年同期'
        },
        {
          typeId: 1,
          name: '上月'
        }
      ],
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
      let curMonthSale = JSON.parse(JSON.stringify(this.tableData))
      return curMonthSale
    },
    usedEchartData () {
      let data = {
        area: [],
        effact: [],
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
        data.effact.push(
          {
            value: this.originEchartData.Area[i],
            name: this.originEchartData.Location[i],
            itemStyle: {
              color: color[i]
            }
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
      let date = this.activeTypeIndex === 0
            ? this.endMonth
            : this.activeTypeIndex === 1
            ? (parseInt(this.endMonth.split('/')[0]) - 1) + '/' + this.endMonth.split('/')[1]
            : getPrevMonth(this.endMonth)
      let opt = {
        v: 'Get_LocationSales_Table',
        month: date,
        MallID: this.malls[this.activeMallIndex].mallid
      }
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
          this.tableData = res.data.Data
          this.tableData.Area = this.tableData.Area.map(item => formatNumber(Math.round(item), 0, 1))
          // 算环比
          this.tableData.Month2 = this.tableData.Month2.map((item, index) => {
           return handleRate(item, index, this.tableData.Month1)
          })
          this.tableData.Month3 = this.tableData.Month3.map((item, index) => {
           return handleRate(item, index, this.tableData.Month1)
          })
          this.tableData.Month1 = this.tableData.Month1.map(item => formatNumber(Math.round(item / 1000000), 0, 1))
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getEchartData () {
      let date = this.activeTypeIndex === 0
            ? this.endMonth
            : this.activeTypeIndex === 1
            ? (parseInt(this.endMonth.split('/')[0]) - 1) + '/' + this.endMonth.split('/')[1]
            : getPrevMonth(this.endMonth)
      let opt = {
        v: 'Get_LocationSales_Chart',
        MallID: this.malls[this.activeMallIndex].mallid,
        month: date
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
      let title = []
      for (let i = 0; i < 3; i++) {
        let tit = {
          text: grids[i].title,
          left: i === 2 ? (parseFloat(grids[i].x) + parseFloat(grids[i].width) / 2) + '%' : grids[i].x,
          top: grids[i].y,
          textAlign: 'center',
          textStyle: {
            fontSize: 12,
            align: 'center'
          }
        }
        title.push(tit)
      }
      let series = [
        {
          name: title[0].text,
          type: 'pie',
          radius : grids[0].radius,
          center: [grids[0].x, grids[0].y1],
          data: this.usedEchartData.area,
          itemStyle,
          label,
          labelLine
        },
        {
          name: title[1].text,
          type: 'pie',
          radius : grids[1].radius,
          center: [grids[1].x, grids[1].y1],
          data: this.usedEchartData.sales,
          itemStyle,
          label,
          labelLine
        },
        {
          type: 'bar',
          data: this.usedEchartData.effact,
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
            return `${params.componentSubType === 'bar' ? title[2].text : params.seriesName}<br/>
                    ${params.marker + params.name}:${formatNumber(params.value, 0, 1)}<br/>
                    ${params.percent ? '占比:' + params.percent.toFixed(0) + '%' : ''}`
          }
        },
        legend: {
          left: 'center',
          bottom: '5%',
          data: this.usedEchartData.area.map(item => item.name),
          itemHeight: 8
        },
        grid: [
          {
            top: grids[2].y1,
            left: grids[2].x,
            width: grids[2].width,
            height: this.malls[this.activeMallIndex].mallid === 2 ? grids[2].height : '30%'
          }
        ],
        xAxis: {
          type: 'category',
          show: false,
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
          gridIndex: 0,
          data: this.usedEchartData.area.map(item => item.name)
        },
        yAxis: [
          {
            gridIndex: 0,
            type: 'value',
            name: '日均坪效(元)',
            nameGap: 8,
            axisLabel: {
              fontSize: 8
            }
          }
        ],
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
.floor-total {
  .point-title{
    &:first-child {
      margin-top:0;
    }
  }
  .detail-statistics-echart{
    width:100%;
    height:18rem;
  }
  .mytable{
    margin:1rem -.5rem 1rem;
    position: relative;
    .table{
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      &.fixed{
        position: absolute;
        left:0;
        top:0;
        width:3.8rem;
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
        .mark-line1{
          background:#ddd;
          td{
            border-right-color: #ccc;
            border-color: #ccc;
            div{
              background:#ddd !important;
            }
          }
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
              div{
                font-weight: 600;
              }
            }
            &:last-child{
              border-right:none;
            }
            div{
              padding:.3rem .1rem;
            }
            .column-head{
              width:3.8rem;
              padding: .3rem 0;
            }
            .column-repeat{
              width:3rem
            }
          }
          th{
            background:#f2f2f2;
            font-size:.5rem;
            text-align: center;
            div{
              font-weight: 600;
              padding: .3rem .1rem;
            }
            &.sp{
              text-decoration: underline;
              font-size:.5rem;
              font-weight: 600;
            }
          }
        }
      }
    }
  }
}
</style>
