<template>
  <div class="singer">
    <list-view @select="selectSinger" :data="singers"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer' 
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  data() {
    return {
      // Object
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    // selectSinger，每个元素都是singer实例
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      // 调用setSinger()，传入singer方法以实现mutation的提交
      this.setSinger(singer)
    },

    // 获取歌手数据
    _getSingerList() {
      // then()表示promise成功
      getSingerList().then((res) => {
        if(res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    // 规范化歌手数据
    _normalizeSinger(list) {
      // 首先遍历数据
      let map = {
        // 热门数据
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if( index < HOT_SINGER_LEN){
          // 添加至热门数据
          // 由constructor构造器Singer对象，直接引用singer.js
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
          }))
        }
        // 给list做聚类
        const key = item.Findex
        if(!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 为了得到有序列表，我们需要处理map
      let hot = []
      let ret = []
      for(let key in map) {
        let val = map[key]
        if(val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        }else if(val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      // 字母排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // 得到一个一维数组
      return hot.concat(ret)
    },

    // 使用mapMutations
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  }
}
</script>

<style lang="stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>