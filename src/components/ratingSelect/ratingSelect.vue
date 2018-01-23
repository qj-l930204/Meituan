<template>
  <div class="select-wrapper">
    <div class="select-type border-1px">
      <span class="block" :class="{'positive': selectType===2}" @click="select(2)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block" :class="{'positive': selectType===0}" @click="select(0)">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
      <span class="block" :class="{'positive': selectType===1}" @click="select(1)">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
    </div>
    <div class="only-content" @click="contentOnly">
      <i class="icon-check_circle" :class="{'active': onlyContent}"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      ratings: {
        type: Array,
        default () {
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '好评',
            negative: '差评'
          };
        }
      }
    },
    data () {
      return {};
    },
    methods: {
      select (type) {
        // this.selectType = type;
        this.$emit('selectChange', type);
      },
      contentOnly () {
        // console.log(this.onlyContent + '1');
        // this.onlyContent = !this.onlyContent; 子组件可以更改自己的属性，但不能更改props过来的属性，只能传递给父组件，有父组件更改，然后再传回来，从而
        // 实现父子组件同值，子组件也可传递自己的私有属性，这要看父组件是否需要
        this.$emit('contentChange', this.onlyContent);
        // console.log(this.onlyContent + '2');
      }
    },
    computed: {
      positive () {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negative () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

  .select-wrapper
    .select-type
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7,17,27,.1))
      font-size 0
      .block
        // span必须设置display，否则就算本身元素的样式一样，也会影响其他元素的布局
        display inline-block
        padding 8px 12px
        margin-right 8px
        font-size 12px
        line-height 16px
        border-radius 2px
        color rgb(77,85,93)
        background rgba(0,160,220,.2)
        &:last-child
          background rgba(77,85,93,.2)
          &.positive
            background rgba(77,85,93,1)
            color #fff
        &.positive
          background rgba(0,160,220,1)
          color #fff
        .count
          font-size 8px
          line-height 16px
          margin-left 3px
    .only-content
      padding 12px 18px
      border-bottom 1px rgba(7,17,27,.1) solid
      color rgba(147,153,159,1)
      .icon-check_circle
        vertical-align top
        font-size 24px
        line-height 24px
        &.active
          color #00c850
      .text
        vertical-align top
        font-size 12px
        line-height 24px
</style>
