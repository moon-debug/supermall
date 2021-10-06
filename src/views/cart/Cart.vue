<template>
  <div class="cart">
    <nav-bar>
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <cart-list/>

    <cart-bottom-bar/>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComps/CartList.vue'
import CartBottomBar from './childComps/CartBottomBar.vue'

import {mapGetters} from 'vuex'

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    // cartLength() {
    //   return this.$store.getters.cartLength
    // }

    // 两种语法，数组为一一对应，对象为改名
    // ...mapGetters(['cartLength', 'cartList'])
    ...mapGetters({
      length: 'cartLength'
    })
  }
}
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    font-weight: bold;
  }
</style>