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
      <div class="detail-statistics">
        <h3 class="point-title"><span class="text">业态配比</span></h3>
        <div class="effacttype-switch">
          <label class="dot" v-for="(item, index) in compareType" :key="item.name">
            <input type="radio" name="compareType" :value="index" :checked="index===parseInt(activeTypeIndex)" @change="radioChange"/>
            <span class="text">{{item.name}}</span>
          </label>
        </div>
        <div class="detail-statistics-echart" ref="detaildataechart"></div>
      </div>
      <h3 class="point-title"><span class="text">各业态月度对比</span></h3>
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
              <td>本月面积<br/>(㎡)</td>
              <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">{{item}}</td>
            </tr>
            <tr>
              <td>本月营业额<br/>(百万元)</td>
              <td
                v-for="(item, index) in usedTableData.Month1"
                :key="'curMonthSale-'+index"
              >{{item}}</td>
            </tr>
            <tr>
              <td>本月坪效<br/>(元/㎡)</td>
              <td
                v-for="(item, index) in usedTableData.Month1"
                :key="'curMonthSale-'+index"
              >{{item}}</td>
            </tr>
            <tr class="mark-line">
              <td>去年同期面积<br/>(㎡)</td>
              <td
                v-for="(item, index) in usedTableData.Month3"
                v-html="item"
                :key="'area-'+index"
              ></td>
            </tr>
            <tr class="mark-line">
              <td>去年同期营业额<br/>(百万元)</td>
              <td
                v-for="(item, index) in usedTableData.Month3"
                v-html="item"
                :key="'prevYearMonthSales-'+index"
              ></td>
            </tr>
            <tr class="mark-line">
              <td>去年同期坪效<br/>(元/㎡)</td>
              <td
                v-for="(item, index) in usedTableData.Month3"
                v-html="item"
                :key="'curMonthSale-'+index"
              ></td>
            </tr>
            <tr class="mark-line1">
              <td>上月面积<br/>(㎡)</td>
              <td
                v-for="(item, index) in usedTableData.Month2"
                :key="'area-'+index"
                v-html="item"
              ></td>
            </tr>
            <tr class="mark-line1">
              <td>上月营业额<br/>(百万元)</td>
              <td
                v-for="(item, index) in usedTableData.Month2"
                v-html="item"
                :key="'prevMonthSale-'+index"
              ></td>
            </tr>
            <tr class="mark-line1">
              <td>上月坪效<br/>(元/㎡)</td>
              <td
                v-for="(item, index) in usedTableData.Month2"
                v-html="item"
                :key="'curMonthSale-'+index"
              ></td>
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
import { formatNumber, handleRate, color } from 'common/js/util'
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
  {title: '30天月化坪效', x: '10%', y: 200, y1: 250, width: '80%', height: '33%'}
]
export default {
  name: 'type-total',
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
      return this.tableData
    },
    usedEchartData () {
      let data = {
        area: [],
        sales: [],
        effact: []
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
        data.effact.push(
          {
            value: Math.round(Math.random() * 999),
            name: this.originEchartData.Operation[i],
            itemStyle: {
              color: pieItemstyle[i].color
            }
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
        v: 'Get_OperationSales_Table',
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
        v: 'Get_OperationSales_Chart',
        month: date,
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
          barWidth: 30,
          itemStyle,
          label,
          labelLine
        }
      ]
      // 绑定图例点击事件
      this.echart.on('legendselectchanged', params => {
        // 筛选柱状图 具体数值
        series[2].data = this.usedEchartData.effact.filter((item, index) => {
          return index !== Object.values(params.selected).findIndex(item => item === false)
        })
        this.echart.setOption({
          xAxis: {
            data: this.usedEchartData.area.filter(item => params.selected[item.name]).map(item => item.name)
          },
          series
        })
      })
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
          bottom: '6%',
          data: this.usedEchartData.area.map(item => item.name),
          itemHeight: 8
        },
        grid: [
          {
            top: grids[2].y1,
            left: grids[2].x,
            width: grids[2].width,
            height: grids[2].height
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
      .mark-line1{
        background:#ddd;
        td{
          border-right-color: #ccc;
          border-color: #ccc;
        }
      }
      tr{
        th,td{
          text-align:right;
          border-right:1px solid #ddd;
          border-bottom:1px solid #ddd;
          padding:.3rem .1rem;
          line-height:1.3;
          vertical-align: middle;
          font-size:.5rem;
          &:first-child{
            text-align: center;
            padding: .3rem 0;
            font-weight: 600;
          }
          &:last-child{
            border-right: none;
          }
        }
        th{
          background:#f2f2f2;
          font-weight: 600;
          font-size:.5rem;
          text-align: center;
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
    height:18rem;
  }
}
</style>
