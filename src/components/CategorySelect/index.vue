<template>
  <div>
    <!--  :model="cForm"把结构中的数据绑定到对应的数据上；
    v-model="cForm.category3Id"是设置到el-select上面的属性 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select placeholder="请选择" value="" v-model="cForm.category1Id" @change="handler1" :disabled="!!show">
          <!-- :value来动态收集c1的id -->
          <el-option :label="c1.name" :value="c1.id" v-for="(c1, index) in list1" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类" value="">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="!!show">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2, index) in list2" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" value="" v-model="cForm.category3Id" @change="handler3" :disabled="!!show">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3, index) in list3" :key="index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ['show'],
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      // 收集表单数据
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  mounted() {
    // 组件挂载完毕后就发送一次数据请求
    this.getCategoryList()
  },
  methods: {
    // 获取一级分类列表的请求
    async getCategoryList() {
      //一级分类不需要携带参数
      let result = await this.$API.attr.reqCategory1List()
      // console.log(result)
      if (result.code == 200) {
        this.list1 = result.data
      }
    },
    async handler1() {
      // 解构出一级分类的id
      // 清空之前选择的数据信息
      this.list3 = []
      this.list2 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      const { category1Id } = this.cForm;
      this.$emit('getCategoryId', { categoryId: category1Id, level: 1 })
      // 通过一级分类的id,获取二级分类的数据
      let result = await this.$API.attr.reqCategory2List(category1Id);
      // console.log(result)
      if (result.code == 200) {
        // console.log(result.data)
        this.list2 = result.data
      }
    },
    async handler2() {
      // 二级分类如果修改清除三级分类下之前获取到的数据
      this.list3 = []
      this.cForm.category3Id = ''
      const { category2Id } = this.cForm;
      this.$emit('getCategoryId', { categoryId: category2Id, level: 2 })
      let result = await this.$API.attr.reqCategory3List(category2Id);
      // console.log(result)
      if (result.code == 200) {
        this.list3 = result.data
      }
    },
    async handler3() {
      // 三级分类触发事件
      const { category3Id } = this.cForm;
      this.$emit('getCategoryId', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

<style>
</style>