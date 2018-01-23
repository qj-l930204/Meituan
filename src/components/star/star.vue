<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5;
  // 为了便于修改维护，我们将‘on’，‘half’，‘off’三个值定为常量
  const CLA_ON = 'on';
  const CLA_HALF = 'half';
  const CLA_OFF = 'off';

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType () {
        return 'star-' + this.size;
      },
      itemClasses () {
        let result = [];
        // 计算分数转化为半数（4.5）或整数（4、5）
        let score = Math.floor(this.score * 2) / 2;
        // 判断是否是分数，是，返回真
        let isDicimal = score % 1 !== 0;
        // 对score向下取整，获取整数部分并赋值，值的名称必须与类名一致
        let integer = Math.floor(score);
        for (let i = 0; i < integer; i++) {
          result.push(CLA_ON);
        }
        if (isDicimal) {
          result.push(CLA_HALF);
        }
        while (result.length < LENGTH) {
          result.push(CLA_OFF);
        }

        return result;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

  .star
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size cover
        &:last-child
          margin-right 0
        &.on
          bg-image('img/star48_on')
        &.half
          bg-image('img/star48_half')
        &.off
          bg-image('img/star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size cover
        &:last-child
          margin-right 0
        &.on
          bg-image('img/star36_on')
        &.half
          bg-image('img/star36_half')
        &.off
          bg-image('img/star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size cover
        &:last-child
          margin-right 0
        &.on
          bg-image('img/star24_on')
        &.half
          bg-image('img/star24_half')
        &.off
          bg-image('img/star24_off')
</style>
