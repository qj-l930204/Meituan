<template>
  <div class="seller-wrapper" ref="sellerWrapper">
    <div class="seller-content">
      <!--overview-->
      <div class="seller-overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="star-wrapper border-1px">
          <div class="star">
            <v-star :size="36" :score="seller.score"></v-star>
          </div>
          <span class="none">({{seller.ratingCount}})</span>
          <span class="sellCount">月售{{seller.sellCount}}单</span>
        </div>
        <div class="content">
          <div class="minPrice border-right-1px">
            <h2>起送价</h2>
            <span class="data">{{seller.minPrice}}</span>元
          </div>
          <div class="deliveryPrice border-right-1px">
            <h2>商家配送</h2>
            <span class="data">{{seller.deliveryPrice}}</span>元
          </div>
          <div class="deliveryTime border-right-1px">
            <h2>平均配送时间</h2>
            <span class="data">{{seller.deliveryTime}}</span>分钟
          </div>
        </div>
        <!--收藏-->
        <span class="collect" @click="collect">
          <i class="icon-favorite" :class="{'active': favorite}"></i>
          <p class="text">{{favoriteText}}</p>
        </span>
      </div>
      <v-split></v-split>
      <!--notice-->
      <div v-show="seller.bulletin||seller.supports" class="seller-notice">
        <h1 class="title">公告与活动</h1>
        <p v-show="seller.bulletin" class="bulletin border-1px">{{seller.bulletin}}</p>
        <ul v-if="seller.supports">
          <li v-for="(item, index) in seller.supports" class="support-item">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <v-split></v-split>
      <!--picture-->
      <div class="seller-picture">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul ref="picList">
            <li v-for="pic in seller.pics" class="pic-item">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <v-split></v-split>
      <!--info-->
      <div class="seller-info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li v-for="info in seller.infos" class="info-item">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import Star from '../star/star';
  import Split from '../split/split';
  import {saveToLoaction, loadFromLoaction} from '../../common/js/strore';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        favorite: false
      };
    },
    computed: {
      favoriteText () {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    components: {
      'v-star': Star,
      'v-split': Split
    },
    created () {
      let _this = this;
      // 数据顺序必须与data数据顺序对应一致，数组下标对应data里的type
      _this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    mounted () {
      let _this = this;
      // 首次加载和切换页面都执行 ，走if
      _this._initScroll();
      _this._initPicW();
      // 如果收藏过， 就从缓存里获取内容
      _this.favorite = loadFromLoaction(_this.seller.id, 'favorite', false);
    },
    watch: {
      'seller' () {
        this._initScroll();
        this._initPicW();
      }
    },
    // 为什么不用异步？this.$nextTick(() => {}),因为我们的seller本身是异步获取的，所以，我们需要确定scroll的初始化的执行要在dom之后
    // 不写在reated里是因为它不能确保 在dom渲染完成后执行BScroll初始化，而mounted使在dom渲染完成后才执行的
    methods: {
      _initScroll () {
        if (!this.sellerScroll) {
          // 执行①
          this.sellerScroll = new BScroll(this.$refs.sellerWrapper, {
            click: true
          });
        }
      },
      // 如果将方法直接放到count中seller会不存在
      _initPicW () {
        if (this.seller.pics) {
          let picW = 120;
          let picM = 6;
          let width = (picW + picM) * this.seller.pics.length - picM;
          this.$refs.picList.style.width = width + 'px';
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'
              });
            } else {
              this.picScroll.refresh();
            }
          });
        };
      },
      collect () {
        this.favorite = !this.favorite;
        saveToLoaction(this.seller.id, 'favorite', this.favorite);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin"

  .seller-wrapper
    position absolute
    top 174px
    bottom 0
    overflow hidden
    width 100%
    .seller-content
      .seller-overview, .seller-notice, .seller-picture, .seller-info
        padding 18px
        color rgb(7,17,27)
        font-size 12px
        .title
          font-size 14px
          line-height 14px
      .seller-overview
        position relative
        padding-bottom 0
        .content
          font-size 12px
        .star-wrapper
          padding 8px 0 18px 0
          font-size 0
          border-1px(rgba(7,17,27,.1))
          .star
            display inline-block
            margin-right 8px
            vertical-align top
          .none, .sellCount
            vertical-align top
            font-size 10px
            line-height 18px
            color rgb(77,85,93)
            margin-right 12px
        .content
          display flex
          .minPrice, .deliveryPrice, .deliveryTime
            flex 1
            margin 18px 0
            text-align center
            border-right-1px(rgba(7,17,27,.1))
            color rgb(7,17,27)
            h2
              font-size 10px
              line-height 10px
              color rgb(147,153,159)
              margin-bottom 4px
            .data
              font-size 24px
              line-height 24px
          .deliveryTime
            border-none()
        .collect
          display inline-block
          position absolute
          top 18px
          right 11px
          width 50px
          text-align center
          .icon-favorite
            font-size 24px
            line-height 24px
            color #d4d6d9
            &.active
              color rgb(240,20,20)
          .text
            margin-top 4px
            font-size 10px
            line-height 10px
            color rgb(77,85,93)
      .seller-notice
        padding-bottom 0
        .bulletin
          padding 8px 12px 16px 12px
          text-indent 2em
          line-height 24px
          color rgb(240,20,20)
          border-1px(rgba(7,17,27,.1))
        .support-item
          padding 12px 16px
          border-1px(rgba(7,17,27,.1))
          &:last-child
            border-none()
          .icon
            display inline-block
            vertical-align top
            width 16px
            height 16px
            // 这里不能用固定的图片，因为图片会根据不同的活动而不同。我们需要根据后台传过来的数据改变背景图片样式。bg-image('img/decrease_1')
            background-size cover
            background-repeat no-repeat
            &.decrease
              bg-image('img/decrease_4')
            &.discount
              bg-image('img/discount_4')
            &.guarantee
              bg-image('img/guarantee_4')
            &.invoice
              bg-image('img/invoice_4')
            &.special
              bg-image('img/special_4')
          .text
            line-height 16px
      .seller-picture
        padding 18px 0
        margin 0 18px
        overflow hidden
        .pic-wrapper
          margin-top 12px
          width 375px
          // 设置在父元素中
          white-space nowrap
          overflow hidden
          font-size 0
          .pic-item
            display inline-block
            width 120px
            height 90px
            margin-right 6px
            &:last-child
              margin-right 0
      .seller-info
        padding-bottom 0
        .title
          padding-bottom 12px
          border-1px(rgba(7,17,27,.1))
        .info-item
          padding 16px 12px
          line-height 16px
          border-1px(rgba(7,17,27,.1))
          &:last-child
            border-none()
</style>
