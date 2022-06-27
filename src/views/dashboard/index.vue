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
  components: {
    card,
    Sale,
    Observe
  },
  computed: {


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
