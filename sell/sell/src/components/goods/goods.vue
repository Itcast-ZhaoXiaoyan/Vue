<template>
  <div class="goods">
    <div class="menu-wrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="menu-item">
          <span class="text border-1px">
            <span v-show="item.type >0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="food-list">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(foods,index) in item.foods" :key="index" class="food-list">
              <div class="icon">
                <img src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span>月售{{food.sellCount}}份</span>
                  <span>好评率{{foods.rating}}%</span>
                </div>
                <div class="price">
                  <span>￥{{food.price}}</span>
                  <span v-show="food.oldPrice">￥{{oldPrice}}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  
</template>

<script>
  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: []
      }
    },
    created() {
      this.classMap = ['decrease','discount','special','invoice','guarantee'];
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if(response.errno == ERR_OK){
          this.goods = response.data;
        }
      });
    }
  };
</script>

<style lang="stylus">
  border-1px($color)
    position: relative
    &:after
      display: block
      position: absolute
      left: 0
      top: 0
      width: 100%
      border-top: 1px solid $color
      content: ' '

  bg-image($url)
    background-image: url($url + "@2x.png");
    @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3)
      background-image: url($url + "@3x.png");

  .goods
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;

    .menu-wrapper
      flex: 0 0 80px;
      width: 80px;
      background: #f3f5f7;
      text-align: center;
      .menu-item
        display: table;
        height: 54px;
        width: 56px;
        line-height: 14px;
        padding: 0 12px;
        .icon
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right:2px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          &.decrease
            bg-image('decrease_3');
          &.discount
            bg-image('discount_3');
          &.guarantee
            bg-image('guarantee_3');
          &.invoice
            bg-image('invoice_3');
          &.special
             bg-image('special_3');
        .text
          display: table-cell;
          width: 56px;
          vertical-align: middle;
          border-1px(rgba(7, 17, 27, 0.1));
          font-size: 12px;
         
    .foods-wrapper
      flex: 1;

</style>

