<template>
  <div class="slider" ref="slider">
      <!-- slotA与slotE有什么区别 -->
      <div class="slider-group" ref="sliderGroup">
        <slot></slot>
      </div>
      <!-- 添加dots为了设置自动轮播 -->
      <div class="dots">
        <span class="dot" v-for="(item,index) in dots" :key="index" :class="{active: currentPageIndex === index}"></span>
      </div>
  </div>
</template>

<script type="text/ecmascript">
  import BScroll from "better-scroll"
  import {addClass} from "common/js/dom"

  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0  // 当前界面切面
      }
    },
    props: {
      // loop玄幻轮播
      loop: {
        type: Boolean,
        default: true
      },
      // autoPlay自动轮播
      autoPlay: {
        type: Boolean,
        default: true
      },
      // 轮播间隔
      interval: {
        type: Number,
        default: 4000
      }
    },
    // mounted钩子
    mounted() {
       setTimeout(() => {
         this._setSliderWidth()
         this._initDots()
         this._initSlider()

         // 当autoPlay自动播放为真
         if(this.autoPlay) {
           this._play() 
         }
       }, 20)

       // 优化sliderWidth宽度不一的问题
       window.addEventListener('resize', () => {
         // 当slider未初始化
         if(!this.slider) {
           return
         }
         // 判断是否有isResize(),
         this._setSliderWidth(true)
         // 宽度发生变化，需要重新计算刷新以下slider
         this.slider.refresh()
       })
    },
    // methods方法
    methods: {
      // 设置轮播宽度
      _setSliderWidth(isResize) {
        // 获得列表元素多少
        this.children = this.$refs.sliderGroup.children

        // 设置宽度/每个slider宽度均为元素的clientWidth
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for(let i=0; i<this.children.length; i++) {
          // 先获取每个子元素
          let child = this.children[i]  
          // import addClass方法，并传入参数
          addClass(child, 'slider-item')
          // 设置每个child的宽度
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        // 若loop自动播放为true，且不需要resize时，loop需要克隆2倍宽度
        if(this.loop  && !isResize) {
          width += 2*sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      // 初始化dots
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      // 初始化轮播图
      _initSlider() {
        // 绑定DOM元素,options配置
        this.slider = new BScroll(this.$refs.slider, {
          // 只允许横向滚动，不允许纵向
          scrollX: true,
          scrollY: false,
          momentum: false,   // 惯性
          snap: true,   //无缝滚动
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400,
          // 测试——移动端app上click bug：由于a链接为默认行为，所以与click发生冲突，可以把该属性删除
          // click: true
        })

        // 给slider绑定scrollEnd()事件() => {}回调函数
        this.slider.on('scrollEnd', () => {
          // 表示第几个子元素
          let pageIndex = this.slider.getCurrentPage().pageX  
          if(this.loop) {
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex

          // 测试：由于上述代码运行只滚动一次，所以该事件scrollEnd有bug，对其添加autoPlay进行测试
          if(this.autoPlay) {
            // 由于在自动播放的时候，是手动播放，所以需要clear定时器
            clearInterval(this.timer)
            this._play()
          }
        })
      },
      // 播放幻灯片
      _play() {
        let pageIndex = this.currentPageIndex + 1
        if(this.loop) {
          pageIndex += 1
        }

        // 定义定时器
        this.timer = setInterval(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    },

    // destroyed生命周期，当存在寄存器，元素销毁时机，清除资源
    destroyed() {
      clearTimeout(this.timer)
    }
    
  }  
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .slider
    min-height: 1px;
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center 
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none 
        img  
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>

