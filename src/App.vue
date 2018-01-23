<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link tag="a" to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link tag="a" to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link tag="a" to="/seller">商家</router-link>
      </div>
    </div>
    <div>
      <keep-alive>
        <router-view :seller="seller" ></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Header from './components/header/header';
//  import {urlParse} from './common/js/util';

  const ERR_OK = 0;
  export default {
    // name: 'app',
    data () {
      return {
        // 实际项目中，每个商家都会有唯一的id标识，而这个标识也是url网址的一部分，所以，这里我们模拟一个获取商家id的场景，并付给url的id，
        // 例如：192.163.1.102?id=123456&word=aaa#/seller
        // 所以我们将原本的seller：{}改为以下的样式，添加一个立即执行函数
        seller: {
          id: 12345// this._reat()
        }
      };
    },
    components: {
      'v-header': Header
    },
    created () {
      const _this = this;
      _this.$http.get('/api/seller?id=' + _this.seller.id).then(response => {
        response = response.body; // response.json()返回的是一个promise类型，我们要的是一个对象类型,去resource的git里查看docs里的http
        if (response.errno === ERR_OK) {
          _this.seller = response.data;
          // 用这个方法可以给seller添加其他属性，不会覆盖id
          _this.seller = Object.assign({}, _this.seller, response.data);
        }
      });
    }
//    methods: {
//      _reat () {
//        let queryParam = this.urlParse();
//        return queryParam.id;
//      }
//    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "./common/stylus/mixin"
  #app
    .tab
      display:flex
      width: 100%
      height: 40px
      line-height :40px
      border-1px(rgba(7,17,27,.1))
      .tab-item
        flex:1
        text-align: center
        & > a
          display block
          font-size: 14px
          color: rgb(77,85,93)
          &.router-link-active
            color: rgb(240,20,20)
</style>
