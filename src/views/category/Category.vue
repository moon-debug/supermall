<template>
  <div id="category">
    <nav-bar class="category-nav"><div slot="center">商品分类</div></nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @selectItem="selectItem"/>

      <scroll id="tab-content" ref="scroll" :data="[categoryData]"
              :probe-type="3" @scroll="contentScroll">
        <div>
          <tab-content-category :subcategories="showSubCategory"/>
          <tab-control :titles="['综合', '新品', '销量']"
                       @itemClick="tabClick"/>
          <goods-list :goods="showCategoryDetail"/>
        </div>
      </scroll>
      <back-top @click.native="backClick" v-show="isShowBackTop"/>
    </div>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar.vue'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll.vue'

import TabMenu from './childComps/TabMenu.vue'
import TabContentCategory from './childComps/TabContentCategory.vue'

import {getCategory, getSubCategory, getCategoryDetail} from 'network/category'
import {tabControlMixin, backTopMixin} from 'common/mixin'

export default {
  name: "Category",
  components: {
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    TabMenu,
    TabContentCategory,
    GoodsList,
    Scroll
  },
  mixins: [tabControlMixin, backTopMixin],
  data() {
    return {
      categories: [],
      categoryData: {},
      currentIndex: -1,
    }
  },
  computed: {
    showSubCategory() {
      if(this.currentIndex == -1) return {}
      return this.categoryData[this.currentIndex].subcategories
    },

    showCategoryDetail() {
      if(this.currentIndex == -1) return []
      return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
    }
  },
  created() {
    this._getCategory()

    this.$bus.$on('imgLoad', () => {
      this.$refs.scroll.refresh()
    })
  },
  // updated() {
  //   this.$refs.scroll.refresh()
  // },
  methods: {
    _getCategory() {
      getCategory().then(res => {
        this.categories = res.data.category.list
        // console.log(res);

        for(let i in this.categories) {
          
          this.categoryData[i] = {
            subcategories: {},
            categoryDetail: {
              'pop': [],
              'new': [],
              'sell': []
            }
          }
        }

        this._getSubCategory(0)
      })
    },
    _getSubCategory(index) {
      this.currentIndex = index;
      const maitKey = this.categories[index].maitKey;
      getSubCategory(maitKey).then(res => {
        this.categoryData[index].subcategories = res.data;
        this.categoryData = {...this.categoryData}
        this._getCategoryDetail('pop')
        this._getCategoryDetail('sell')
        this._getCategoryDetail('new')
      })
    },
    _getCategoryDetail(type) {
      const miniWallkey = this.categories[this.currentIndex].miniWallkey
      
      getCategoryDetail(miniWallkey, type).then(res => {
        this.categoryData[this.currentIndex].categoryDetail[type] = res
        this.categoryData = {...this.categoryData}
      }) 
    },

    selectItem(index) {
      this._getSubCategory(index)
    },

    contentScroll(position) {
      const positionY = -position.y
      this.isShowBackTop = (-position.y) > 1000
    },
  }
}
</script>

<style scoped>
  #category {
    height: 100vh;
  }

  .category-nav {
    background-color: var(--color-tint);
    color: #fff;
    font-weight: 700;
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;

    display: flex;
    overflow: hidden;
  }

  #tab-content {
    height: 100%;
    flex: 1;
  }
</style>