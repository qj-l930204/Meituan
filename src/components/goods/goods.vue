<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul class="menu">
        <li v-for="(item, index) in goods" class="menu-item border-1px" :class="{'current':currentIndex === index}" @click="selectMenu(index)">
          <!-- 这里icon放text标签里，效果为半包围，若愚text并列放，效果为左右结构-->
          <span class="text">
            <span v-if="item.type > 0" :class="classMap[item.type]" class="icon"></span>{{goods[index].name}}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="foods-list foods-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul class="food">
            <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food)">
              <div  class="icon">
                <img :src="food.icon" width="57" height="57">
              </div>
              <div class="food-info">
                <h2 class="name">{{food.name}}</h2>
                <p class="description">{{food.description}}</p>
                <div class="extra">
                  <!-- 不换行，使月售与好评率之间没有空格-->
                  <span class="count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="sellPrice">
                  <!--中文状态下 shift+4 打印￥符号-->
                  <span class="price">￥{{food.price}}</span><span v-show="food.oldPrice" class="oldPrice"><s>￥{{food.oldPrice}}</s></span>
                </div>
              </div>
              <div class="cartCtrl-wrapper">
                <!--【Ⅰ】子组件通过$emit向父组件派发事件，父组件通过v-on监听-->
                <v-cartCtrl :food="food" @add="addball"></v-cartCtrl>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 商品详情页组件，由于位置固定，可以不用wrapper包装-->
    <v-foodInfo :food="selectedFood" ref="selectfood" @add="addball"></v-foodInfo>
    <!-- 传参数时的变量名用“-”链接，子组件接收时用驼峰法：delivery-price ==> deliveryprice-->
    <v-cart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" ref="shopcart"></v-cart>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Cart from '../carts/carts';
  import CartContrl from '../cartControl/cartControl';
  import FoodInfo from '../foodInfo/foodInfo';

  const ERR_OK = 0;
  let foodList = [];

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        foodsListH: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    created () {
//      const _this = this;
      // 数据顺序必须与data数据顺序对应一致，数组下标对应data里的type
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          // 异步初始化Bscroll对象，可用setTimeOut（）代替，使初始化时间在dom成功渲染之后，此时才能获取到真正的内容的高度
          this.$nextTick(() => {
            if (!this.menuScroll || !this.foodsScroll) {
              this._initScroll();
              this._calculateHeight();
            } else {
              this.menuScroll.refresh();
              this.foodsScroll.refresh();
            }
          });
        }
      });
    },
    computed: {
      selectFoods () {
        // price 数据库中有，count是子组件中新添加的属性，需要先获取，然后传递给另一个子组件
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              // 也可以push对象{count: food.count, price: food.price}，因为子组件里只用到count盒price两个属性
              foods.push(food);
            }
          });
        });
        return foods;
      },
      // ④属性计算使左边跟着右边联动，由:class="{'样式名'：currentIndex===index}"实现
      currentIndex () {
        for (let i = 0; i < this.foodsListH.length; i++) {
          let height1 = this.foodsListH[i];
          let height2 = this.foodsListH[i + 1];
          // >=页面第一次加载时菜单第一项才会有样式
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      }
    },
    methods: {
      _initScroll () {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          // ②实时获取food滚动高度的探针
          probeType: 3
        });
        // ③获取实时高度
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      // ①利用实时获取右侧滚动的高度来设置左边的当前激活菜单的样式，使左右联动
      _calculateHeight () {
        let height = 0;
        this.foodsListH.push(height);
        foodList = this.$refs.foodsWrapper.getElementsByClassName('foods-list-hook');
        for (let i = 0; i < foodList.length; i++) {
          height += foodList[i].clientHeight;
          this.foodsListH.push(height);
        }
      },
      // ⑤使右边跟随左边联动
      selectMenu (index) {
        // 有问题：当先在移动设备中点击，再在浏览器中点击可以，但反过来，浏览器中不能点击？？？？？？？？？？？？？
        this.scrollY = this.foodsListH[index];
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 350);
      },
      selectFood (food) {
        this.selectedFood = food;
        this.$refs.selectfood.goto();
      },
      // 【Ⅱ】父组件中监听cartCtrl子组件的方法
      addball (target) {
        this._drop(target);
      },
      // 【Ⅲ】在监听事件中，通过ref获取另一个子组件cart并调用cart中的方法drop(drop获取下落的小球)
      _drop (target) {
        // 体验优化，异步执行小球下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      }
    },
    components: {
      'v-cart': Cart,
      'v-cartCtrl': CartContrl,
      'v-foodInfo': FoodInfo
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin"
  .goods
    display flex
    // 这里考虑到屏幕的可视区域为中间部分，且内容超出可滚动，需要用到一个scroll插件，以防止滚动条的出现，而要实现滚动效果外层容器高度就必须固定
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      // 宽度必须写，否则在安卓上显示有问题
      width 80px
      background #f3f5f7
      .menu
        .menu-item
          // 为了使文字垂直居中，我们定义显示形式为表格形式
          display table
          height 54px
          padding 0 12px
          &.current
            position relative
            margin-top -1px
            background #fff
            .text
              border-none()
              font-weight 700
          .icon
            display inline-block
            width 12px
            height 12px
            // 半包围结构，文字与图标之间没有缝隙，父元素不用font-size=0；
            margin-right 2px
            vertical-align top
            background-size cover
            background-repeat no-repeat
            &.decrease
              bg-image('img/decrease_3')
            &.discount
              bg-image('img/discount_3')
            &.guarantee
              bg-image('img/guarantee_3')
            &.invoice
              bg-image('img/invoice_3')
            &.special
              bg-image('img/special_3')
          .text
            // 这里我们定义显示形式为单元格形式，再用vertical-align:middle使文字垂直居中
            display table-cell
            width 56px
            vertical-align middle
            font-size 12px
            color: rgb(85,70,93)
            line-height 14px
            border-1px(rgba(7,17,27,.1))
    .foods-wrapper
      flex 1
      .foods-list
        .title
          background #f3f5f7
          border-left 2px #d9dde1 solid
          padding-left 14px
          font-size 12px
          line-height 26px
          color rgb(147,153,159)
        .food
          padding 0 18px
          .food-item
            position relative
            display flex
            padding 18px 0
            border-1px(rgba(7,17,27,.1))
            &:last-child
              border-none()
            .icon
              flex 0 0 57px
              margin-right 10px
            .food-info
              flex 1
              margin-top 2px
              font-size 10px
              color rgb(147,153,159)
              line-height 10px
              .name
                font-size 14px
                color rgb(7,17,27)
                line-height 14px
              .description
                margin 8px 0
              .extra
                .count
                  margin-right 12px
              .sellPrice
                line-height 24px
                .price
                  color rgb(240,20,20)
                  font-size 14px
                  font-weight 700
                  margin-right 8px
                .oldPrice
                  color rgb(147,153,159)
                  font-size 10px
                  font-weight 700
            .cartCtrl-wrapper
              position absolute
              bottom 8px
              right 0
</style>
