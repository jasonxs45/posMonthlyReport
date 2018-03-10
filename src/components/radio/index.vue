<template>
  <label class="radio-wrapper" >
    <input
    type="radio"
    :checked="checked"
    :value="value"
    :name="name"
    @change="changeHandler"/>
    <span class="text">
      {{label}}
    </span>
  </label>
</template>

<script>
export default {
  name: 'radio',
  data () {
    return {
      realVal: this.value
    }
  },
  props: {
    label: {
      type: [String],
      default: ''
    },
    value: {
      type: [Boolean, String],
      default: ''
    },
    checked: {
      type: [Boolean, String],
      default: false
    },
    name: {
      type: [String],
      default: ''
    }
  },
  components: {
  },
  methods: {
    changeHandler (e) {
      let value = e.target.checked
      this.$emit('on-change', value).$emit('input', value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '~common/scss/variables';
@import '~common/scss/mixins';
.radio-wrapper{
  display: inline-block;
  position: relative;
  font-size:inherit;
  input{
    width:100%;
    height:100%;
    position: absolute;
    top:0;
    left:0;
    opacity:0;
    &:checked + .text {
      background-color: $success-color;
    }
  }
  .text{
    font-size:inherit;
    display:block;
    width:100%;
    height:100%;
    text-align:center;
    background:#c3c3c3;
    transition:all .2s ease;
  }
}
</style>
