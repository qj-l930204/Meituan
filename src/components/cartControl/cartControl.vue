<template>
  <div class="control-wrapper">
    <transition name="ground">
      <div class="dec" v-show="food.count>0" @click.stop.prevent="decFood">
        <i class="icon-remove_circle_outline"></i>
      </div>
    </transition>
    <transition name="count">
      <div class="count" v-show="food.count>0"><span>{{food.count}}</span></div>
    </transition>
    <div class="add" @click.stop.prevent="addFood">
      <i class="icon-add_circle"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    created () {
      // console.log(this.food);
    },
    methods: {
      addFood () {
        // 注意，这个count字段不存在数据库中，它是通过用户操作事件才增加的新字段，与price等固有的字段不同
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        // 子组件向父组件派发事件，goods父组件@add="方法"，值在方法中传递。但不能改变父组件传递过来的数据
        this.$emit('add', event.target);
      },
      decFood () {
        if (this.food.count > 1) {
          this.food.count--;
        } else if (this.food.count === 1) {
          // this.$emit('clear', this.food.count); 传给goods，goods再用cart中的方法进行提示，不能直接传给cart，因为在父组件中更改count值后，需要降薪的值在传给cartCtrl子组件，实现变量的实时通信
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.control-wrapper
  font-size 0
  .dec, .add
    display inline-block
    // 加大点击区域范围
    padding 5px
    .icon-remove_circle_outline, .icon-add_circle
      font-size 24px
      color rgb(0,160,220)
      line-height 24px
  .count
    display inline-block
    vertical-align top
    padding-top 5px
    width 18px
    text-align center
    font-size 10px
    line-height 24px
    // 公共渐变样式
  .ground-enter-active, .ground-leave-active
    transition all .2s linear
    opacity 1
    transform translate3d(0,0,0) rotate(0deg)
  .ground-enter, .ground-leave-to
    opacity 0
    transform translate3d(24px,0,0) rotate(360deg)
  .count-enter-active, .count-leave-active
    transition all .2s linear
    opacity 1
    transform translate3d(0,0,0)
  .count-enter, .count-leave-to
    opacity 0
    transform translate3d(24px,0,0)
</style>
