<template>
  <div class="shop">
    <div class="tab-navs">
      <router-link tag="div" class="nav-item" to="/shop/main" >
        主力店
      </router-link>
      <router-link tag="div" class="nav-item" to="/shop/all">
        所有租户
      </router-link>
      <router-link tag="div" class="nav-item" to="/shop/new">
        新开租户
      </router-link>
    </div>
    <div class="shop-wrapper">
      <router-view />
    </div>
  </div>
</template>
<script>
export default {
  name: 'shop'
}
</script>
<style lang="scss">
@import "~common/scss/variables";
.shop {
  .tab-navs {
    margin: 0;
    padding: 0;
    .nav-item {
      border-radius: .2rem;
      margin:0 0 0 .5rem;
      border: 1px solid $primary-color;
      background: #fff;
      width: 14vw;
      &.router-link-active {
        background-color: $primary-color;
      }
    }
  }
}
</style>
