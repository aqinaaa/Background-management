<template>
  <a :title="title" style="margin:10px">
    <!-- v-bind="$attrs"监听属性?
  v-on="$listeners":监听事件?? -->
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  name: "HintButton",
  props: ['title']
}
</script>

<style>
</style>