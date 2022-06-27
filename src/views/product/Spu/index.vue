<template>
  <div>
    <el-card style="margin:20px 0">
      <!-- 上半部分 -->
      <!-- spu页面三级联动部分 -->
      <!-- CategorySelect是注册的全局组件,可以直接使用 -->
      <!--:show="show"是通过在本组件中向子组件传递show的逻辑值来控制子组件的可操作性-->
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 下半部分:将来有三部分进行切换-->
      <!-- addOrUpdateSpu -->
      <div v-show="scene == 0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <!-- 表单 -->
        <!-- :data="tableData" -->
        <el-table border style="width: 100%" :data="recodes">
          <el-table-column type="index" label="序号" width="100" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称">
          </el-table-column>
          <el-table-column prop="description" label="spu描述">
          </el-table-column>
          <el-table-column prop="address" label="操作" width="280">
            <template slot-scope="{row,$index}">
              <!-- 这里的按钮将来用hinButton替换:什么是hinButton??-->
              <HintButton type="primary" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)">
              </HintButton>
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)">
              </HintButton>
              <HintButton type="info" icon="el-icon-warning-outline" size="mini" title="查看当前spu全部sku列表"
                @click="handler(row)">
              </HintButton>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference">
                </HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block" align="center" style='margin: 10px 0;'>
          <!-- <span class="demonstration">直接前往</span> -->
          <!-- @size-change="handleSizeChange" @current-change="handleCurrentChange" -->
          <el-pagination :current-page="6" :page-size="3" :page-sizes="[3, 5, 10]"
            layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getSpuProduct"
            @size-change="handleSizeChange">
          </el-pagination>
        </div>
      </div>
      <!-- 为方便管理:另外两部分是拆分为两个组件 -->
      <spuForm ref="spu" v-show="scene == 1" @changeScene="changeScene"></spuForm>
      <skuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes"></skuForm>
      <!-- <div v-show="scene == 2">展示suk列表</div> -->
      <!-- 点击查看sku列表的对话框 -->
      <el-dialog :title="`${spu.spuName}`" :visible.sync="dialogTableVisible" :before-close="closeDialog">
        <!-- :data="gridData" -->
        <el-table :data="SkuList" border v-loading="loading">
          <el-table-column property="skuName" label="名称" width="150"></el-table-column>
          <el-table-column property="price" label="价格" width="200"></el-table-column>
          <el-table-column property="weight" label="重量"></el-table-column>
          <el-table-column label="默认图片">
            <template slot-scope="{row,$index}">
              <img :src="row.skuDefaultImg" style="width:100px;height:100px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import skuForm from "./SkuForm";
import spuForm from './SpuForm';
export default {
  name: 'Spu',
  components: {
    skuForm,
    spuForm
  },
  data() {
    return {
      // 分别是分类的id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      page: 1,
      limit: 3,
      recodes: [],
      total: 0,
      scene: 0,  //初始化一个 scene为,如果是0默认显示spu列表页面
      dialogTableVisible: false,
      spu: {},
      SkuList: [],
      loading: true
    }
  },
  methods: {
    // 三级联动的自定义事件,可以把子组件的相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      //  categoryId:获取到一,二,三级分类的id  level:为了区分是几级id
      if (level == 1) {
        this.category1Id = categoryId;
        // 清除2,3,级分类的id
        this.category2Id = '';
        this.category3Id = '';
      } else if (level == 2) {
        this.category2Id = categoryId;
        // 清除3级分类的Id
        this.category3Id = '';
      } else {
        this.category3Id = categoryId;
        this.getSpuProduct()
      }
    },
    // 获取spu商品信息的函数
    // pages = 1:默认页码切换的函数的当前页是1,如果点击了则修改page并发送请求
    async getSpuProduct(pages = 1) {
      // console.log(this.$API)
      this.page = pages
      const { page, limit, category3Id } = this
      let result = await this.$API.spu.reqSpuProduct(page, limit, category3Id);
      // console.log(result)
      if (result.code == 200) {
        this.recodes = result.data.records,
          this.total = result.data.total
      }
    },
    // 修改当前显示多少条数据
    handleSizeChange(limit) {
      // console.log(limit)
      this.limit = limit
      this.getSpuProduct()
    },
    // 添加spu回调
    addSpu() {
      this.scene = 1
      this.$refs.spu.addSpuData(this.category3Id);
    },
    updateSpu(row) {
      this.scene = 1
      // 获取子组件的spuForm子组件的方法并调动
      this.$refs.spu.initSpuData(row);
    },
    // 切换场景
    changeScene({ scene, flag }) {
      // console.log(scene)
      this.scene = scene;
      // 子组件通知父组件切换场景，需要再次获取spu列表的数据进行展示
      if (flag == '修改') {
        this.getSpuList(this.page);
        // 如果是修改则回到当前页面
      } else {
        // 如果是添加则默认回到第一页,调用页面更新页码函数，不传入参数则是第一页
        this.getSpuProduct()
      }
    },
    // 删除spu
    async deleteSpu(row) {
      // alert(row.id)
      // console.log(row)
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '删除成功' });
        // 删除成功后保留到当前页面，如果当前页数据少于1条，则应该回到上一页
        this.getSpuProduct(this.recodes.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加sku按钮的回调
    addSku(row) {
      // alert(123)
      // 切换到添加sku的页面展示中
      this.scene = 2;
      // 点击添加sku的时候调动子组件中的方式获取数据:把子组件需要的参数传递过去
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // sku页面的回调切换场景
    changeScenes() {
      // 清除之前输入的数据
      Object.assign(this._data, this.$options.data());
      // 切换场景
      this.scene = 0
    },
    // 查看当前spu的sku列表
    async handler(row) {
      // row就是spu
      // console.log(row)
      this.spu = row
      this.dialogTableVisible = true
      // 获取sku列表的数据进行展示
      let result = await this.$API.sku.reqSkuList(row.id)
      // console.log(result)
      if (result.code == 200) {
        this.SkuList = result.data
        // 数据加载成功之后关闭当前的loading
        this.loading = false
      }

    },
    // 关闭dialog前的回调
    closeDialog(down) {
      // 负责loading加载的属性再次变为真
      this.loading = true;
      //清除sku列表的数据
      this.SkuList = [];
      down()
    }
  }
}
</script>

<style>
</style>