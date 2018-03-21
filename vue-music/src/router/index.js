import Vue from 'vue'
import Router from 'vue-router'

import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Search from 'components/search/search'
import Rank from 'components/rank/rank'
import Songlist from 'components/songlist/songlist'

Vue.use(Router)

export default new Router({
    routes: [
        // 根组件默认的指向
        {
            path: '/',
            component: Recommend
        },
        {
            path: '/recommend',
            component: Recommend
        },
        {
            path: '/singer',
            component: Singer,
            children: [{
                // 以id作为识别跳转到不同歌手的详情页
                path: ':id',
                component: Songlist
            }]
        },
        {
            path: '/rank',
            component: Rank
        },
        {
            path: '/search',
            component: Search
        }
    ]
})