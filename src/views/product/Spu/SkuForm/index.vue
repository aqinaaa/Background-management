<template>
  <div>
    <!-- label-width="80px:可以固定label的宽度，否则100%会导致输入框断行展示 -->
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <!-- v-model="skuInfo.skuName" -->
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr, index) in AttrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item :label="SaleAttr.saleAttrName" v-for="(SaleAttr, index) in SpuSaleAttrList" :key="SaleAttr.id">
            <el-select placeholder="请选择" v-model="SaleAttr.attrIdAndValueId">
              <el-option :label="SaleAttrValue.saleAttrValueName" :value="`${SaleAttr.id}:${SaleAttrValue.id}`"
                v-for="(SaleAttrValue, index) in SaleAttr.spuSaleAttrValueList" :key="SaleAttrValue.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border style="width: 100%" :data="SpuImageList" @selection-change="handleSelectionChange">
          <el-table-column prop="prop" type="selection" label="label" width="70">
          </el-table-column>
          <el-table-column prop="name" label="图片">
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width:80px;height:80px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称">
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{row,$index}">
              <el-button type="primary" v-if="row.isDefault == 0" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'skuForm',
  data() {
    return {
      SpuImageList: [],
      SpuSaleAttrList: [],
      AttrInfoList: [],
      spu: [],
      // 收集sku数据的字段
      skuInfo: {
        // 第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类：双向绑定的收集的数据
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",

        // 第三类：自己需要写代码的
        // 默认图片
        skuDefaultImg: "",
        //  收集图片
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   spuImgId: 0
          //   skuId: 0,
          //   
          // }
        ],
        //  平台属性
        skuAttrValueList: [
          {
            // 只收集平台属性的id和平台属性值的id
            attrId: 0,
            valueId: 0,
          }
        ],
        // 销售属性
        skuSaleAttrValueList: [
          {
            id: 0,
            saleAttrId: 0,
            saleAttrName: "string",
            saleAttrValueId: 0,
            saleAttrValueName: "string",
            skuId: 0,
            spuId: 0
          }
        ],

      },
      // 收集选中的图片字段:但是需要注意，收集的数据目前缺少isDefault字段，将来提交服务器数据的时候，需要增加这个字段
      imageList: [],

    }
  },
  methods: {
    cancle() {
      // alert(111)
      this.$emit('changeScene', 0)
      // 保存成功后清空数据
      Object.assign(this._data, this.$options.data())
    },
    // 页面跳转过来之后发起数据请求函数
    async getData(category1Id, category2Id, spu) {
      // console.log('获取数据')
      // console.log(spu)
      this.spu = spu

      // 获取SpuImageList图片列表
      let result = await this.$API.sku.reqSpuImageList(spu.id)
      if (result.code == 200) {
        let list = result.data;
        list.forEach(item => {
          item.isDefault = 0;
        })
        this.SpuImageList = list;
      }
      // 获取销售属性的数据
      let result1 = await this.$API.sku.reqSpuSaleAttrList(spu.id)
      // console.log(result1)
      if (result1.code == 200) {
        this.SpuSaleAttrList = result1.data
      }
      // 获取平台属性的数据
      // console.log(category1Id, category2Id, spu.category3Id)
      let result2 = await this.$API.sku.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      console.log(result2)
      if (result2.code == 200) {
        this.AttrInfoList = result2.data
      }
      // 收集父组件传递过来的数据给到skuInfo
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.tmId = spu.tmId
      this.skuInfo.spuId = spu.id
    },
    // table表格复选框按钮的事件
    handleSelectionChange(p) {
      // 获取到用户选中图片的信息数据，但是需要注意，当前收集的数据当中，缺少isDefault字段
      // console.log(p)
      this.imageList = p;
    },
    // 点击设置默认排他操作
    changeDefault(row) {
      // 图片列表的数据的isDefault字段变为0
      this.SpuImageList.forEach(item => {
        item.isDefault = 0;
      });
      // 点击的那个图片的数据变为1
      row.isDefault = 1;
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 保存按钮的回调
    async save() {

      // 整理参数
      // 整理平台属性:方式1
      // 解构出对象
      //   const { AttrInfoList, skuInfo } = this;
      //   // 新建数组
      //   let arr = [];
      //   AttrInfoList.forEach(item => {
      //     // 当前平台属性用户进行选择
      //     if (item.attrIdAndValueId) {
      //       const [attrId, valueId] = item.attrIdAndValueId.split(":")
      //       // 携带给服务器的参数应该是对象
      //       let obj = { valueId, attrId };
      //       arr.push(obj);
      //     }
      //   })
      //   // 将整理好的参数赋值给skuInfo.skuAttrValueList
      //   skuInfo.skuAttrValueList = arr;
      // 整理平台属性方法2：
      const { AttrInfoList, skuInfo, SpuSaleAttrList, imageList } = this;
      skuInfo.skuAttrValueList = AttrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":")
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = SpuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      // 整理图片的数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // 发请求
      // console.log(this.$API)
      let result = await this.$API.sku.reqSaveSku(skuInfo);
      if (result.code == 200) {
        this.$message({ type: 'success', message: '添加sku成功' })
        this.$emit('changeScenes', 0);
      }
      // 保存成功后清空数据
      Object.assign(this._data, this.$options.data())

    }
  }
}
</script>

<style>
</style>