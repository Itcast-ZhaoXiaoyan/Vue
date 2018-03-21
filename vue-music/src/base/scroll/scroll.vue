<template>
  <div ref="wrapper">
      <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      // probeType
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      // 是否要监听scroll组件
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    // 钩子函数 
    mounted() {
      // 确定dom渲染时，进行scroll初始化
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      // 定义一个初始化scroll的方法，在mounted()中使用
      _initScroll() {
        if(!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, { 
          probeType: this.probeType,
          click: this.click  
        })

        // 初始化scroll时，若需要监听scroll，则要取反
        if(this.listenScroll) {
          let me = this
          // 监听scroll组件， 再执行回调函数(pos) => {}
          this.scroll.on('scroll', (pos) => {
            // 调用$element方法
            me.$emit('scroll', pos)
          })
        }
      },
      // 若存在即调用enable()
      enable() {
        this.scroll && this.scroll.enable()
      },
      // 否则调用disable()
      disable() {
        this.scroll && this.scroll.disable()
      },
      // 刷新scroll重新定义高度
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      
      // 滚动到什么位置
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      // 滚动到某个元素
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    // 监听器data变化
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style scoped lang="stylus">
 
</style>


