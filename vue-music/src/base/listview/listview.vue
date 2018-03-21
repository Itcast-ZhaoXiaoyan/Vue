<template>
  <scroll class="listview" 
          :data="data" 
          ref="listview"
          :listenScroll="listenScroll"
          :probeType = "probeType"
          @scroll = "scroll"
  >
    <!-- 左侧：listview歌单列表 -->
    <ul>
      <li v-for="group in data" class="list-group" :key="group.key" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item" :key="item.key">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 右侧：快速入口/a-zA-Z/ 离开时候需要阻止事件冒泡-->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
     <ul>
       <li v-for="(item, index) in shortcutList" 
           class="item" 
           :data-index="index" :key="item.key"
           :class="{'current' : currentIndex===index}"
       >
         {{item}}
       </li>
     </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    created() {
      // 创建一个touch空对象
      this.touch = {}
      // 创建一个监听scroll事件
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    data() {
      return {
        scrollY: -1,
        // 当前滚动到的位置
        currentIndex: 0,
        // 滚动的上限与下限的滚动差
        diff: -1
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      // 右侧快速入口
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      // 滚动标题至上
      fixedTitle() {
        if(this.scrollY > 0) return
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      refresh() {
        this.$refs.listview.refresh()
      },
      onShortcutTouchStart(e) {
        // 获取当前触摸的index
        let anchorIndex = getData(e.target, 'index')
        // 第一次触发时的位置
        let firstTouch = e.touches[0]
        // 获取touch到的垂直方向位置
        this.touch.y1 = firstTouch.pageY
        // 记录下来需要锚点的index
        this.touch.anchorIndex = anchorIndex
        // 引用listview元素，进行滚动 
        this._scrollTo(anchorIndex)
      },
      // 触发离开
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        // 定义需要滚动对少个data元素，|0表示取整，类似于Math.floor()
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        // 离开move时候的anchorIndex，由于this.touch.anchorIndex为字符串类型，因此要转换为整型int
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._scrollTo(anchorIndex)
      },
      // scroll()
      scroll(pos) {
        // 实时观测滚动到y轴的距离
        this.scrollY = pos.y
      },
      // 滚动到哪个索引的元素的位置
      _scrollTo(index) {
        // 若index === null，返回null
        if(!index && index !== 0){
          return 
        }
        // 若index<0   || index> this.listHeight-2
        if(index < 0) {
          index = 0
        } else if(index > this.listHeight.length -2) {
          index = this.listHeight.length -2
        }

        // 手动设置scrollY的位置
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      // 计算高度
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for(let i=0; i<list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      // 监听data发生变化
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      // 监听scrollY的变花
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部，newY>0
        if(newY > 0) {
          this.currentIndex = 0
          return 
        }
        // 当中间部分滚动， 
        for(let i=0; i<listHeight.length -1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i+1]
          // 向上滚动srcollY的值为负 所以加上负号
          // 若不是height2下限，且在height1与height2之间
          if(-newY >= height1 && -newY<height2) {
            this.currentIndex = i
            // 设置diff
            this.diff = height2 + newY
            // console.log(this.diff)
            // console.log(this.currentIndex)
            return 
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length -2
      },
      // 实时变化的newVal
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal< TITLE_HEIGHT) ? newVal-TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return 
        }
        this.fixedTop = fixedTop
        // 设置元素的偏移
         this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .listview 
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)

</style>