<template>
  <div id="app">
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
import { radio } from 'components'
export default {
  name: 'App',
  components: {
    radio
  }
}
</script>

<style lang="scss">
@import '~common/scss/variables';
#app {
  color: #333;
}
.tab-navs {
  height: 1.7rem;
  padding-top: 0.3rem;
  font-size: 0;
  .nav-item {
    display: inline-block;
    width: 20%;
    font-size:.5rem;
    line-height:1.4rem;
    height:1.4rem;
    text-align: center;
    background: #c3c3c3;
    border-top-left-radius: .4rem;
    border-top-right-radius:.4rem;
    transition: all .2s ease;
    &.router-link-active{
      background-color: $primary-color;
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
  padding:.5rem;
  &:after{
    content:'';
    display:block;
    clear: both;
  }
  .mall-select {
    float: left;
    width:40vw;
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
  .month-select{
    float: right;
    width:40vw !important;
    input{
      height: 1.4rem;
      line-height: 1.4rem;
      font-size: 0.5rem;
    }
    .el-icon-date,.el-icon-circle-close {
      line-height:1.4rem !important;
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
.up{
  color:#41b883
}
.down{
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
