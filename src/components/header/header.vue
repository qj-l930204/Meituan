<template>
  <div class="header">
    <!--header开始-->
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" width="64" height="64">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
        <div class="support" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <span v-if="seller.supports" class="supports-counts" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </span>
    </div>
    <!--header结束-->

    <!--弹层入口-->
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-icon"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <!-- 模糊图片 -->
    <div class="base-map">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <!-- 弹出层 -->
    <transition name="fade">
      <div v-if="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <v-star :size="48" :score="seller.score"></v-star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li v-for="(item, index) in seller.supports" class="item-supports">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p>{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="closeDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Star from '../star/star';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        detailShow: false
      };
    },
    created () {
      const _this = this;
      // 数据顺序必须与data数据顺序对应一致，数组下标对应data里的type
      _this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods: {
      showDetail () {
        this.detailShow = true;
      },
      closeDetail () {
        this.detailShow = false;
      }
    },
    components: {
      'v-star': Star
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixin"

  .header
    position relative
    color #fff
    background rgba(7,17,27,.5)
    // 背景图模糊溢出
    overflow hidden
    .content-wrapper
      position relative
      padding 24px 12px 18px 24px
      // 消除子元素图片和文字之间的距离
      font-size: 0
      .avatar
        display inline-block
        // 左右顶端对齐
        vertical-align top
        margin-right 16px
        img
          border-radius 5px
      .content
        display inline-block
        .title
          margin: 2px auto 8px 0
          .brand
            display inline-block
            // 设置图标文字垂直对齐
            vertical-align top
            width 30px
            height 18px
            bg-image('img/brand')
            background-size cover
            background-repeat no-repeat
          .name
            margin-left 6px
            font-size 16px
            font-weight 600
            line-height 18px
        .description
          margin-bottom 10px
          font-size 12px
          font-weight 200
          line-height 12px
        .support
          margin-bottom 2px
          .icon
            display inline-block
            vertical-align top
            width 12px
            height 12px
            // 这里不能用固定的图片，因为图片会根据不同的活动而不同。我们需要根据后台传过来的数据改变背景图片样式。bg-image('img/decrease_1')
            background-size cover
            background-repeat no-repeat
            &.decrease
              bg-image('img/decrease_1')
            &.discount
              bg-image('img/discount_1')
            &.guarantee
              bg-image('img/guarantee_1')
            &.invoice
              bg-image('img/invoice_1')
            &.special
              bg-image('img/special_1')
          .text
            margin-left 4px
            font-size 10px
            font-weight 200
            line-height 12px
      .supports-counts
        display block
        position absolute
        right 12px
        bottom 18px
        padding 7px 8px
        border-radius 14px
        background rgba(0,0,0,0.2)
        font-size 10px
        line-height 12px
        .count
          vertical-align top
          display inline-block
          margin-right 2px
        .icon-keyboard_arrow_right
          color: #fff
    .bulletin-wrapper
      position relative
      padding 0 22px 0 12px
      background rgba(7,17,27,0.1)
      height 28px
      line-height 28px
      // 此部分设置在text中无效
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      // 写font-size:0后文本省略号消失，故我们改html中的span实现消除图标与字体之间的间隙
      // font-size 0
      .bulletin-icon
        display inline-block
        vertical-align top
        margin-top 8px
        width 22px
        height 12px
        bg-image('img/bulletin')
        background-size cover
        background-repeat no-repeat
      .bulletin-text
        // 为什么不写display inline-block也行？ 内容撑开的宽度
        vertical-align top
        margin 0 4px
        font-size 10px
      .icon-keyboard_arrow_right
        position absolute
        top 8px
        right 12px
        color #fff
    .base-map
      position absolute
      top 0
      left 0
      z-index -1
      width 100%
      height 100%
      filter blur(10px)
    .detail
      position fixed
      z-index 100
      top 0
      left 0
      background rgba(7,17,27,.9)
      text-align center
      // filter blur(10px)
      width 100%
      height 100%
      opacity 1
      // 防止内容过多时出现滚动条
      overflow auto
      // 动画结束状态
      &.fade-enter-active, &.fade-leave-active
        transition all .4s linear
        opacity 1
        background rgba(7,17,27,.9)
      // 动画开始状态
      &.fade-enter, &.fade-leave-to
        opacity 0
        background rgba(7,17,27,0)
      .detail-wrapper
        min-height 100%
        width 100%
        .detail-main
          margin-top 64px
          padding-bottom 64px
          .name
            font-size 16px
            font-weight 700
            line-height 16px
          .star-wrapper
            height 24px
            margin 16px auto 0 auto
            padding 2px 0
          .title
            display flex
            margin 28px auto 24px auto
            width 80%
            .line
              flex 1
              position relative
              top -6px
              border-bottom 2px solid rgba(255,255,255,0.2)
            .text
              padding 0 12px
              font-size 14px
              line-height 14px
              font-weight 700
          .supports
            width 80%
            margin 0 auto
            text-align left
            .item-supports
              font-size 0
              padding: 0 12px
              margin-bottom 12px
              &:last-child
                margin-bottom 0
              .icon
                display inline-block
                width 16px
                height 16px
                margin-right 6px
                vertical-align top
                background-size cover
                background-repeat no-repeat
                &.decrease
                  bg-image('img/alert/decrease_2')
                &.discount
                  bg-image('img/alert/discount_2')
                &.guarantee
                  bg-image('img/alert/guarantee_2')
                &.invoice
                  bg-image('img/alert/invoice_2')
                &.special
                  bg-image('img/alert/special_2')
              .text
                font-size 12px
                line-height 16px
      .bulletin
        width 80%
        margin 0 auto
        font-size 12px
        line-height 24px
        & > p
          text-align left
          padding 0 12px
          text-indent 2em
      .icon-close
        position absolute
        width 32px
        height 32px
        clear both
        margin -64px auto 0 auto
        margin-left -16px
        font-size 32px
        color: rgba(255,255,255,0.5)
</style>
