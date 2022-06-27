<template>
  <div>
    <!-- 表格 -->
    <el-table border style="width: 100%;margin-top:20px" :data="records">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述">
      </el-table-column>
      <el-table-column prop="address" label="默认图片">
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg" style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)">
      </el-table-column>
      <el-table-column prop="price" width="80" label="价格(元)">
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="success" icon="el-icon-sort-up" size="mini" v-if="row.isSale == 0" @click="onSale(row)">
          </el-button>
          <el-button type="success" icon="el-icon-sort-down" size="mini" v-else @click="onCancle(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 -->
    <!-- @size-change="handleSizeChange" @current-change="handleCurrentChange" -->
    <el-pagination :current-page="page" :page-size="limit" :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper,->,sizes,total" :total="total" align="center" style="margin-top:20px"
      @current-change="getSkuList" @size-change="handleSizeChange">
    </el-pagination>
    <!-- 抽屉 -->
    <!-- :direction="direction":配置打开的方向，默认是从右向左，这里可以不需要；:before-close="handleClose" -->
    <el-drawer :visible.sync="drawer" size="50%" :show-close="false">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ getSkuById.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ getSkuById.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ getSkuById.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success" v-for="(attr, index) in getSkuById.skuAttrValueList" :key="attr.id"
              style="margin-right: 10px;">
              {{ attr.attrId }}-{{ attr.valueId }}
            </el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in getSkuById.skuImageList" :key="item.id">
              <img :src="item.imgUrl">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1,
      limit: 10,
      records: [],  //存储sku列表的数据
      total: 0,//存储分页器一共展示的数据
      currentbutton: 0,
      getSkuById: {},
      drawer: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    // 获取sku列表的数据
    async getSkuList(pages = 1) {
      // 解构数据
      this.page = pages
      const { page, limit } = this
      let result = await this.$API.sku.reqSkuLists(page, limit)
      // console.log(result)
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    // 切换上架下架的按钮显示与隐藏
    async onSale(row) {
      // 上架操作
      // console.log(row)
      let result = await this.$API.sku.reqonSale(row.id)
      // console.log(result)
      if (result.code == 200) {
        row.isSale = 1
        this.$message({ type: 'success', message: '上架成功' })
      }
    },
    async onCancle(row) {
      // 下架操作
      let result = await this.$API.sku.reqcancelSale(row.id)
      // console.log(result)
      if (result.code == 200) {
        row.isSale = 0
        this.$message({ type: 'success', message: '下架成功' })
      }
    },
    // 编辑按钮回调
    edit() {
      this.$message('正在开发中')
    },
    // sku详情页查看按钮回调
    async getSkuInfo(sku) {
      // 发请求，请求数据
      let result = await this.$API.sku.reqSkuById(sku.id)
      if (result.code == 200) {
        this.getSkuById = result.data
      }
      this.drawer = true
    }
  }
}
</script>

<style>
.el-row .el-col-5 {
  /* color: brown */
  font-size: 18px;
  text-align: right;
}

.el-col {
  margin: 10px 10px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>