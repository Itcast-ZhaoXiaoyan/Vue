<template>
  <!-- 实现从右——向左滑动的动画-->
  <transition name="slide">
    <div class="songlist"></div>
  </transition>
  
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'singer' 
      ])
    },

    created() {
      console.log(this.singer)
    }
  } 
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
   
  .songlist
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slider-leave-to
    transform: translate3d(100%, 0, 0)
</style>