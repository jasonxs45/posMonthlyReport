<template>
  <div class="floor-quality">
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
      <h3 class="point-title"><span class="text">各楼层日均坪效对比</span></h3>
      <div class="mytable">
      <div class="table fixed">
        <table class="table-wrapper">
          <thead>
            <tr class="mark-line">
              <th>
                <div class="column-head">业态</div>
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
              <td><div class="column-head">面积<br/>(㎡)</div></td>
              <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
              </td>
            </tr>
            <tr>
              <td><div class="column-head">本月<br/>(元)</div></td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'curMonthSale-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
              </td>
            </tr>
            <tr>
              <td><div class="column-head">上月<br/>(元)</div></td>
              <td v-for="(item, index) in usedTableData.Month2" :key="'prevMonthSale-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
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
              <td><div class="column-head">去年同期<br/>(元)</div></td>
              <td v-for="(item, index) in usedTableData.Month3" :key="'prevYearMonthSales-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
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
            <tr>
              <td><div class="column-head">本年累计<br/>(元)</div></td>
              <td v-for="(item, index) in usedTableData.Year1" :key="'curYearSales-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
              </td>
            </tr>
            <tr class="mark-line">
              <td><div class="column-head">YTD同比</div></td>
              <td v-for="(item, index) in usedTableData.Year1" :key="'yearrate-'+index">
                <div class="column-repeat">
                  {{usedTableData.Month2[index]?(100*item/usedTableData.Month2[index] - 100).toFixed(0)+'%':'--'}}
                </div>
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
                <div class="column-head">业态</div>
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
              <td><div class="column-head">面积<br/>(㎡)</div></td>
              <td v-for="(item, index) in usedTableData.Area" :key="'area-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
              </td>
            </tr>
            <tr>
              <td><div class="column-head">本月<br/>(元)</div></td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'curMonthSale-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
              </td>
            </tr>
            <tr>
              <td><div class="column-head">上月<br/>(元)</div></td>
              <td v-for="(item, index) in usedTableData.Month2" :key="'prevMonthSale-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
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
              <td><div class="column-head">去年同期<br/>(元)</div></td>
              <td v-for="(item, index) in usedTableData.Month3" :key="'prevYearMonthSales-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
              </td>
            </tr>
            <tr class="mark-line">
              <td><div class="column-head">同比</div></td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'rate2-'+index">
                <div class="column-repeat">
                  {{usedTableData.Month3[index]?(100*item/usedTableData.Month3[index] - 100).toFixed(0)+'%':'--'}}
                </div>
              </td>
            </tr>
            <tr>
              <td><div class="column-head">本年累计<br/>(元)</div></td>
              <td v-for="(item, index) in usedTableData.Year1" :key="'curYearSales-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
              </td>
            </tr>
            <tr class="mark-line">
              <td><div class="column-head">YTD同比</div></td>
              <td v-for="(item, index) in usedTableData.Year1" :key="'yearrate-'+index">
                <div class="column-repeat">
                  {{usedTableData.Year2[index]?(100*item/usedTableData.Year2[index] - 100).toFixed(0)+'%':'--'}}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      </div>
      <div class="detail-statistics">
        <h3 class="point-title"><span class="text">各楼层日均坪效对比</span></h3>
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
const color = ['#f28227', '#2b91d5']
const grids = [
  {x: '20%', y: '50%', x1: 0, y1: '3%', width: '50%', height: '100%'},
  {x: '20%', y: '50%', x1: 0, y1: '3%', width: '50%', height: '100%'}
]
export default {
  name: 'floor-quality',
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
      let data = {
        xlabel: this.originEchartData.Location,
        series: {
          month1: this.originEchartData.ThisMonth,
          month2: this.originEchartData.LastMonth
        }
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
        v: 'Get_LocationEffect_Table',
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
        v: 'Get_LocationEffect_Chart',
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
          }
        },
        title: {
          text: this.activeTypeIndex === 0 ? '环比' : '同比',
          left: 'center',
          top: grids[1].y1,
          textStyle: {
            fontSize: 12
          }
        },
        legend: {
          type: 'scroll',
          data: ['本月', this.activeTypeIndex === 0 ? '上月' : '去年同期'],
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
          data: this.usedEchartData.xlabel
        },
        yAxis: {
          type: 'value',
          name: '日均坪效(元)',
          axisLabel: {
            fontSize: 8
          }
        },
        series: [
          {
            name: '本月',
            type: 'bar',
            data: this.usedEchartData.series.month1.map(item => {
              return item.toFixed(0)
            })
          },
          {
            name: this.activeTypeIndex === 0 ? '上月' : '去年同期',
            type: 'bar',
            data: this.usedEchartData.series.month2.map(item => {
              return item.toFixed(0)
            })
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
          location: type
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
.floor-quality {
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
        .table-wrapper{
          tr{
            td,th{
                background: #fff;
              }
            &.mark-line{
              td,th{
                background: #f0f0f0 !important;
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
