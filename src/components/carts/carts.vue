<template>
  <div class="cart-wrapper">
    <!-- 点击展示购物车列表事件写在这里会与“去结算”按钮冲突，有冒泡产生 -->
    <div class="content" @click="toggleList">
      <div class="cart-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'blue':totalCount > 0}">
            <i class="icon-shopping_cart"></i>
          </div>
        </div>
        <span class="price" :class="{'white': totalCount > 0}">￥{{totalPrice}}</span><span class="delivery">另需配送费￥{{deliveryPrice}}元</span>
      </div>
      <div class="cart-right">
        <!-- 通过.stop.prevent阻止事件冒泡-->
        <div class="text" :class="diffClass" @click.stop.prevent="pay">{{diffPrice}}</div>
      </div>
      <span v-if="totalCount > 0" class="foodsCount">{{totalCount}}</span>
    </div>
    <!--飞舞的小球-->
    <div class="ball-wrapper">
      <transition-group v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter" name="drop">
        <div v-for="(ball, index) in balls" v-show="ball.show" class="ball" :key="index">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>
    <!--购物车列表-->
    <transition name="fold">
      <div class="cartlist-wrapper" v-show="listShow">
        <div class="list-header border-1px">
          <span class="name">购物车</span>
          <span class="empty" @click="clearCart">清空</span>
        </div>
        <div class="list-body" ref="cartList">
          <ul>
            <li v-for="food in selectFoods" class="cart-item border-1px">
              <span class="foodName">{{food.name}}</span>
              <div class="foodPrice">
                <span>{{food.count*food.price}}</span>
              </div>
              <div class="cartCtrl-wrapper">
                <v-cartCtrl :food="food"></v-cartCtrl>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <!--购物车背景层-->
    <transition name="fade">
      <div v-show="!this.fold" class="bg-cart"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import CartControl from '../cartControl/cartControl';
  import BScroll from 'better-scroll';

  export default {
    props: {
      selectFoods: {
        type: Array,
        default () {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        fold: true,
        balls: [
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ],
        dropBalls: []
      };
    },
    components: {
      'v-cartCtrl': CartControl
    },
    computed: {
      totalPrice () {
        let price = 0;
        this.selectFoods.forEach((food) => {
          price += food.count * food.price;
        });
        return price;
      },
      totalCount () {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      diffPrice () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          return `还差${this.totalPrice - this.minPrice}元起送`;
        } else if (this.totalPrice >= this.minPrice) {
          return '去结算';
        }
      },
      diffClass () {
        if (this.totalPrice > 0 && this.totalPrice < this.minPrice) {
          return 'no-enogth';
        } else if (this.totalPrice >= this.minPrice) {
          return 'enogth';
        }
      },
      listShow () {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        };
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.cartScroll) {
              this._initScroll();
            } else {
              this.cartScroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      _initScroll () {
        this.cartScroll = new BScroll(this.$refs.cartList, {
          click: true
        });
      },
      clearCart () {
        let clear = confirm('确定清空购物车吗？');
        if (clear) {
          this.selectFoods.forEach((food) => {
            food.count = 0;
          });
        } else {}
      },
      toggleList () {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      pay () {
        alert('去结算咯');
      },
      // 获取即将下落的和已经下落的小球
      drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      // 定义小球动画
      beforeEnter (el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            // 浏览器的接口，获取ball相对视口的上，左距离,
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            // 先使小球显示，然后将获取到的位置设置给小球，即小球的初始位置
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter (el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });

        done();
      },
      afterEnter (el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = ''; // 应该是none
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin"
  .cart-wrapper
    position fixed
    z-index 50
    bottom 0
    left 0
    height 48px
    width 100%
    .content
      display flex
      background #141d27
      .cart-left
        flex 1
        font-size 0
        .logo-wrapper
          display inline-block
          position relative
          top -10px
          margin 0 0 0 12px
          padding 6px
          // 改为IE盒模型，不用考虑padding撑开问题
          box-sizing border-box
          width 56px
          height 56px
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            line-height 65px
            background #2b343c
            .icon-shopping_cart
              color rgba(255,255,255,.4)
              font-size 24px
          .blue
            background rgb(0,160,220)
            .icon-shopping_cart
              color rgba(255,255,255,1)
        .delivery, .price
          position relative
          top -10px
          padding 0 8px
          font-size 14px
          line-height 48px
          color rgba(255,255,255,.4)
        .price
          font-weight 700
          border-right 1px rgba(255,255,255,.4) solid
        .white
          color rgba(255,255,255,1)
      .cart-right
        flex 0 0 105px
        width 105px
        text-align center
        line-height 48px
        .text
          font-size 12px
          font-weight 700
          color rgba(255,255,255,.4)
          background #2b343c
          &.enogth
            color rgba(255,255,255,1)
            background #00b43c
          &.no-enogth
            color rgba(255,255,255,1)
            background rgb(0,160,220)
      .foodsCount
        position absolute
        left 44px
        top -10px
        padding 3px 6px
        background rgb(240,20,20)
        border-radius 15px
        box-shadow 0 4px 8px 0 rgba(0,0,0,.4)
        color #fff
        font-size 9px
        font-weight 700
    .ball-wrapper
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 1000
        transition all .4s cubic-bezier(.49,-0.29,.57,.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0,160,220)
          transition all .4s
    .cartlist-wrapper
      position absolute
      z-index -1
      bottom 48px
      left 0
      width 100%
      &.fold-enter-active
        transition all .5s
        transform translate3d(0,0,0)
      &.fold-leave-active
        transition all .5s
        transform translate3d(0,100%,0)
      &.fold-enter
        transform translate3d(0,100%,0)
      &.fold-leave
        transform translate3d(0,0,0)
      .list-header
        background #f3f5f7
        height 40px
        padding 0 18px
        line-height 40px
        border-1px(rgba(7,17,27,.1))
        .name
          float left
          font-size 14px
          color rgb(7,17,27)
        .empty
          float right
          font-size 12px
          color rgb(0,160,220)
      .list-body
        max-height 240px
        padding 0 18px
        background #fff
        overflow hidden
        .cart-item
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7,17,27,.1))
          &:last-child
            border-none()
          .foodName
            line-height 24px
            font-size 14px
            color rgb(7,17,27)
          .foodPrice
            position absolute
            right 90px
            bottom 12px
            font-size 14px
            line-height 24px
            font-weight 700
            color rgb(240,20,20)
            margin-right 12px
          .cartCtrl-wrapper
            position absolute
            right 0
            bottom 6px
    .bg-cart
      position fixed
      top 0
      left 0
      z-index -2
      width 100%
      height 100%
      background rgba(7,17,27,.6)
      backdrop-filter blur(10px) //只写一个就行，vue里可以自己添加样式适应不同浏览器
      -webkit-backdrop-filter blur(10px)
      &.fade-enter-active, &.fade-leave-active
        transition all .5s
        opacity 1
      &.fade-enter, &.fade-leave-to
        opacity 0
</style>
