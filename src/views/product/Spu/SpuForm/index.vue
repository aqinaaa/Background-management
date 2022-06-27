<template>
  <div>
    {{ unSelectSaleAttr }}
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="(tm, index) in TMResult.data" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" v-model="spu.description">
        <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片:action图片上传的地址  list-type:文件列表的类型  on-oreview:图片预览的时候会发出来  on-remove:当删除图片的时候会触发-->
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card"
          :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="spuImage"
          :on-success="handlerSuccess" v-model="spuImage">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrId">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`"
            v-for="(unselect, index) in unSelectSaleAttr" :key="unselect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrId" @click="addSaleAttr">添加销售属性
        </el-button>
      </el-form-item>
      <el-form-item>
        <!-- 表单 -->
        <template>
          <!-- :data="tableData" -->
          <el-table border style="width: 100%" :data="spu.spuSaleAttrList">
            <el-table-column type="index" label="序号" width="100" align="center">
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名" width="180">
            </el-table-column>
            <el-table-column prop="spuSaleAttrValueList.saleAttrValueName" label="属性值名称列表">
              <!-- 插槽 
               @close="handleClose(tag)"-->
              <template slot-scope="{row, $index}">
                <el-tag :key="tag.id" v-for="(tag, index) in row.spuSaleAttrValueList" closable
                  :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">
                  {{ tag.saleAttrValueName }}</el-tag>
                <!--  @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" -->
                <el-input v-if="row.inputVisible" class="input-new-tag" v-model="row.inputValue" ref="saveTagInput"
                  size="small" @blur="handleInputConfirm(row)" @close="handleClose(tag)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" width="180">
              <template slot-scope="{row,$index}">
                <el-button type="danger" icon="el-icon-delete" size="mini"
                  @click="spu.spuSaleAttrList.splice($index, 1)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="AddOrUpdateSpu">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
export default {
  name: "spuForm",
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // spu属性初始化的时候是一个空的对象,在修改spu的时候,会向服务器发请求,返回spu信息(对象),在修改的时候可以利用服务器返回的则会个对象收集最新的数据提交给服务器
      // 添加spu,如果添加spu的时候并没有向服务器发请求,数据收集到哪里[spu],收集数据的时候有哪些字段,看接口文档初始化字段.
      spu: {
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: "",
        // spu的名称
        spuName: "",
        // 收集SPU图片的信息
        spuImageList: [
          // {
          //   "id": 0,
          //   "imgName": "string",
          //   "imgUrl": "string",
          //   "spuId": 0
          // }
        ],
        // 品牌的id
        tmId: "",
        // 平台属性与属性值的收集
        spuSaleAttrList: [
          // {
          //   "baseSaleAttrId": 0,
          //   "id": 0,
          //   "saleAttrName": "string",
          //   "spuId": 0,
          //   "spuSaleAttrValueList": [
          //     {
          //       "baseSaleAttrId": 0,
          //       "id": 0,
          //       "isChecked": "string",
          //       "saleAttrName": "string",
          //       "saleAttrValueName": "string",
          //       "spuId": 0
          //     }
          //   ]
          // }
        ],

      },
      TMResult: [],
      spuImage: [],
      BaseSaleAttr: [],
      attrId: '',//收集未选择的销售属性的id

    };
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      // 整个平台的销售属性一共三个: 尺寸, 颜色, 版本----BaseSaleAttr
      // 当前spu拥有的属于自己的销售属性spu.spuSaleAttrList-- - 颜色
      // 数组的过滤方法, 可以从已有的数组当中过滤出用户需要的元素, 并且返回一个新的数据
      let result = this.BaseSaleAttr.filter(item => {
        // every数组的方法,会返回一个布尔值,[真,假的]
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name != item1.saleAttrName;
        })
      })
      return result
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 初始化spuForm数据
    async initSpuData(spu) {
      // console.log(this.$API)
      // 获取spu数据
      let spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code == 200) {
        this.spu = spuResult.data
      }
      // 获取品牌数据
      let TMResult = await this.$API.spu.reqTradeMarkList()
      // console.log(TMResult)
      if (TMResult.code == 200) {
        this.TMResult = TMResult
      }
      // 获取spu图表的接口
      let spuImage = await this.$API.spu.reqSpuImageList(spu.id)
      // console.log(spuImage)
      if (spuImage.code == 200) {
        // 由于照片墙显示图片的数据需要数组,数组里面的元素需要有name和url字段
        // 需要把服务器返回的数据进行修改
        let listArr = spuImage.data;
        listArr.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        })
        // 把整理好的数据赋值给
        this.spuImage = listArr
      }
      // 获取平台全部销售属性
      let BaseSaleAttr = await this.$API.spu.reqBaseSaleAttrList()
      // console.log(BaseSaleAttr)
      if (BaseSaleAttr.code == 200) {
        this.BaseSaleAttr = BaseSaleAttr.data
      }
    },
    // 照片墙预览的回调
    handlePictureCardPreview(file) {
      // 将图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      // 对话框显示
      this.dialogVisible = true;
      // console.log(123)
    },
    // 照片墙删除的回调
    handleRemove(file, fileList) {
      console.log(file, fileList);
      // file参数:代表的是删除的那张图片
      // fileList:照片墙删除某一张图片以后,剩余的其他图片
      // 将删除之后剩余的其他照片墙图片保存到data中
      this.spuImage = fileList;
      console.log(this.spuImage)
      console.log(fileList)
      console.log('已删除图片')
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      console.log(response, file, fileList)    //可以一起打印查看
      this.spuImage = fileList;
      console.log('已上传图片')
    },
    // 添加销售属性的回调函数
    addSaleAttr() {
      // alert(123)
      // 已经收集需要添加的销售属性的信息
      // 把收集到的销售属性数据进行分割
      // ----添加
      const [baseSaleAttrId, saleAttrName] = this.attrId.split(':');
      // 向spu对象的spuSaleAttrList属性里面添加新的销售属性
      let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] };
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
      // ----清空数据
      this.attrId = ''
    },
    // 点击销售属性值里面的添加
    addSaleAttrValue(row) {
      // console.log(row)
      // 点击销售属性值当中添加按钮的时候，需要有button变为input, 通过当前销售属性的inputVisible控制
      // 挂载在销售属性身上的响应式数据inputVisible,控制button与input切换
      this.$set(row, 'inputVisible', true);
      // 通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row, 'inputValue', '');
    },
    // input失去焦点的回调事件
    handleInputConfirm(row) {
      // input变为button
      // console.log(row)
      // 解构出销售属性当中收集数据
      const { baseSaleAttrId, inputValue } = row;
      // 属性值为空则不执行
      if (inputValue.trim() == '') {
        this.$message('属性值不能为空')
        return;
      }
      // 属性值不能重复
      let result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != inputValue)
      if (!result) return;
      // 新增的销售属性值
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false;
    },
    // 保存
    async AddOrUpdateSpu() {
      // alert('123')
      // 整理携带给服务器的参数：对于图片，需要携带imgName和imgUrl字段
      this.spu.spuImageList = this.spuImage.map(item => {
        return {
          imgName: item.name,
          // 新增的图片没有imgUrl，但是有response，存放在response.data里面
          imgUrl: (item.response && item.response.data) || item.url,
        }
      });
      // 发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      console.log(result);
      // 页面切换到spu列表中:通知父组件回到场景0
      this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' });
      this.$message('保存成功')
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加Spu按钮的时候，发请求的函数
    async addSpuData(category3Id) {
      // console.log('添加')
      // 收集category3Id
      this.spu.category3Id = category3Id;
      // 获取品牌数据
      let TMResult = await this.$API.spu.reqTradeMarkList()
      console.log(TMResult)
      if (TMResult.code == 200) {
        this.TMResult = TMResult
      }
      // 获取平台全部销售属性
      let BaseSaleAttr = await this.$API.spu.reqBaseSaleAttrList()
      console.log(BaseSaleAttr)
      if (BaseSaleAttr.code == 200) {
        this.BaseSaleAttr = BaseSaleAttr.data
      }
    },
    // 取消按钮
    cancle() {
      // 取消按钮的回调，通知父亲切换场景为0
      this.$emit('changeScenes', { scene: 0, flag: '' })
      // 清理数据
      // Object.assign:es6中新增的方法可以合并对象
      // 组件实例this._data，可以操作data当中响应式数据
      // this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data())
    }
  }
}


</script>
<style>
.el-tag+.el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>