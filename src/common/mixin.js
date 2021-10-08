import {debounce} from 'common/utils.js'
import BackTop from 'components/content/backTop/BackTop'

export const itemListenerMixin = {
  data () {
    return {
      itemImgListener: null,
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 200)
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImgLoad', this.itemImgListener)
    // console.log('我是混入');
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },
  }
}


export const tabControlMixin = {
	data: function () {
		return {
			currentType: 'pop'
		}
	},
	methods: {
		tabClick(index) {
			switch(index) {
        case 0: this.currentType = 'pop';
        break;
        case 1: this.currentType = 'new';
        break;
        case 2: this.currentType = 'sell';
      }
			console.log(this.currentType);
		}
	}
}