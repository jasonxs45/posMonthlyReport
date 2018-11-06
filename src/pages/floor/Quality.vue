<template>
  <div class="floor-quality">
    <div class="query-conditions">
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
              <th v-for="(item, index) in tableData.Location"
              :key="'category-'+index" class="sp"
              @click="checkDetail(item)">
                <div class="column-repeat">{{item}}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><div class="column-head">本月<br/>(元)</div></td>
              <td v-for="(item, index) in tableData.Month1" :key="'curMonthSale-'+index">
                <div class="column-repeat">{{item}}</div>
              </td>
            </tr>
            <tr>
              <td><div class="column-head">{{activeTypeIndex>2?'上月':'去年同期'}}<br/>(元)</div></td>
              <td v-for="(item, index) in tableData.Month2" :key="'prevMonthSale-'+index">
                <div class="column-repeat">{{item}}</div>
              </td>
            </tr>
            <tr class="mark-line">
              <td><div class="column-head">{{activeTypeIndex>2?'环比':'同比'}}<br/>(元)</div></td>
              <td v-for="(item, index) in tableData.Rate" :key="'rate1-'+index">
                <div class="column-repeat">
                  {{item}}
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
              <th v-for="(item, index) in tableData.Location"
              :key="'category-'+index" class="sp"
              @click="checkDetail(item)">
                <div class="column-repeat">{{item}}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><div class="column-head">本月<br/>(元)</div></td>
              <td v-for="(item, index) in tableData.Month1" :key="'curMonthSale-'+index">
                <div class="column-repeat">{{item}}</div>
              </td>
            </tr>
            <tr>
              <td><div class="column-head">{{activeTypeIndex>2?'上月':'去年同期'}}<br/>(元)</div></td>
              <td v-for="(item, index) in tableData.Month2" :key="'prevMonthSale-'+index">
                <div class="column-repeat">{{item}}</div>
              </td>
            </tr>
            <tr class="mark-line">
              <td><div class="column-head">{{activeTypeIndex>2?'环比':'同比'}}<br/>(元)</div></td>
              <td v-for="(item, index) in tableData.Rate" :key="'rate1-'+index">
                <div class="column-repeat">
                  {{item}}
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
import { malls, position } from 'common/js/config'
import { formatNumber } from 'common/js/util'
import { formatDate } from 'common/js/date'
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
      activeTypeIndex: 0,
      tableData: {
        Operation: [],
        Month1: [],
        Month2: []
      },
      dataset: {},
      echart: {}
    }
  },
  computed: {
    activeMallIndex: {
      get () {
        return this.$store.state.activeMallIndex
      },
      set (value) {
        this.$store.commit('getMallId', value)
      }
    },
    selectedMonth: {
      get () {
        return this.$store.state.selectedMonth
      },
      set (value) {
        this.$store.commit('getDate', value)
      }
    },
    endMonth () {
      let date = new Date(this.selectedMonth)
      return formatDate(date, 'yyyy/MM')
    },
    startMonth () {
      let date = new Date(this.selectedMonth)
      let half = date.setMonth(date.getMonth() - 5)
      return formatDate(new Date(half), 'yyyy/MM')
    }
  },
  filters: {
    thousand (num) {
      return formatNumber(num, 0, 1)
    }
  },
  watch: {
    activeMallIndex (newVal, oldVal) {
      this.totalQueries()
    }
  },
  created () {
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
        v: 'Get_LocationEffect_Chart',
        month: this.endMonth,
        MallID: this.malls[this.activeMallIndex].mallid,
        compareType: this.compareType[this.activeTypeIndex].typeId
      }
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
          let tableData = res.data.Data
          // 统计图
          let echartdata = JSON.parse(JSON.stringify(tableData))
          this.dataset.source = echartdata
          Object.values(echartdata).map(item => item.pop())
          this.initEchart()
          // 表格
          tableData.Rate = []
          for (let i = 0; i < tableData.Location.length; i++) {
            let rate = tableData.Month2[i]
                       ? Math.round(100 * (tableData.Month1[i] - tableData.Month2[i]) / tableData.Month2[i]) + '%'
                       : '--'
            tableData.Rate.push(rate)
            tableData.Month1[i] = formatNumber(tableData.Month1[i], 0, 1)
            tableData.Month2[i] = formatNumber(tableData.Month2[i], 0, 1)
          }
          this.tableData = tableData
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getEchartData () {
    },
    initEchart () {
      let _self = this
      this.echart = echarts.init(this.$refs.detaildataechart)
      let width = this.echart.getWidth()
      let labelOption = {
        normal: {
          show: true,
          position: 'right',
          distance: 2,
          formatter (params) {
            let res
            if (params.data[2]) {
              res = Math.round(100 * (params.data[1] - params.data[2]) / params.data[2])
              res = res > 0 ? `+${res}%` : `${res}%`
            } else {
              res = '--'
            }
            return res
          },
          fontSize: 8
        }
      }
      let series = [
        {
          name: '本月',
          type: 'bar',
          barGap: '20%',
          label: labelOption
        },
        {
          name: this.activeTypeIndex > 2 ? '上月' : '去年同期',
          type: 'bar',
          barGap: '20%'
        }
      ]
      // 绑定图例点击事件
      this.echart.on('legendselectchanged', params => {
        labelOption.normal.show = !labelOption.normal.show
        this.echart.setOption({
          series
        })
      })
      this.echart.setOption({
        color,
        title: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          position,
          axisPointer : {
            type : 'shadow'
          },
          formatter (params) {
            let title = '日均坪效'
            let text = ''
            for (let i = 0; i < params.length; i++) {
              text += `<br/>${params[i].marker}${params[i].seriesName}:${formatNumber(params[i].value[i + 1], 0, 1)}`
            }
            return title + text
          }
        },
        legend: {
          type: 'scroll',
          data: ['本月', _self.activeTypeIndex > 2 ? '上月' : '去年同期'],
          bottom: 10,
          itemHeight: 8
        },
        grid: {
          top: 20
        },
        textStyle: {
          fontSize: 8
        },
        dataset: _self.dataset,
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
          }
          // data: this.usedEchartData.xlabel
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
    },
    radioChange (e) {
      this.activeTypeIndex = parseInt(e.target.value)
      this.getStatistics()
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
                background: #fff;
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
