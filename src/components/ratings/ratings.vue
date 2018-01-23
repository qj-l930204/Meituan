<template>
  <div class="rating-wrapper" ref="ratingWrapper">
    <div class="rating-content">
      <!-- top-->
      <div class="overview">
        <div class="overview-left border-right-1px">
          <div class="score">{{seller.score}}</div>
          <p class="title">综合评分</p>
          <p class="rate">高于周边商家{{seller.rankRate}}%</p>
        </div>
        <div class="overview-right">
          <div class="server-star">
            <span class="name">服务评分</span>
            <span class="star-wrapper">
              <v-star :size="36" :score="seller.serviceScore"></v-star>
            </span>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="expressage-star">
            <span class="name">商品评分</span>
            <span class="star-wrapper">
              <v-star :size="36" :score="seller.foodScore"></v-star>
            </span>
            <!-- 数字格式化filter，改4为4.0！！！！！！！！！！！！！！！！-->
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="expressage-time">
            <span class="name">送达时间</span>
            <span class="score">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <!--middle-->
      <div class="rating-select">
        <v-split></v-split>
        <v-ratingSelect :select-type="selectType" :only-content="onlyContent" :ratings="ratings" @selectChange="select" @contentChange="content"></v-ratingSelect>
      </div>
      <!--bottom-->
      <div class="ratings">
        <ul v-show="ratings && ratings.length">
          <li v-for="(rating, index) in this.ratings" v-show="needShow(rating.rateType, rating.text)" class="rating-item border-1px">
            <span class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </span>
            <div class="rating-info">
              <div class="info clearfix">
                <span class="user-name">{{rating.username}}</span>
                <span class="time">{{rating.rateTime | formatDate}}</span>
              </div>
              <div class="star-wrapper">
                <div class="star">
                  <v-star :size="24" :score="rating.score"></v-star>
                </div>
                <span v-show="rating.deliveryTime" class="delivry-time">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div v-show="rating.recommend && rating.recommend.length" class="recommend">
                <i :class="{'icon-thumb_up': rating.rateType===0}"></i>
                <span class="label" v-for="item in rating.recommend">{{item}}</span>
              </div>
            </div>
          </li>
        </ul>
        <div v-show="!ratings || !ratings.length" class="no-rating">暂无评价</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {formatDate} from '../../common/js/formatData';
  import Star from '../star/star';
  import Split from '../split/split';
  import RatingSelect from '../ratingSelect/ratingSelect';

  const ERR_OK = 0;
  const ALL = 2;

  export default {
    props: {
      seller: Object
    },
    data () {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true
      };
    },
    components: {
      'v-star': Star,
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
    created () {
      // then函数的参数必须是response，否则获取不到数据
      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {
            if (!this.ratingScroll) {
              this._initScroll();
            } else {
              this.ratingScroll.refresh();
            }
          });
        }
      });
    },
    methods: {
      _initScroll () {
        this.ratingScroll = new BScroll(this.$refs.ratingWrapper, {
          click: true
        });
      },
      // 监听函数
      select (type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.ratingScroll.refresh();
        });
      },
      content (onlyContent) {
        this.onlyContent = !onlyContent;
        // 状态变量改变后，评论区块高度变化，故需要异步刷新，重新获取元素高度
        this.$nextTick(() => {
          this.ratingScroll.refresh();
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

  .rating-wrapper
    position absolute
    top 174px
    bottom 0
    width 100%
    overflow hidden
    .rating-content
      .overview
        display flex
        padding 18px 0
        .overview-left
          flex 0 0 137px
          width 137px
          padding 6px 0
          text-align center
          border-right-1px(rgba(7,17,27,.2))
          @media only screen and (max-width: 320px)
            flex 0 0 110px
            width 110px
          .score
            font-size 24px
            line-height 26px
            color rgb(225,153,0)
          .title
            font-size 12px
            line-height 12px
            color rgb(7,17,27)
            margin 6px auto 8px auto
          .rate
            font-size 10px
            line-height 10px
            color  rgba(7,17,27,.4)
        .overview-right
          flex 1
          padding 6px 0 6px 24px
          @media only screen and (max-width: 320px)
            padding 6px 0 6px 8px
          .expressage-star
            margin 8px 0
          .server-star, .expressage-star, .expressage-time
            font-size 0
            .name
              display inline-block
              vertical-align top
              font-size 12px
              line-height 18px
              color rgb(7,17,27)
            .star-wrapper
              display inline-block
              margin-left 12px
              vertical-align top
            .score
              display inline-block
              vertical-align top
              margin-left 12px
              font-size 12px
              line-height 18px
              color rgb(225,153,0)
          .expressage-time
            .score
              color rgb(147,153,159)
      .ratings
        padding 0 18px
        .rating-item
          display flex
          padding 18px 0
          border-1px(rgba(7,17,27,.2))
          &:last-child
            border-none()
          .avatar
            flex 0 0 28px
            width 28px
            margin-right 12px
            img
              border-radius 50%
          .rating-info
            flex 1
            .info
              display block
              .user-name
                float left
                font-size 10px
                line-height 12px
                color rgb(7,17,27)
              .time
                float right
                font-size 10px
                line-height 12px
                color rgb(147,153,159)
            .star-wrapper
              font-size 0
              margin 4px 0 6px 0
              .star
                display inline-block
                margin-right 6px
                vertical-align top
              .delivry-time
                display inline-block
                vertical-align top
                font-size 10px
                line-height 12px
                color rgb(147,153,159)
            .text
              font-size 12px
              line-height 18px
              color rgb(7,17,27)
              margin-bottom 8px
            .recommend
              font-size 0
              .icon-thumb_up, .icon-thumb_down
                font-size 12px
                line-height 16px
                color rgb(0,160,220)
                margin-right 8px
              .label
                display inline-block
                margin-right 8px
                margin-bottom 4px
                border 1px rgba(7,17,27,.1) solid
                padding 0 6px
                font-size 9px
                line-height 16px
                color rgb(147,153,159)
        .no-rating
          font-size 12px
          padding 16px 0
          color rgb(147,153,159)
</style>
