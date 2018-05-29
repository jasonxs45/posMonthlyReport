<template>
  <div class="floor">
    <div class="tab-navs">
      <router-link tag="div" class="nav-item" to="/floor/total" >
        总量指标
      </router-link>
      <router-link tag="div" class="nav-item" to="/floor/quality">
        质量指标
      </router-link>
    </div>
    <div class="floor-wrapper">
      <router-view/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'floor'
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.floor {
  .tab-navs {
    margin: 0;
    padding: 0;
    .nav-item {
      border-radius: .2rem;
      margin:0 0 0 .5rem;
      border: 1px solid $primary-color;
      background: #fff;
      &.router-link-active {
        background-color: $primary-color;
      }
    }
  }
}
</style>
