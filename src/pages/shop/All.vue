<template>
  <div class="shop-all">
    <div class="query-conditions">
        <el-date-picker v-model="selectedMonth" type="month" format="yyyy年MM月"
        :clearable=false :editable=false
        placeholder="选择月" class="month-select" popper-class="datepick-pop"
        @change="timechangeTotalQueries" :default-value="new Date(selectedMonth)"></el-date-picker>
        <div style="clear:both"></div>
        <div class="filter">
          <div class="all">
            <label class="filt">
              <input type="radio" name="category" value="" @change="doFiltCategory" :checked="selectCategory === ''"/>
              <span class="text">全部</span>
            </label>
          </div>
          <div class="filts">
            <label v-for="item in filters.Category" class="filt" :key="'filt-type-'+item">
              <input type="radio" name="category" :value="item" @change="doFiltCategory" :checked="selectCategory === item"/>
              <span class="text">{{item}}</span>
            </label>
          </div>
        </div>
        <div class="filter">
          <div class="all">
            <label class="filt">
              <input type="radio" name="location" value="" @change="doFiltLocation"  :checked="selectLocation === ''"/>
              <span class="text">全部</span>
            </label>
          </div>
          <div class="filts">
            <label v-for="item in filters.Location" class="filt" :key="'filt-foor-'+item">
              <input type="radio" name="location" :value="item" @change="doFiltLocation" :checked="selectLocation === item"/>
              <span class="text">{{item}}</span>
            </label>
          </div>
        </div>
    </div>
    <div class="content">
      <!-- <p class="tip">营业额单位：元</p> -->
      <div class="fktable" ref="fktable">
        <div class="special-th"  v-if="fixThead&&fixColumn">
          <div class="fkcell fkcell1">序号</div>
          <div class="fkcell fkcell2">租户</div>
        </div>
        <div class="table-wrapper extra"  ref="extraThead" :class="fixThead?'fixed':''">
          <div class="thead">
            <table class="mytable">
              <colgroup>
                <col width="50px">
                <col width="80px">
                <col width="60px">
                <col width="40px">
                <col width="60px">
                <col width="70px">
                <col width="80px">
                <col width="70px">
                <col width="70px">
              </colgroup>
              <thead class="thead">
                <tr>
                  <th>
                    <div class="th">序号</div>
                  </th>
                  <th>
                    <div class="th sortcolumn">
                      <span>租户</span>
                    </div>
                  </th>
                  <th>
                    <div class="th">位置</div>
                  </th>
                  <th>
                    <div class="th">业态</div>
                  </th>
                  <th>
                    <div class="th" @click="sortArr('Area')"
                    :class="[sortProp==='Area'?'active':'',sortup?'up':'down']">
                      <span>面积<br/>(㎡)</span>
                      <i class="el-icon-caret-top"></i>
                      <i class="el-icon-caret-bottom"></i>
                    </div>
                  </th>
                  <th>
                    <div class="th" @click="sortArr('GrossSales')"
                    :class="[sortProp==='GrossSales'?'active':'',sortup?'up':'down']">
                      <span>营业额<br/>(元)</span>
                      <i class="el-icon-caret-top"></i>
                      <i class="el-icon-caret-bottom"></i>
                    </div>
                  </th>
                  <th>
                    <div class="th" @click="sortArr('GroundEffect')"
                    :class="[sortProp==='GroundEffect'?'active':'',sortup?'up':'down']">
                      <span>月化坪效<br/>(元/㎡)</span>
                      <i class="el-icon-caret-top"></i>
                      <i class="el-icon-caret-bottom"></i>
                    </div>
                  </th>
                  <th>
                    <div class="th">环比</div>
                  </th>
                  <th>
                    <div class="th">同比</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in usedTableData" :key="item.monthdate+'---'+index">
                  <td><div>{{index+1}}</div></td>
                  <td><div>{{item.ShopName}}</div></td>
                  <td><div>{{item.Location}}</div></td>
                  <td><div>{{item.ShopCategory}}</div></td>
                  <td><div>{{item.Area|thousand}}</div></td>
                  <td><div>{{item.GrossSales|thousand}}</div></td>
                  <td><div>{{item.GroundEffect|thousand}}</div></td>
                  <td><div>{{item.MonthCompare}}</div></td>
                  <td><div>{{item.YearMonthCompare}}</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="table-wrapper" ref="baseTable">
          <table class="mytable">
            <colgroup>
              <col width="50px">
              <col width="80px">
              <col width="60px">
              <col width="40px">
              <col width="60px">
              <col width="70px">
              <col width="80px">
              <col width="70px">
              <col width="70px">
            </colgroup>
            <thead class="thead" ref="thead">
              <tr>
                <th>
                  <div class="th">序号</div>
                </th>
                <th>
                  <div class="th sortcolumn">
                    <span>租户</span>
                  </div>
                </th>
                <th>
                  <div class="th">位置</div>
                </th>
                <th>
                  <div class="th">业态</div>
                </th>
                <th>
                  <div class="th" @click="sortArr('Area')"
                  :class="[sortProp==='Area'?'active':'',sortup?'up':'down']">
                    <span>面积<br/>(㎡)</span>
                    <i class="el-icon-caret-top"></i>
                    <i class="el-icon-caret-bottom"></i>
                  </div>
                </th>
                <th>
                  <div class="th" @click="sortArr('GrossSales')"
                  :class="[sortProp==='GrossSales'?'active':'',sortup?'up':'down']">
                    <span>营业额<br/>(元)</span>
                    <i class="el-icon-caret-top"></i>
                    <i class="el-icon-caret-bottom"></i>
                  </div>
                </th>
                <th>
                  <div class="th" @click="sortArr('GroundEffect')"
                  :class="[sortProp==='GroundEffect'?'active':'',sortup?'up':'down']">
                    <span>月化坪效<br/>(元/㎡)</span>
                    <i class="el-icon-caret-top"></i>
                    <i class="el-icon-caret-bottom"></i>
                  </div>
                </th>
                <th>
                  <div class="th">环比</div>
                </th>
                <th>
                  <div class="th">同比</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in usedTableData" :key="item.monthdate+'-'+index">
                <td><div>{{index+1}}</div></td>
                <td><div>{{item.ShopName}}</div></td>
                <td><div>{{item.Location}}</div></td>
                <td><div>{{item.ShopCategory}}</div></td>
                <td><div>{{item.Area|thousand}}</div></td>
                <td><div>{{item.GrossSales|thousand}}</div></td>
                <td><div>{{item.GroundEffect|thousand}}</div></td>
                <td><div>{{item.MonthCompare}}</div></td>
                <td><div>{{item.YearMonthCompare}}</div></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-wrapper fixed"  :class="fixColumn?'shadow':''">
          <table class="mytable">
            <colgroup>
              <col width="50px">
              <col width="80px">
              <col width="60px">
              <col width="40px">
              <col width="60px">
              <col width="70px">
              <col width="80px">
              <col width="70px">
              <col width="70px">
            </colgroup>
            <thead class="thead">
              <tr>
                <th>
                  <div class="th">序号</div>
                </th>
                <th>
                  <div class="th sortcolumn">
                    <span>租户</span>
                  </div>
                </th>
                <th>
                  <div class="th">位置</div>
                </th>
                <th>
                  <div class="th">业态</div>
                </th>
                <th>
                  <div class="th" @click="sortArr('Area')"
                  :class="[sortProp==='Area'?'active':'',sortup?'up':'down']">
                    <span>面积<br/>(㎡)</span>
                    <i class="el-icon-caret-top"></i>
                    <i class="el-icon-caret-bottom"></i>
                  </div>
                </th>
                <th>
                  <div class="th" @click="sortArr('GrossSales')"
                  :class="[sortProp==='GrossSales'?'active':'',sortup?'up':'down']">
                    <span>营业额<br/>(元)</span>
                    <i class="el-icon-caret-top"></i>
                    <i class="el-icon-caret-bottom"></i>
                  </div>
                </th>
                <th>
                  <div class="th" @click="sortArr('GroundEffect')"
                  :class="[sortProp==='GroundEffect'?'active':'',sortup?'up':'down']">
                    <span>月化坪效<br/>(元/㎡)</span>
                    <i class="el-icon-caret-top"></i>
                    <i class="el-icon-caret-bottom"></i>
                  </div>
                </th>
                <th>
                  <div class="th">环比</div>
                </th>
                <th>
                  <div class="th">同比</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in usedTableData" :key="item.monthdate+'--'+index">
                <td><div>{{index+1}}</div></td>
                <td><div>{{item.ShopName}}</div></td>
                <td><div>{{item.Location}}</div></td>
                <td><div>{{item.ShopCategory}}</div></td>
                <td><div>{{item.Area|thousand}}</div></td>
                <td><div>{{item.GrossSales|thousand}}</div></td>
                <td><div>{{item.GroundEffect|thousand}}</div></td>
                <td><div>{{item.MonthCompare}}</div></td>
                <td><div>{{item.YearMonthCompare}}</div></td>
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
import { formatDate } from 'common/js/date'

export default {
  name: 'shop-all',
  data () {
    return {
      malls: malls,
      filters: {},
      selectCategory: '',
      selectLocation: '',
      tableData: null,
      fixThead:false,
      fixColumn:false,
      sortup: true,
      sortProp: ''
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
    },
    usedTableData () {
      let realData = []
      if (this.tableData) {
        realData = this.tableData.filter(item => {
          if (this.selectLocation && this.selectCategory) {
            return item.Location === this.selectLocation && item.ShopCategory === this.selectCategory
          } else if (this.selectLocation && !this.selectCategory) {
            return item.Location === this.selectLocation
          } else if (this.selectCategory && !this.selectLocation) {
            return item.ShopCategory === this.selectCategory
          }
          return true
        })
      }
      return realData
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
    if (this.$route.params.type || this.$route.params.location) {
      this.withQueryEnter()
    } else {
      this.noQueryEnter()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.listenScroll()
    })
  },
  methods: {
    noQueryEnter () {
      this.totalQueries()
    },
    withQueryEnter () {
      this.totalQueries()
      this.activeMallIndex = this.$route.params.activeMallIndex
      this.selectedMonth = this.$route.params.endMonth.replace('/', '-')
      if (this.$route.params.type) {
        this.selectCategory = this.$route.params.type === '全场' ? '' : this.$route.params.type
      }
      if (this.$route.params.location) {
        this.selectLocation = this.$route.params.location
      }
    },
    totalQueries () {
      // 清空排序
      this.sortup = true
      this.sortProp = ''
      this.getFilters()
      this.getStatistics()
    },
    timechangeTotalQueries () {
      // 清空排序
      this.sortup = true
      this.sortProp = ''
      this.getStatistics()
    },
    getFilters () {
      let opt = {
        v:'Get_Local_Category',
        MallID: this.malls[this.activeMallIndex].mallid
      }
      this.selectCategory = ''
      this.selectLocation = ''
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
          this.filters = res.data.Data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    getStatistics () {
      let opt = {
        v:'Get_Local_Category_Table',
        month: this.endMonth,
        Location: this.selectLocation,
        category: this.selectCategory,
        MallID: this.malls[this.activeMallIndex].mallid
      }
      let layerindex = layer.loading('加载中')
      api.query(opt).then((res) => {
        layer.close(layerindex)
        if (res.data.ErrorCode === 0) {
          this.tableData = res.data.Data
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].monthdate = Math.random().toString(36).substr(2)
            this.tableData[i].MonthCompare = this.tableData[i].MonthGrossSales
            ? (100 * (this.tableData[i].GrossSales - this.tableData[i].MonthGrossSales) / this.tableData[i].MonthGrossSales).toFixed(0) + '%'
            : '--'
            this.tableData[i].YearMonthCompare = this.tableData[i].YearGrossSales
            ? (100 * (this.tableData[i].GrossSales - this.tableData[i].YearGrossSales) / this.tableData[i].YearGrossSales).toFixed(0) + '%'
            : '--'
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    doFiltCategory (e) {
      this.selectCategory = e.target.value
      // this.getStatistics()
    },
    doFiltLocation (e) {
      this.selectLocation = e.target.value
      // this.getStatistics()
    },
    sortArr (prop) {
      if (this.sortProp === prop) {
        this.tableData.reverse()
        this.sortup = !this.sortup
      } else {
        this.sortProp = prop
        this.sortup = true
        if (prop === 'MonthDate') {
          this.tableData.sort((a, b) => {
            return new Date(a[prop]).getDate() - new Date(b[prop]).getDate()
          })
        } else {
          this.tableData.sort((a, b) => {
            return a[prop] - b[prop]
          })
        }
      }
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
.shop-all {
  .tip{
    font-size:.5rem;
    margin:.5rem 0;
  }
  .filter{
    display:flex;
    margin-top:.8rem;
    margin-left: -.25rem;
    margin-right: -.25rem;
    .filts{
      font-size:0;
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      height: 1.6rem;
    }
    .filt{
      display: inline-block;
      vertical-align: top;
      width:2.8rem;
      height:1.5rem;
      margin:0 .25rem;
      position: relative;
      input{
        width:100%;
        height:100%;
        opacity:0;
        position: absolute;
        &:checked + .text{
          background: $success-color;
          color:#fff;
          border-color: $success-color;
        }
      }
      .text{
        display:block;
        width:100%;
        height:100%;
        font-size: .5rem;
        border:1px solid $primary-color;
        line-height:1.5rem;
        text-align: center;
        border-radius: .2rem;
        transition:all .2s;
      }
    }
  }
  .fktable{
    margin-left: -.5rem;
    margin-right: -.5rem;
    margin-bottom: -.5rem;
    position: relative;
    overflow: hidden;
    .special-th{
      width: 130px;
      position: fixed;
      z-index: 200;
      font-size: 0;
      top: 0;
      left: 0;
      background: #eee;
      color: #888;
      padding: 0 .2rem;
      line-height:2rem ;
      height:2rem;
      .fkcell{
        font-size: .5rem;
        display: inline-block;
        padding: 0 .2rem;
        text-align: left;
        font-weight: 600;
        &.fkcell1{
          width: 50px;
          margin-left: -.2rem;
          border-right:1px solid #ddd;
        }
        &.fkcell2{
          width: 80px;
          margin-right: -.2rem;
        }
      }
    }
    .table-wrapper{
      width: 100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      &.extra {
        display: none;
        width: 100%;
        height:2rem;
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
              text-align: center;
              &:first-child{
                text-align:left;
              }
            }
          }
        }
      }
      &.fixed{
        position: absolute;
        width: 130px;
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
            color: #888;
            text-align: left;
            &:first-child,
            &:nth-child(2){
              div{
                color:#888 !important;
                border-right-color: #ddd;
              }
            }
          }
          th{
            color:#888
          }
        }
      }
      .mytable {
        width:580px;
        tr{
          th,td{
            font-size: .5rem;
            text-align: right;
            color: #333;
            line-height: 1;
            vertical-align: middle;
            background:#fff;
            border-right: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            &:first-child{
              div{
                width: 50px;
                color:transparent;
                border-right-color: transparent;
              }
            }
            &:nth-child(2){
              div{
                text-align: left;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                width:80px;
                color:transparent;
                border-right-color: transparent;
              }
            }
            &:nth-child(3),
            &:nth-child(4){
              div{
                text-align: left;
              }
            }
            div{
              padding:.5rem .2rem;
              vertical-align: middle;
            }
            &:last-child{
              div{
                border-right: none;
              }
            }
          }
          th{
            background: #eee;
            color: #888;
            font-size: .5rem;
            text-align: center;
            height: 2rem;
            div{
              position: relative;
              font-weight: 600;
              span{
                font-weight: inherit;
              }
              .el-icon-caret-top,
              .el-icon-caret-bottom{
                font-size: .5rem;
                color: #888;
              }
              .el-icon-caret-top{
                position: absolute;
                right:.1rem;
                top:50%;
                margin-top:-.3rem;
              }
              .el-icon-caret-bottom{
                position: absolute;
                right:.1rem;
                top:50%;
                margin-top:-.1rem;
              }
              &.active.up{
                .el-icon-caret-top{
                  color:$success-color
                }
              }
              &.active.down{
                .el-icon-caret-bottom{
                  color:$success-color
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
