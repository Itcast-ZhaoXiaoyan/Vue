// jsonp封装
import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
    // url拼接
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
        // Promise()回调函数，类似于callback，三种状态：pending(进行中)/resolve(已完成)/reject(已失败)
    return new Promise((resolve, reject) => {
        originJSONP(url, option, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

// 将data转换为json格式
function param(data) {
    let url = ''
    for (var k in data) {
        let value = data[k] !== undefined ? data[k] : ''
        url += `&${k}=${encodeURIComponent(value)}`
    }
    return url ? url.substring(1) : ''
}