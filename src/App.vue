<template>
  <div id="app">
    <div class="mall-controller">
      <span class="head">项目选择：</span>
      <el-select
        v-model="activeMallIndex"
        placeholder="请选择"
        class="mall-select"
        popper-class="mall-pop"
        @change="totalQueries"
      >
        <el-option
          v-for="(item, index) in malls"
          :key="item.name"
          :label="item.name"
          :value="index">
        </el-option>
      </el-select>
    </div>
    <div class="tab-navs">
      <router-link tag="div" class="nav-item" to="/overview">
        概览
      </router-link>
      <router-link tag="div" class="nav-item" to="/monthly">
        月度情况
      </router-link>
      <router-link tag="div" class="nav-item" to="/type">
        分业态
      </router-link>
      <router-link tag="div" class="nav-item" to="/floor">
        分楼层
      </router-link>
      <router-link tag="div" class="nav-item" to="/shop">
        租户情况
      </router-link>
    </div>
    <div class="main-wrapper">
      <router-view/>
    </div>

  </div>
</template>

<script>
import { malls } from 'common/js/config'
export default {
  name: 'App',
  data () {
    return {
      malls
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
    }
  },
  methods: {
    totalQueries () {}
  }
}
</script>

<style lang="scss">
@import '~common/scss/variables';
#app {
  color: #333;
  .mall-controller{
    padding:10px .5rem;
    .head{
      font-size: .55rem;
      margin-right: 15px;
    }
    .mall-select {
      input {
        background: $primary-color;
        border: none;
        color: #333;
        font-size: 0.5rem;
        height: 1.4rem;
        line-height: 1.4rem;
      }
      .el-icon-arrow-up {
        line-height:1.4rem !important;
        &:before {
          color: #fff;
          font-size: 0.5rem !important;
        }
        &:after {
          vertical-align: top;
        }
      }
    }
  }
}
.tab-navs {
  margin:0 .5rem 20px;
  height: 1.7rem;
  padding-top: 0.3rem;
  font-size: 0;
  .nav-item {
    display: inline-block;
    width: 20%;
    font-size:.5rem;
    line-height:1.5rem;
    height:1.5rem;
    text-align: center;
    background: #ddd;
    border-left: 1px solid #ccc;
    transition: all .2s ease;
    &:first-child{
      border-left: none;
      border-top-left-radius: .2rem;
      border-bottom-left-radius: .2rem;
    }
    &:last-child{
      border-top-right-radius: .2rem;
      border-bottom-right-radius: .2rem;
    }
    &.router-link-active{
      background-color: $primary-color;
      border-color: $primary-color;
    }
  }
}
.point-title{
  color:$success-color;
  font-size: 0;
  position: relative;
  padding-left:.7rem;
  margin:1rem 0 0;
  .text{
    font-size:.5rem;
  }
  &:before{
    content:'';
    display:block;
    position: absolute;
    width:.5rem;
    height:.5rem;
    background: $success-color;
    border-radius:50%;
    top:50%;
    margin-top:-.25rem;
    left:0;
  }
}
.query-conditions {
  margin-top: -1.7rem;
  padding:0 .5rem 15px;
  &:after{
    content:'';
    display:block;
    clear: both;
  }
  .month-select{
    float: right;
    width:40vw !important;
    height: 1.5rem;
    input{
      height: 1.5rem;
      line-height: 1.5rem;
      font-size: 0.5rem;
    }
    .el-icon-date,.el-icon-circle-close {
      line-height:1.5rem !important;
      width: .6rem !important;
      &:before {
        font-size: 0.5rem !important;
      }
      &:after {
        vertical-align: top !important;
      }
    }
  }
}
.effacttype-switch{
  text-align:center;
  .dot{
    display: inline-block;
    width:4rem;
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
.content{
  padding:.5rem;
  overflow-x:hidden;
}
.mall-pop {
  .el-select-dropdown__item {
    span {
      font-size: 0.5rem !important;
    }
  }
}
.incre{
  color:#41b883
}
.decre{
  color:#ff4b7c
}
.datepick-pop{
  width:100% !important;
  left:0 !important;
  .el-picker-panel__icon-btn{
    font-size:.7rem;
    margin-top:4px;
  }
  .el-picker-panel__content{
    width:100% !important;
    margin:0;
    padding:.5rem;
  }
}
.scale-enter-active, .scale-leave-active {
  transition:all .5s;
}
.scale-enter, .scale-leave-to{
  opacity: 0;
  transform: scale(1.1);
}
</style>
