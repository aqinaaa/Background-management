<template>
  <div>
    <el-button v-show="$store.state.user.buttons.indexOf('btn.btn1') != -1">添加按钮1</el-button>
    <el-button v-show="$store.state.user.buttons.indexOf('btn.btn2') != -1">添加按钮2</el-button>
  </div>
</template>

<script>
export default {

}
</script>

<style>
</style>