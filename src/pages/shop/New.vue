<template>
  <div class="shop-new">
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
      <div class="month-select">
        <el-date-picker v-model="selectedStartMonth" class="startMonth" type="month" format="yyyy年MM月"
        placeholder="选择开始月" popper-class="datepick-pop"
        clear-icon="none"
        :clearable=false :editable=false
        :picker-options="startPickerOptions"
        @change="totalQueries"></el-date-picker>
        <span class="line">-</span>
        <el-date-picker v-model="selectedMonth" class="endMonth" type="month" format="yyyy年MM月"
        prefix-icon="none"
        clear-icon="none"
        :clearable=false :editable=false
        :picker-options="endPickerOptions"
        placeholder="选择结束月" popper-class="datepick-pop"
        @change="totalQueries"></el-date-picker>
      </div>
    </div>
    <div class="content">
      <div class="detail-statistics">
        <div class="effacttype-switch">
          <label class="dot" v-for="(item, index) in tableType" :key="item.name">
            <input type="radio" name="tabletype" :value="index" :checked="index===parseInt(activeTypeIndex)" @change="radioChange"/>
            <span class="text">{{item.name}}</span>
          </label>
        </div>
      </div>
      <p class="tip">{{parseInt(activeTypeIndex) === 0?'营业额单位：元':'坪效单位：元'}}</p>
      <div class="fktable" ref="fktable">
        <div class="special-th"  v-if="fixThead&&fixColumn">租户</div>
        <div class="table-wrapper extra"  ref="extraThead" :class="fixThead?'fixed':''">
          <div class="thead">
            <table class="mytable" :class="usedTableData.Month.length>3?'':'w100'">
              <thead class="thead">
                <tr>
                  <th  :class="usedTableData.Month.length>3?'':'autowidth'">
                    <div class="th column-head">
                      <span>租户</span>
                    </div>
                  </th>
                  <th v-for="item in usedTableData.Month" :key="'column-'+item"
                   :class="usedTableData.Month.length>3?'':'autowidth'">
                    <div class="th column-repeat">
                      <span>{{item}}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="usedTableData.Month.length<=3">
                <tr v-for="(item, index) in usedTableData.List" :key="item.ShopName+'-'+index">
                  <td :class="usedTableData.Month.length>3?'':'autowidth'"><div>{{item.ShopName}}</div></td>
                  <td v-for="(data, idx) in item.Data" :key="item.ShopName+'-'+idx+'1'"
                  :class="usedTableData.Month.length>3?'':'autowidth'">
                    <div v-if="parseInt(data)===-1">--</div>
                    <div v-else>{{data|thousand}}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="table-wrapper" ref="baseTable">
          <table class="mytable" :class="usedTableData.Month.length>3?'':'w100'">
            <thead class="thead" ref="thead">
              <tr>
                <th :class="usedTableData.Month.length>3?'':'autowidth'">
                  <div class="th column-head">
                    <span>租户</span>
                  </div>
                </th>
                <th v-for="item in usedTableData.Month" :key="'column-'+item"
                :class="usedTableData.Month.length>3?'':'autowidth'">
                  <div class="th" :class="usedTableData.Month.length>3?'column-repeat':''">
                    <span>{{item}}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in usedTableData.List" :key="item.ShopName+'-'+index">
                <td :class="usedTableData.Month.length>3?'':'autowidth'"><div>{{item.ShopName}}</div></td>
                <td
                  v-for="(data, idx) in item.Data"
                  :key="item.ShopName+'-'+idx+'1'"
                  :class="usedTableData.Month.length>3?'':'autowidth'"
                >
                  <div v-if="parseInt(data)===-1">--</div>
                  <div v-else>{{data|thousand}}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-wrapper fixed"  :class="fixColumn?'shadow':''" v-if="usedTableData.Month.length>3">
          <table class="mytable">
            <thead class="thead">
              <tr>
                <th>
                  <div class="th column-head">
                    <span>租户</span>
                  </div>
                </th>
                <th v-for="item in usedTableData.Month" :key="'column-'+item">
                  <div class="th column-repeat">
                    <span>{{item}}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in usedTableData.List" :key="item.ShopName+'--'+index">
                <td><div>{{item.ShopName}}</div></td>
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
let tableType = [
  {
    name: '营业额',
    typeId: 0
  },
  {
    name: '30天月化坪效',
    typeId: 1
  }
]

export default {
  name: 'shop-new',
  data () {
    return {
      malls,
      tableType,
      activeMallIndex: 0,
      activeTypeIndex: 0,
      selectedMonth: '',
      selectedStartMonth: '',
      tableData: {
        Month:[]
      },
      fixThead:false,
      fixColumn:false
    }
  },
  computed: {
    endMonth () {
      let date = new Date(this.selectedMonth)
      return formatDate(date, 'yyyy/MM')
    },
    startMonth () {
      if (this.selectedStartMonth) {
        return formatDate(new Date(this.selectedStartMonth), 'yyyy/MM')
      } else {
        let date = new Date(this.selectedMonth)
        let half = date.setMonth(date.getMonth() - 5)
        return formatDate(new Date(half), 'yyyy/MM')
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
      return this.tableData
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
    let day = this.$route.query.day
    let mallid = parseInt(this.$route.query.mallid)
    day = day ? day.substr(0, 4) + '-' + day.substr(4, 2) : ''
    this.activeMallIndex = mallid ? malls.findIndex(item => item.mallid === mallid) : this.activeMallIndex
    this.selectedMonth = this.$route.query.day ? day : getPrevMonth()
    this.selectedStartMonth = this.startMonth.replace('/', '-')
    this.totalQueries()
  },
  mounted () {
    this.$nextTick(() => {
      this.listenScroll()
    })
  },
  methods: {
    totalQueries () {
      this.getData()
    },
    radioChange (e) {
      this.activeTypeIndex = e.target.value
      this.totalQueries()
    },
    getData () {
      let opt = {
        v:'New_Opening_Shop_Table',
        num:'',
        month1: this.startMonth,
        month2: this.endMonth,
        typeId: tableType[parseInt(this.activeTypeIndex)].typeId,
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
    listenScroll () {
      let scrollTop
      let scrollLeft
      this.$nextTick(() => {
        window.onscroll = () => {
          scrollTop = window.document.body.scrollTop || window.document.documentElement.scrollTop
          if (this.$refs.thead && (scrollTop > this.$refs.thead.offsetTop + this.$refs.fktable.offsetTop)) {
            this.fixThead = true
          } else {
            this.fixThead = false
          }
          if (this.$refs.extraThead) {
            this.$refs.extraThead.scrollLeft = this.$refs.baseTable.scrollLeft
          }
        }
        this.$refs.baseTable.onscroll = () => {
          scrollLeft = this.$refs.baseTable.scrollLeft
          if (this.$refs.extraThead && scrollLeft <= 0) {
            this.fixColumn = false
            this.$refs.extraThead.scrollLeft = 0
          } else {
            this.fixColumn = true
          }
          if (this.$refs.extraThead) {
            this.$refs.extraThead.scrollLeft = scrollLeft
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.shop-new {
  .mall-select {
    width: 25vw;
  }
  .month-select{
    width: 55vw !important;
    height:1.4rem;
    border:1px solid #ddd;
    overflow: hidden;
    font-size:0;
    border-radius:.2rem;
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
      width:50%;
      height:1.4rem;
      input{
        border:none;
        height:1.4rem;
        line-height:1.4rem;
        padding-right:5px;
        padding-left:1rem;
      }
    }
    .endMonth{
      width:40%;
      input{
        padding-left:5px;
      }
    }
    .line{
      width:10%;
      text-align:center;
      line-height:1.4rem;
    }
  }
  .effacttype-switch{
    text-align:center;
    .dot{
      display: inline-block;
      width:5rem;
      margin:0 .5rem .5rem;
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
        line-height:1.3;
        padding:.3rem;
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
  .tip{
    font-size: .5rem;
    margin:.5rem 0;
  }
  .fktable{
    margin-left: -.5rem;
    margin-right: -.5rem;
    margin-bottom: -.5rem;
    position: relative;
    overflow: hidden;
    .column-head{
      width:100px;
    }
    .column-repeat{
      width: 70px;
    }
    .autowidth{
      div{
        width:100% !important;
      }
    }
    .special-th{
      width: 100px;
      position: fixed;
      z-index: 200;
      font-size: .5rem;
      top: 0;
      left: 0;
      background: #f5f5f5;
      color: #888;
      padding: 0 .2rem;
      line-height:1.5rem ;
      height:1.5rem;
      box-shadow: 0 -2px 2px 0 rgba(0,0,0,.3);
      border-bottom:1px solid #ddd;
    }
    .table-wrapper{
      width: 100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      &.extra {
        display: none;
        width: 100%;
        height:1.5rem;
        overflow: hidden;
        &.fixed{
          position: fixed;
          top: 0;
          left: 0;
          display: block;
          z-index: 99;
          width:100%;
          .mytable {
            th,td{
              opacity: 1;
              color: #888;
              text-align: right;
              &:first-child{
                text-align:left;
              }
            }
          }
        }
      }
      &.fixed{
        position: absolute;
        width: 100px;
        left: 0;
        top: 0;
        overflow: hidden;
        &.shadow{
          box-shadow:0 0 2px 0 rgba(0,0,0,.4);
          z-index:100;
        }
        .mytable {
          th,td{
            opacity: 1;
            border-right: none;
            color: #333;
            text-align: left;
            div{
              &:first-child{
                border-right:1px solid #ddd;
                opacity: 1;
              }
              &:last-child{
                border-right:1px solid #ddd;
              }
            }
          }
          th{
            color:#888
          }
        }
      }
      .mytable {
        &.w100{
          width:100%;
          tr{
            th,td{
              &:first-child{
                div{
                  opacity: 1;
                }
              }
            }
          }
        }
        tr{
          th,td{
            font-size: .5rem;
            text-align: right;
            background: #fff;
            color: #333;
            line-height: 1;
            vertical-align: middle;
            &:first-child{
              div{
                text-align: left;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                width:100px;
                opacity: 0;
              }
            }
            div{
              padding: .5rem .2rem;
              vertical-align: initial;
              border-right: 1px solid #ddd;
              border-bottom: 1px solid #ddd;
            }
            &:last-child{
              div{
                border-right: none;
              }
            }
          }
          th{
            background: #f5f5f5;
            color: #888;
            font-weight: bold;
            font-size: .5rem;
            div{
              height: 1.5rem;
              position: relative;
            }
          }
        }
      }
    }
  }
}
</style>
