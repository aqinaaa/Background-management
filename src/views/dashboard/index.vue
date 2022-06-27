<template>
  <div class="dashboard-container">
    <card></card>
    <Sale></Sale>
    <Observe></Observe>
  </div>
</template>

<script>
import card from './Card'
import Sale from './Sale'
import Observe from './Observe'
export default {
  name: 'Dashboard',
  data() {
    return {
      list: {}
    }
  },
  components: {
    card,
    Sale,
    Observe
  },
  computed: {

  },
  mounted() {
    // 派发仓库的action请求函数
    this.$store.dispatch('getData');
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
