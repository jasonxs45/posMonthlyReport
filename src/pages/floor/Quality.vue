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
              <td><div class="column-head">本月<br/>(元)</div></td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'curMonthSale-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
              </td>
            </tr>
            <tr v-show="activeTypeIndex>2">
              <td><div class="column-head">上月<br/>(元)</div></td>
              <td v-for="(item, index) in usedTableData.Month2" :key="'prevMonthSale-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
              </td>
            </tr>
            <tr v-show="activeTypeIndex>2" class="mark-line">
              <td><div class="column-head">环比</div></td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'rate1-'+index">
                <div class="column-repeat">
                  {{usedTableData.Month2[index]?(100*item/usedTableData.Month2[index] - 100).toFixed(0)+'%':'--'}}
                </div>
              </td>
            </tr>
            <tr v-show="activeTypeIndex<3">
              <td><div class="column-head">去年同期<br/>(元)</div></td>
              <td v-for="(item, index) in usedTableData.Month3" :key="'prevYearMonthSales-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
              </td>
            </tr>
            <tr v-show="activeTypeIndex<3" class="mark-line">
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
              <td><div class="column-head">本月<br/>(元)</div></td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'curMonthSale-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
              </td>
            </tr>
            <tr v-show="activeTypeIndex>2">
              <td><div class="column-head">上月<br/>(元)</div></td>
              <td v-for="(item, index) in usedTableData.Month2" :key="'prevMonthSale-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
              </td>
            </tr>
            <tr v-show="activeTypeIndex>2" class="mark-line">
              <td><div class="column-head">环比</div></td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'rate1-'+index">
                <div class="column-repeat">
                  {{usedTableData.Month2[index]?(100*item/usedTableData.Month2[index] - 100).toFixed(0)+'%':'--'}}
                </div>
              </td>
            </tr>
            <tr v-show="activeTypeIndex<3">
              <td><div class="column-head">去年同期<br/>(元)</div></td>
              <td v-for="(item, index) in usedTableData.Month3" :key="'prevYearMonthSales-'+index">
                <div class="column-repeat">{{item|thousand}}</div>
              </td>
            </tr>
            <tr v-show="activeTypeIndex<3" class="mark-line">
              <td><div class="column-head">同比</div></td>
              <td v-for="(item, index) in usedTableData.Month1" :key="'rate2-'+index">
                <div class="column-repeat">
                  {{usedTableData.Month3[index]?(100*item/usedTableData.Month3[index] - 100).toFixed(0)+'%':'--'}}
                </div>
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
import { formatNumber } from 'common/js/util'
import { formatDate, getPrevMonth } from 'common/js/date'
import echarts from 'echarts'
const color = ['#f28227', '#2b91d5']
export default {
  name: 'floor-quality',
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
      let _self = this
      this.echart = echarts.init(this.$refs.detaildataechart)
      let width = this.echart.getWidth()
      let data1 = this.usedEchartData.series.month1
      let data2 = this.usedEchartData.series.month2
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
    &:first-child{
      margin-top:0;
    }
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
                  font-weight: 600;
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
              width:3rem;
              font-weight: 600;
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
  .detail-statistics-echart{
    width:100%;
    height:14rem;
  }
}
</style>
