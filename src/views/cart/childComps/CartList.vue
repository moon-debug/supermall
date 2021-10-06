<template>
  <div class="cart-list">
    <scroll class="wrapper" ref="scroll">
      <cart-list-item v-for="(item, index) in cartList" :key="index"
                      :item-info="item"/>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import CartListItem from './CartListItem.vue'

import { mapGetters } from 'vuex'

export default {
  name: "CartList",
  components: {
    Scroll,
    CartListItem
  },
  computed: {
    ...mapGetters(['cartList'])
  },
  activated() {
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
  .cart-list {
    height: calc(100vh - 44px - 40px);
  }

  .wrapper {
    height: calc(100%  - 58px);
    overflow: hidden;
  }
</style>