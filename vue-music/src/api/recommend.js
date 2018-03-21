import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

// 读取config.js公共配置
export function getRecommend() {
    // 配置url，读取
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

    // 配置data
    const data = Object.assign({}, commonParams, {
        platform: 'h5', // 请求来源h5平台
        uin: 0,
        needNewCode: 1
    })

    return jsonp(url, data, options)
}

// 获取歌单接口数据
export function getDiscList() {
    const url = '/api/getDiscList'

    const data = Object.assign({}, {
        g_tk: 5381,
        notice: 0,
        inCharset: 'utf8',
        outCharset: 'utf-8',
        platform: 'yqq',
        hostUin: 0,
        sin: 0,
        ein: 29,
        sortId: 5,
        categoryId: 10000000,
        needNewCode: 0,
        rnd: Math.random(),
        format: 'json'
    })

    return axios.get(url, {
        params: data
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function getSongList(disstid) {
    const url = '/api/getSongList'

    const data = Object.assign({}, commonParams, {
        disstid,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0
    })

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}