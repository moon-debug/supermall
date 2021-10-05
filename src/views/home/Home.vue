<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control" v-show="isTabFixed"/>   
    <!-- <scroll class="wrapper" ref="scroll" :probe-type="3"> -->
    <scroll class="wrapper" ref="scroll" 
            :probe-type="3" @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <!-- <home-swiper :banners="banners"/> -->
      <home-swiper :banners="banners" @swiperImgLoad="swiperImgLoad"/>
      <home-recommend-view :recommends="recommends"/>
      <!-- <feature-view @featureLoad="featureLoad"/> -->
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import HomeRecommendView from './childComps/HomeRecommendView.vue'
import FeatureView from './childComps/FeatureView.vue'

import NavBar from 'components/common/navbar/NavBar.vue'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll.vue'

import { getHomeMultidata, getHomeGoods } from 'network/home.js'
import { itemListenerMixin, backTopMixin } from 'common/mixin.js'

export default {
  name: "Home",
  components: {
    HomeSwiper,
    HomeRecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      currentType: 'pop',
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    }
  },
  mixins: [itemListenerMixin, backTopMixin],
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata()

    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  activated() {
    // console.log('activated');
    this.$refs.scroll.scrollTo(0, this.saveY)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // console.log('deactivated');
    // 1.保存y值
    this.saveY = this.$refs.scroll.getScrollY()
    // console.log(this.saveY);

    // 2.取消全局事件的监听
    // this.$bus.$off('homeItemImgLoad', this.itemImgListener)
    // this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  mounted() {
    // console.log('home');
  },
  methods: {
    // 事件监听相关
    tabClick(index) {
      switch(index) {
        case 0: this.currentType = 'pop';
        break;
        case 1: this.currentType = 'new';
        break;
        case 2: this.currentType = 'sell';
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    
    contentScroll(position) {
      // console.log(position);
      // 1.backTop是否出现
      // this.isShowBackTop = -position.y > 1000 ? true : false
      this.isShowBackTop = (-position.y) > 1000
      // 2.tabControl是否吸顶
      this.isTabFixed = (-position.y) > this.tabOffsetTop ? true : false
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImgLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    // featureLoad() {
    //   this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    // },

    // 网络请求相关
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        // console.log('----------');
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        this.$refs.scroll.finishPullUp();
      })
    }
  }
}
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: white;

    /* 使用浏览器原生滚动时需要使用fixed固定 */
    /* position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999; */
  }

  .wrapper {
    /* height: calc(100vh - 93px);
    overflow: hidden; */
    /* margin-top: 44px; */

    
    height: calc(100vh - 93px);
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    background-color: white;
    z-index: 9;
  }
</style>