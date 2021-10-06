<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="wrapper" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <!-- 属性：topImages 传入值：top-images -->
      <!-- <div>{{$store.state.cartList}}</div> -->
      <detail-swiper class="detail-swiper" :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommends" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>

    <toast message="hhhhhhh"/>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar.vue'
import DetailSwiper from './childComps/DetailSwiper.vue'
import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
import DetailShopInfo from './childComps/DetailShopInfo.vue'
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
import DetailParamInfo from './childComps/DetailParamInfo.vue'
import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
import DetailBottomBar from './childComps/DetailBottomBar.vue'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import Toast from 'components/common/toast/Toast'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
import {itemListenerMixin, backTopMixin} from 'common/mixin.js'
import {debounce} from 'common/utils'

import {mapActions} from 'vuex'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    Toast
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      // itemImgListener: null,
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0
    }
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // 1.获取顶部的图片轮播资源
      const data = res.result
      // console.log(data);
      this.topImages = res.result.itemInfo.topImages

      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      // 3.创建店铺信息
      this.shop = new Shop(data.shopInfo)

      // 4.保存商品的详情数据
      this.detailInfo = data.detailInfo

      // 5.获取参数的信息
      this.paramInfo = new GoodsParam (data.itemParams.info, data.itemParams.rule)

      // 6.获取评论信息
      if(data.rate.cRate) {
        this.commentInfo = data.rate.list[0]
      }

      // 错误，此时dom渲染完成但图片未加载好
      // this.$nextTick(() => {
      //   this.themeTopYs = []
      //   this.themeTopYs.push(0)
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
      //   this.themeTopYs.push(this.$refs.recommends.$el.offsetTop - 44)
      //   console.log(this.themeTopYs);
      // })
    })

    // 3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })

    // 4.给getThemeTopY赋值（防抖动）
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommends.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE)
      // console.log(this.themeTopYs);
    }, 200)
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    },
    contentScroll(position) {
      // 1.获取y值
      const positionY = -position.y
      this.isShowBackTop = (-position.y) > 1000

      // 2.和主题中的值进行对比
      let length = this.themeTopYs.length
      for(let i = 0; i < length - 1; i++) {
        // if((this.currentIndex !== i) && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
        //   this.currentIndex = i;
        //   // console.log(this.currentIndex);
        //   this.$refs.nav.currentIndex = this.currentIndex
        // }

        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
    },
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.newPrice;
      product.iid = this.iid;

      // 2.将商品添加到购物车
      // this.$store.cartList.push(product)
      // this.$store.commit('addCart', product)

      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res);
      // })

      // 使用mapActions映射后
      this.addCart(product).then(res => {
        console.log(res);
      })
    }
  },
  mounted() {
    // console.log('mounted');
  },
  destroyed() {
    // this.$bus.$off('detailItemImgLoad', this.itemImgListener)
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  updated() {
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .wrapper {
    /* height: calc(100% - 44px - 58px); */
    background-color: #fff;
    position: absolute;
    top: 44px;
    bottom: 58px;
    left: 0;
    right: 0;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>