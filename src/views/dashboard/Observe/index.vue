<template>
  <div>
    <el-row :gutter="30" class='linerow'>
      <el-col :span="12">
        <Search></Search>
      </el-col>
      <el-col :span="12">
        <Category></Category>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Category from './Category'
import Search from './Search'
export default {
  components: {
    Category,
    Search
  }
}
</script>

<style>
.linerow {
  display: flex;
  justify-content: space-between;
}
</style>