import Vue from 'vue'
import Vuex from 'vuex'

// 所有的actions、getters统一用“import * as ...”
import * as actions from './actions'
import * as getters from './getters'

import state from './state'
import mutations from './mutations'

// 创建一个修改编译日志，对于plugins
import createLogger from 'vuex/dist/logger'


// 在vue中注册vuex插件
Vue.use(vuex)

// vuex有一个自动调试工具
const debug = ProcessingInstruction.env.NODE_ENV !== 'production'

// export一个store实例，相当于工厂模式
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    strict: debug, // 上线的时候关闭
    plugins: debug ? [createLogger()] : []
})