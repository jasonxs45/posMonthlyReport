<template>
  <div class="single-shop">
    <div class="flexbox boxline">
      <div class="flexbox-item boxline-item">
        <div class="flexbox">
          <div class="head">商场</div>
          <el-select
            v-model="activeMallIndex"
            placeholder="请选择"
            class="inline-select"
            popper-class="mall-pop"
            @change="mallChange"
          >
            <el-option
              v-for="(item, index) in malls"
              :key="item.name"
              :label="item.name"
              :value="index">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="flexbox-item boxline-item">
        <div class="flexbox">
          <div class="head">楼层/位置</div>
          <el-select
            v-model="selectedFloor"
            placeholder="请选择"
            class="inline-select"
            popper-class="mall-pop"
            @change="locationChange"
          >
            <el-option
              v-for="(item, index) in floors"
              :key="item+'-'+index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="flexbox boxline">
      <div class="flexbox-item boxline-item">
        <div class="flexbox">
          <div class="head">租户业态</div>
          <el-select
            v-model="selectedType"
            placeholder="请选择"
            class="inline-select"
            popper-class="mall-pop"
            @change="typeChange"
          >
            <el-option
              v-for="(item, index) in types"
              :key="item+'-'+index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="flexbox-item boxline-item">
        <div class="flexbox">
          <div class="head">租户名称</div>
          <el-select
            v-model="activeShopIndex"
            placeholder="请选择"
            class="inline-select"
            popper-class="mall-pop"
            @change="shopChange"
          >
            <el-option
              v-for="(item, index) in shops"
              :key="item.ShopName + Math.random().toString(36).substr(2)"
              :label="item.ShopName"
              :value="index">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="month-select">
      <el-date-picker v-model="selectedStartMonth" class="startMonth" type="month" format="yyyy年MM月"
      placeholder="选择开始月" popper-class="datepick-pop"
      clear-icon="none"
      :clearable=false :editable=false
      :picker-options="startPickerOptions"
      @change="getSingleShopGrossSales"></el-date-picker>
      <span class="line">-</span>
      <el-date-picker v-model="selectedMonth" class="endMonth" type="month" format="yyyy年MM月"
      clear-icon="none"
      :clearable=false :editable=false
      :picker-options="endPickerOptions"
      placeholder="选择结束月" popper-class="datepick-pop"
      @change="getSingleShopGrossSales"></el-date-picker>
    </div>
    <div class="content">
      <div class="detail-statistics-echart" ref="detaildataechart"></div>
      <div v-if="tableData" class="fktable" ref="fktable">
        <div class="table-wrapper">
          <table class="mytable">
            <thead class="thead">
              <tr>
                <th>
                  <div>月份</div>
                </th>
                <th>
                  <div>营业额<br/>(元)</div>
                </th>
                <th>
                  <div>月化坪效<br/>(元/㎡)</div>
                </th>
                <th>
                  <div>同比</div>
                </th>
                <th>
                  <div>环比</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in usedTableData" :key="item+'-'+index">
                <td @click="checkDaily(item.month)"><div>{{item.month}}</div></td>
                <td><div>{{item.grosssales|thousand}}</div></td>
                <td><div>{{item.effect|thousand}}</div></td>
                <td><div>{{item.yearlasymonth}}</div></td>
                <td><div>{{item.lastmonth}}</div></td>
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
import { formatDate, getPrevMonth } from 'common/js/date'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/dataset')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
export default {
  name: 'single-shop',
  data () {
    return {
      malls,
      activeMallIndex: 0,
      shopinfo: {},
      floors: [],
      types: ['餐饮', '零售', '娱乐', '服务'],
      originShops: [],
      shopid: '',
      selectedMonth: '',
      selectedStartMonth: '',
      tableData: null,
      dataset: null
    }
  },
  computed: {
    shops () {
      let shops = this.originShops.filter(item => {
        if (this.selectedFloor && !this.selectedType) {
          return item.Location === this.selectedFloor
        } else if (this.selectedType && !this.selectedFloor) {
          return item.ShopCategory === this.selectedType
        } else if (this.selectedType && this.selectedFloor) {
          return item.Location === this.selectedFloor && item.ShopCategory === this.selectedType
        } else if ((!this.selectedFloor) && (!this.selectedType)) {
          return true
        } else {
          return false
        }
      })
      return shops
    },
    selectedFloor: {
      set (newVal) {
        this.shopinfo.Location = newVal
      },
      get () {
        return this.shopinfo.Location
      }
    },
    selectedType: {
      set (newVal) {
        this.shopinfo.ShopCategory = newVal
      },
      get () {
        return this.shopinfo.ShopCategory
      }
    },
    activeShopIndex: {
      set (newVal) {
        this.shopid = this.shops[newVal].ShopID
      },
      get () {
        let index = this.shops.findIndex(item => item.ShopID === this.shopid)
        return index === -1 ? '' : index
      }
    },
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
      let arr = []
      if (this.tableData && this.tableData.month) {
        for (let i = 0; i < this.tableData.month.length; i++) {
          arr.push({
            month: this.tableData.month[i],
            grosssales: this.tableData.grosssales[i],
            effect: this.tableData.effect[i],
            yearlasymonth: (this.tableData.yearlasymonth[i] * 100).toFixed(0) + '%',
            lastmonth: (this.tableData.lastmonth[i] * 100).toFixed(0) + '%'
          })
        }
      }
      return arr
    },
    detaildataechart () {
      return this.$refs.detaildataechart
    },
    echart () {
      return echarts.init(this.detaildataechart)
    }
  },
  filters: {
    thousand (num) {
      return formatNumber(num, 0, 1)
    }
  },
  created () {
    this.shopid = parseInt(this.$route.query.id)
    this.activeMallIndex = parseInt(this.$route.query.mallIndex)
    this.getShopInfo()
    this.selectedMonth = getPrevMonth()
    this.selectedStartMonth = this.startMonth
    this.getLocationShopList()
    this.getSingleShopGrossSales()
  },
  methods: {
    _getShopInfo () {
      let opt = {
        v: 'Get_SingleShopInfo',
        shopid: this.shopid
      }
      return api.query(opt)
    },
    getShopInfo () {
      this._getShopInfo().then(res => {
        if (res.data.ErrorCode === 0) {
          this.floors = res.data.Data.location
          this.shopinfo = res.data.Data.shopinfo
        }
      }).catch(err => {
        console.log(err)
      })
    },
    _getSingleShopGrossSales () {
      let opt = {
        v: 'Get_SingleShopGrossSales',
        shopid: this.shopid,
        month1: this.startMonth,
        month2: this.endMonth
      }
      return api.query(opt)
    },
    getSingleShopGrossSales () {
      let layerindex = layer.loading('加载中')
      this._getSingleShopGrossSales().then(res => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
          let source = res.data.Data
          this.tableData = source
          source.Days = source.month
          source.GrossSales = source.grosssales.map(item => Math.round(item))
          this.dataset = {
            source: {
              '月份': source.Days,
              '营业额': source.GrossSales
            }
          }
          this.initEchart()
        }
      }).catch(err => {
        layer.close(layerindex)
        console.log(err)
      })
    },
    _getLocationShopList () {
      let opt = {
        v: 'Get_Location_Shop_List',
        MallID: this.malls[this.activeMallIndex].mallid
      }
      return api.query(opt)
    },
    getLocationShopList () {
      let layerindex = layer.loading('加载中')
      this._getLocationShopList().then(res => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
          this.floors = res.data.Data.location
          this.originShops = res.data.Data.shoplist
          // this.shops = this.originShops.filter(item => item)
        }
      }).catch(err => {
        layer.close(layerindex)
        console.log(err)
      })
    },
    mallChange () {
      this.getLocationShopList()
      this.shopinfo.Location = ''
      this.shopinfo.ShopCategory = ''
      this.shopid = ''
      this.reset()
    },
    shopChange () {
      let shop = this.shops.find(item => item.ShopID === this.shopid)
      this.shopinfo.Location = shop.Location || this.shopinfo.Location
      this.shopinfo.ShopCategory = shop.ShopCategory || this.shopinfo.ShopCategory
      this.getSingleShopGrossSales()
    },
    locationChange () {
      this.shopid = ''
      this.reset()
    },
    typeChange () {
      this.shopid = ''
      this.reset()
    },
    initEchart () {
      this.echart.setOption({
        color: '#6fc1ff',
        tooltip: {
          trigger: 'axis',
          position
        },
        legend: {
          data: ['营业额'],
          bottom: 15,
          itemHeight: 8
        },
        textStyle: {
          fontSize: 8
        },
        grid: {
          top: 40,
          right: 40
        },
        dataset: this.dataset,
        xAxis: {
          type: 'category',
          name: '月份',
          boundaryGap: true,
          axisLabel: {
            fontSize: 8
          }
        },
        yAxis: [
          {
            name: '营业额\n(万元)',
            type: 'value',
            splitLine: {
              lineStyle: {
                color: '#ddd',
                width: 0.5
              }
            },
            axisLabel: {
              formatter (value, index) {
                return value / 10000
              },
              fontSize: 8
            }
          }
        ],
        series: [
          {
            name: '营业额',
            type: 'line'
          }
        ]
      })
    },
    reset () {
      this.tableData = null
      this.dataset.source['营业额'] = []
      this.initEchart()
    },
    checkDaily (month) {
      this.$router.push({
        name: 'singleshopdaily',
        query: {
          id: this.shopid,
          month,
          mallIndex: this.activeMallIndex
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.flexbox{
  display: flex;
  justify-content: space-between;
  align-items: center;
  .flexbox-item{
    flex:1;
  }
}
.boxline{
  margin: p2r(30) 0;
  padding: 0 p2r(15);
  .boxline-item{
    margin: 0 p2r(15);
  }
}
.inline-select{
  width: p2r(220);
  height:1.4rem;
  background: #fff;
  input{
    height:1.4rem;
    line-height:1.4rem;
    padding-right:5px !important;
    padding-left:5px !important;
    font-size: .5rem;
  }
}
.single-shop {
  width:100%;
  background: #fff;
  .shop-info{
    background: #f2f2f2;
    margin: .5rem;
    padding: .5rem;
    .flexbox{
      margin-top: 1rem;
      &:first-child{
        margin-top: 0;
      }
      .flexbox-item{
        font-size: .5rem;
      }
    }
    .shopname{
      font-weight: 600;
    }
  }
  .month-select{
    width: 100%;
    margin: p2r(30) 0;
    padding:0 .5rem;
    font-size: 0;
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
      width:45%;
      height:1.4rem;
      input{
        height:1.4rem;
        line-height:1.4rem;
        padding-right:5px;
        font-size: .5rem;
      }
      .el-icon-date{
        line-height: 1.4rem;
      }
    }
    .endMonth{
      width:45%;
      input{
        height:1.4rem;
        line-height:1.4rem;
        padding-right:5px;
      }
      .el-icon-date{
        line-height: 1.4rem;
      }
    }
    .line{
      width:10%;
      text-align:center;
      line-height:1.4rem;
    }
  }
  .detail-statistics-echart{
    width:100%;
    height:8rem;
  }
  .fktable{
    margin-left: -.5rem;
    margin-right: -.5rem;
    margin-bottom: -.5rem;
    position: relative;
    overflow: hidden;
    .table-wrapper{
      width: 100%;
      .mytable {
        width:100%;
        tr{
          th,td{
            font-size: .5rem;
            text-align: right;
            color: #333;
            line-height: 1;
            vertical-align: middle;
            border-right: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            div{
              padding:.6rem .3rem;
              vertical-align: middle;
            }
            &:last-child{
              border-right: none;
              div{
                border-right: none;
              }
            }
            &:first-child{
              div{
                text-align: center;
                text-decoration: underline;
              }
            }
          }
          th{
            font-size: .5rem;
            text-align: center;
            color: #666;
            background: #eee;
            height: 2rem;
            div{
              position: relative;
              font-weight: 600;
              line-height:1.2;
            }
            &:first-child{
              div{
                text-decoration: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
