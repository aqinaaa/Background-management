<template>
  <div>
    <!-- el:按钮 -->
    <el-button type="primary" style="margin:10px 0px;" icon="el-icon-plus" @click="showDialog">添加</el-button>
    <!-- el:表格组件:el-table -->
    <div>
      <el-table border style="width: 100%;" :data="list">
        <!-- el-table-column表示单元格的列数 -->
        /**
        label是列标签名称
        添加border:显示边框
        width:列的宽度
        align:标题的对齐方式
        :data="list":表示表格绑定的数据数组，注意是写在el-table当中，不是写在column中
        type="index"：可以设置列显示序号
        作用域插槽：slot-scope="{row,$index}
        */
        <el-table-column type="index" label="序号" width="180">
        </el-table-column>
        <el-table-column prop="tmName" label="品牌名称">
        </el-table-column>
        <el-table-column label="品牌LOGO">
          <template slot-scope="{row,$index}">
            <img :src="row.logoUrl" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="changeDialog(row)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器
     @current-change="" 
     layout=""
     ->：能设置让左边的去最左边，注意是sizes而不是size；
     current-page：是当前页；
     total：代表分页器总共展示数据条数
     page-size:代表的是每一页需要展示多少条数据
     page-sizes:代表可以设置每一页展示多少条数据
     layout：可以实现分页器布局
     pager-count：按钮的数据
      -->
      <el-pagination :total="99" :current-page="6" :page-size="3" :page-sizes="[3, 5, 10]"
        style="margin-top:20px;text-align: center" @current-change="getPageList" @size-change="handleSizeChange"
        layout="prev, pager, next, jumper,->,sizes, total">
      </el-pagination>
    </div>
    <!-- 对话框 -->
    <!-- visible.sync:控制对话框的显示与隐藏 
    form组件提供了表单验证的功能，只需要通过rules属性传入的约定的验证规则，并将form-item 的prop属性设置未需校验的字段名即可-->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="centerDialogVisible" width="30%" center>
      <!-- form表单 -->
      <!--form表单 model:这个属性的作用是，把表单的数据收集到那个对象的身上，将来表单验证，也需要这个属性 -->
      <el-form style="width:80%" :model="tmForm" :rules="rules" ref="formName">
        <!-- 品牌名称 -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <!-- 上传图片 -->
        <!--  :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" -->
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 这里收集数据：不能使用v-model,因为不是表单元素
           action：设置图片上传的地址 -->
          <!-- 注意：这里的action地址需要加上.env.development的baseUrl-->
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-button @click="centerDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addOrUpdataTradeMark">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'tradeMark',
  data() {
    // 自定义校验规则函数
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('品牌名称2-10位'));
      } else {
        callback();
      }
    };
    return {
      //初始化 ：代表分页器第几页
      page: 1,
      //初始化： 当前页数展示数据条数
      limit: 3,
      total: 0,
      list: [],
      centerDialogVisible: false,
      tmForm: {
        tmName: '',
        logoUrl: '',
      },
      rules: {
        // 表单验证规则
        // required:必须要校验字段（前面五角星有关系） message提示信息 trigger:用户行为设置：blur/change
        tmName: [
          { required: true, message: '请输入活动品牌', trigger: 'blur' },
          // 自定义校验规则
          { validator: validateTmName, trigger: 'change' },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        // 品牌的Logo验证规则
        logoUrl: [
          { required: true, message: '请选择品牌lOGO', trigger: 'change' }
        ],
      }

    }

  },
  mounted() {
    // 页面加载后调用一次品牌列表请求数据
    console.log(this.$API)
    this.getPageList();
  },
  methods: {
    // 获取品牌列表数据的函数
    async getPageList(pager = 1) {
      // 解构参数
      this.page = pager
      const { page, limit } = this;
      // 调取获取品牌列表的接口
      // 当你向服务器发请求的时候，这个函数需要带参数，因此在data当中初始化两个字段
      let result = await this.$API.trademark.reqTradeMarkList(page, limit)
      // console.log(result)
      if (result.code == 200) {
        this.total = result.data.total,
          this.list = result.data.records
      }
    },
    // 修改分页器显示条数函数
    handleSizeChange(limit) {
      // console.log(limit)
      this.limit = limit
      this.getPageList()
    },
    // 添加品牌按钮
    showDialog() {
      this.centerDialogVisible = true;
      // 清空历史输入记录
      this.tmForm = { tmName: '', logoUrl: '' };
    },
    // 修改品牌
    changeDialog(row) {
      this.centerDialogVisible = true;
      // console.log(row)
      // 默认展示修改的品牌信息，让其中的tmForm等于修改的品牌的信息
      //  { ...row }写法是表示es6深拷贝的写法，如果只写row ，会成为双向绑定，无论修改成功与否都修改。
      this.tmForm = { ...row }
    },
    // 上传图片相关的回调
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      // res:上传图片成功之后返回前端数据
      // console.log(res)
      this.tmForm.logoUrl = res.data
    },
    // 上传图片失败
    beforeAvatarUpload(file) {
      // 判断图片的格式和大小并显示提醒信息
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 添加按钮（添加品牌|修改品牌）
    addOrUpdataTradeMark() {

      this.$refs.formName.validate(async (success) => {
        if (success) {
          // 表单校验：校验成功-----执行以下业务逻辑
          // 隐藏对话框
          this.centerDialogVisible = false
          // 发请求添加|修改数据
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm);
          if (result.code == 200) {
            // 弹出信息：添加品牌成功，修改品牌成功
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            });
            // 添加或者修改品牌成功，需要再次获取列表进展示
            // 如果添加品牌，停留在第一页，修改品牌应该留在当前页
            // this.tmForm.id ? this.page : 1  传入参数如果是修改数据留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    deleteTradeMark(row) {
      // 弹窗
      this.$confirm(`你确定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 当用户点击确定按钮的时候会触发
        let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
        console.log(result)
        // 如果删除成功
        if (result.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 再次获取品牌列表数据
          // 如果当前页的商品数量只有一条，则应该删除后进入上一页，如果大于1，则保留在当前页
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
        }
      }).catch(() => {
        // 当用户点击取消按钮的时候会触发
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }

}

</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>