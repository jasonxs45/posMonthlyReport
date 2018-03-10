<template>
  <div class="summaries">
    <div class="tab-navs">
      <div class="nav-item">
        <radio label="总量指标" name="target"></radio>
      </div>
      <div class="nav-item">
        <radio label="质量指标" name="target"></radio>
      </div>
    </div>
    <router-view/>
  </div>
</template>
<script>
import {radio} from 'components'
export default {
  name: 'summaries',
  components: {
    radio
  }
}
</script>
<style lang="scss">
.summaries{
  .tab-navs{
    margin-top:.2rem;
    .nav-item{
      margin:0 .3rem;
      .radio-wrapper{
        font-size:.5rem;
        .text{
          border-radius:0;
        }
      }
    }
  }
}
</style>
