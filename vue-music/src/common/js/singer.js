// Singer类封装、做聚合，给对应的singer.vue list表单，定义一个Singer类，以对象形式引用
export default class Singer {
    constructor({ id, name }) {
        this.id = id
        this.name = name
        this.avatar = `https://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg?max_age=2592000`
    }
}