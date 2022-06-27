<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <!-- :data="tableData"
      :disabled="!category3Id":设置没有category3Id的时候添加属性不可用 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性
        </el-button>
        <el-table border style="width: 100%" :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="180">
          </el-table-column>
          <!-- slot-scope="{row,$index}"作用域插槽的写法 -->
          <el-table-column prop="prop" label="属性值列表">
            <template slot-scope="{row,$index}">
              <el-tag type="success" v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id"
                style="margin:0 10px">{{
                    attrValue.valueName
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" width="180px" label="操作">
            <template slot-scope="{row,$index}">
              <!-- 修改 -->
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="UpdateAttr(row)"></el-button>
              <!-- 删除 -->
              <!-- pop气泡删除确认框 -->
              <el-popconfirm :title="`确定删除${row}}吗？`">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的解构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" style="margin:10px -25px 0px">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>

          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值
        </el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <!-- 表单 -->
        <el-table border style="width: 100%; margin:20px 0" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="100" align="center">
          </el-table-column>
          <el-table-column prop="name" label="属性值名称">
            <!-- 作用域插槽 -->
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="toLook(row)"
                @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
              <span v-else @click="toEdit(row, $index)" style="display:block">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{row,$index}">
              <!-- pop删除弹窗 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click='AddOrUpdatedAttr' :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
      isShowTable: true,
      attrInfo: {
        "attrName": "",             //属性名称
        "attrValueList": [                //属性值
          // {初始值应该为空
          //   "attrId": 0,                  //属性id
          //   "valueName": ""         //属性值
          // }
        ],
        "categoryId": this.category3Id,                  // categoryId3ID
        "categoryLevel": 0,               //3
        "id": 0
      },
      // 注意，因为对象data内部，属性是无序的，因此不能从内部收集内部的数据，比如：this.category3Id
      flag: true,
      visible: false,
    }
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      // console.log(categoryId)
      if (level == 1) {
        this.category1Id = categoryId
        // 触发事件之后，除了保存数据，还应清除之前category2Id和category3Id传递保存的id数据
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        this.getAttrList();
      }
    },
    // 获取平台属性的数据
    async getAttrList() {
      // console.log('发请求')
      // 解构
      const { category1Id, category2Id, category3Id } = this
      let result = await this.$API.attr.reqAttrInfoList(category1Id, category2Id, category3Id)
      // console.log(result)
      if (result.code == 200) {
        this.attrList = result.data
      }
    },
    // 添加属性值
    addAttrValue() {
      // alert(123) 测试
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,    //对于修改某一个属性的时候,可以在已有的属性值基础之上新增新的属性值(新增的属性值是带有id的)
        valueName: '',
        flag: true,
        // flag属性:给每一个属性值添加一个标记flag,用户切换查看模式与编辑模式,好处:每一个属性值可以控制自己的模式切换
        // 当前flag属性,响应式数据(数据变化视图跟着变化)

      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      })
    },
    // 添加属性
    addAttr() {
      // 隐藏table表格
      this.isShowTable = false
      // 清空历史保存的属性值
      this.attrInfo = {
        attrName: "",             //属性名称
        attrValueList: [                //属性值

        ],
        categoryId: this.category3Id,
        categoryLevel: 3,
      }
    },
    // 修改某一个属性
    UpdateAttr(row) {
      // 点击修改以后第一件事先切换table显示
      // alert(123) 测试
      this.isShowTable = false
      // 将要修改的row传递给attrInfo进行展示
      // console.log(row)
      // 深拷贝
      this.attrInfo = cloneDeep(row)
      // this.attrInfo = row
      this.attrInfo.attrValueList.forEach(item => {
        // 这样书写也可以给属性值添加flag自动,但是会发现视图不会跟着变化(因为flag不是响应式数据)
        // 因为vue无法探测普通新增的proprty,这样书写的属性并非响应式属性(数据变化视图)
        this.$set(item, 'flag', false)
      })

    },
    toLook(row) {
      //row添加的属性值
      // console.log(row)
      // 如果属性值为空不能作为新的属性值,需要给用户提示,让他输入一个其他的属性值
      if (row.valueName.trim() == '') {
        this.$message('请你输入一个有效的属性值')
        return
      }
      // 新增的属性值不能与已有的属性值重复
      let isRepat = this.attrInfo.attrValueList.some(item => {
        // 需要将row从数组里面判断的时候去除
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      })
      // 让编辑模式变为查看模式[让input消失,显示span]
      row.flag = false
    },
    // 编辑按钮
    toEdit(row, index) {
      // 切换显示模式为input输入模式
      row.flag = true
      // 获取input节点,实现自动聚焦
      // 需要注意:点击span的时候,切换为input变为编辑模式,但是需要注意,对于浏览器而言,页面重绘与重拍耗时间的,因为不能立即获取到input
      // console.log(this.$refs[index]);
      this.$nextTick(() => {
        this.$refs[index].focus();
      })
    },
    // 点击弹窗删除//气泡确认框确定按钮的回调
    // 最新版本的element------2.15.6,目前模板中的版本好是2.13.x,删除确认按钮采用的是onConfirm,而不是confirm
    deleteAttrValue(index) {
      // alert(123)
      // 当前删除属性值的操作是不需要发请求的
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 点击保存按钮后发送数据请求
    async AddOrUpdatedAttr() {
      // alert(111) 测试
      console.log(this.$API)
      // 首先整理参数:1如果用户提娜佳很多属性值,且属性值为空的不应该提交给服务器
      // 提交给服务器数据当汇总不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        // 过滤掉属性值不为空的
        if (item.valueName != '') {
          // 删掉flag属性
          delete item.flag;
          return true;
        }
      })
      try {
        // 发请求
        await this.$API.attr.reqAddOrUpdatedAttr(this.attrInfo);
        this.$message({ type: 'success', message: '保存成功' });
        // 保存成功之后应该页面显示到之前未编辑状态
        this.isShowTable = true
        // 刷新重新展示页面
        this.getAttrList()
      } catch (error) {
        this.$message('保存失败')
      }
      // let result = await this.$API.attr.reqAddOrUpdatedAttr(this.attrInfo)
      // console.log(result)

    }
  }
}

</script>

<style>
</style>