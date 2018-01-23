<template>
  <transition name="slide">
    <div class="foodInfo-wrapper" v-show="showFoodInfo" ref="foodInfo">
      <div class="content-wrapper">
        <div class="image">
          <img :src="food.image">
        </div>
        <div class="detail">
          <h1 class="name">{{food.name}}</h1>
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{food.rating}}%</span>
          <div class="sell-price">
            <!--中文状态下 shift+4 打印￥符号-->
            <span class="price">￥{{food.price}}</span>
            <span v-show="food.oldPrice" class="oldprice"><s>￥{{food.oldPrice}}</s></span>
          </div>
          <!--加入购物车按钮-->
          <div class="cart-wrapper">
            <v-cartCtrl :food="food"></v-cartCtrl>
          </div>
          <!-- 加入动画，使元素消失延后，从而可以使小球获取正确的初始位置-->
          <transition name="slideto">
            <div class="addFirst" v-show="!food.count || food.count===0">
              <span class="add-cart" @click="addfood">加入购物车</span>
            </div>
          </transition>
        </div>
        <v-split></v-split>
        <div class="profile">
          <h1 class="name">商品介绍</h1>
          <p class="info">{{food.info}}</p>
        </div>
        <v-split></v-split>
        <div class="ratings">
          <h1 class="name">商品评价</h1>
          <v-ratingSelect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings" @selectChange="select" @contentChange="content"></v-ratingSelect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings&&food.ratings.length"> <!-- show也可以绑定函数的返回值-->
              <li v-for="rating in food.ratings" class="rating-item border-1px" v-show="needShow(rating.rateType, rating.text)">
                <div class="rating-info clearfix">
                  <!-- 用Vue的过滤器filter对时间戳进行格式化-->
                  <span class="time">{{rating.rateTime | formatDate}}</span>
                  <div class="user-info">
                    <span class="user-name">{{rating.username}}</span>
                    <span class="user-avatar">
                      <img :src="rating.avatar" width="12" height="12">
                    </span>
                  </div>
                </div>
                <div class="rating-content">
                  <span class="type"><i :class="{'icon-thumb_up': rating.rateType===0, 'icon-thumb_down': rating.rateType===1}"></i></span>
                  <p class="text">{{rating.text}}</p>
                </div>
              </li>
            </ul>
            <div v-show="!food.ratings||food.ratings.length===0" class="no-rating">暂无评论。。。</div>
          </div>
        </div>
        <!-- 返回按钮-->
        <div class="return" @click="goback">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
//  加{}是因为js模块中是使用“export function”导出的接口，而不是用“export default”，{A,B}可以导出多个方法
  import {formatDate} from '../../common/js/formatData';
  import CartCtrl from '../cartControl/cartControl';
  import Split from '../split/split';
  import RatingSelect from '../ratingSelect/ratingSelect';

  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {
        showFoodInfo: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    components: {
      'v-cartCtrl': CartCtrl,
      'v-split': Split,
      'v-ratingSelect': RatingSelect
    },
    filters: {
      formatDate (time) {
        // 第一步：将时间戳转化为时间对象
        let date = new Date(time);
        // 第二步：用通用js方法进行格式化 ，js模块化编程
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    methods: {
      goto () {
        this.showFoodInfo = true;
        // 在这个页面中，我们希望开始加载时总显示初始设置时的评论状态，故在此对状态进行初始化，否则会随着变量的改变（组件可能会被多个组件使用），评论的开始显示状态也会改变
        this.selectType = ALL;
        this.onlyContent = true;
        if (!this.foodscroll) {
          this.$nextTick(
            this._foodScrooll()
          );
        } else {
          this.foodscroll.refresh();
        }
      },
      goback () {
        this.showFoodInfo = false;
      },
      _foodScrooll () {
        this.foodscroll = new BScroll(this.$refs.foodInfo, {
          click: true
        });
      },
      addfood () {
        this.$emit('add', event.target);
        Vue.set(this.food, 'count', 1);
      },
      // 监听select子组件方法
      select (type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.foodscroll.refresh();
        });
      },
      content (onlyContent) {
        this.onlyContent = !onlyContent;
        // 状态变量改变后，评论区块高度变化，故需要异步刷新，重新获取元素高度
        this.$nextTick(() => {
          this.foodscroll.refresh();
        });
      },
      // 筛选要显示的评论
      needShow (rateType, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return rateType === this.selectType;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin"

  .foodInfo-wrapper
    position fixed
    top 0
    left 0
    width 100%
    bottom 48px
    z-index 30
    background #fff
    &.slide-enter-active, &.slide-leave-active
      transition: all .6s
    &.slide-enter, &.slide-leave-to
      transform: translateX(100%)
    .content-wrapper
      .image
        position: relative
        width 100%
        height 0
        padding-top 100%
        img
          position absolute
          top 0
          left 0
          width 100%
          height 100%
      .detail
        position relative
        padding 18px
        font-size 0
        .name
          font-size 14px
          font-weight 700
          line-height 14px
          color rgb(7,17,27)
        .sell-count, .rating
          display inline-block
          margin 8px 12px 18px 0
          font-size 10px
          line-height 10px
          color rgb(147,153,159)
        .sell-price
          .price
            color rgb(240,20,20)
            font-size 14px
            font-weight 700
            line-height 24px
            margin-right 8px
          .oldprice
            font-size 10px
            color rgb(147,153,159)
            font-weight 700
            line-height 24px
        .slideto-enter-active, .slideto-leave-active
          transition: all .4s
          transform translateX(0,0,0)
          opacity 1
        .slideto-enter, .slideto-leave-to
          transform: translateX(100%)
          opacity 0
        .cart-wrapper
          position absolute
          bottom 16px
          right 17px
          z-index 10
        .addFirst
          position absolute
          bottom 28px
          right 18px
          z-index 11
          .add-cart
            background rgb(0,160,220)
            border-radius 24px
            padding 8px 12px
            font-size 10px
            color #fff
            line-height 12px
      .profile
        padding 18px
        .name
          font-size 14px
          color rgb(7,17,27)
          margin-bottom 6px
        .info
          font-size 12px
          color rgb(77,85,93)
          line-height 24px
          padding 0 8px
      .ratings
        .name
          padding 18px 0 0 18px
          font-size 14px
          color rgb(7,17,27)
        .rating-wrapper
          margin 0 18px 48px 18px
          .rating-item
            padding 16px 0
            border-1px(rgba(7,17,27,.2))
            &:last-child
              border-none()
            .rating-info
              display block
              margin-bottom 6px
              .time
                float left
              .user-info
                float right
                .user-name
                  font-size 10px
                  color rgb(147,153,159)
                  line-height 12px
                .user-avatar
                  width 12px
                  height 12px
                  margin-left 6px
                  border-radius 50%
                  vertical-align top
                  img
                    border-radius 50%
            .time
              font-size 10px
              line-height 12px
              color rgb(147,153,159)
            .rating-content
              font-size 0
              .type
                font-size 12px
                line-height 16px
                margin-right 4px
                .icon-thumb_down
                  color rgb(147,153,159)
                .icon-thumb_up
                  color rgb(0,160,220)
              .text
                display inline-block
                font-size 12px
                line-height 16px
                color rgb(7,17,27)
          .no-rating
            font-size 12px
            padding 16px 0
            color rgb(147,153,159)
      .return
        position fixed
        top 4px
        left 8px
        // 增大点击区域
        padding 10px
        font-size 16px
        color #fff
</style>
