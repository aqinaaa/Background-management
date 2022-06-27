<template>
  <div>
    <el-card>
      <div slot="header">
        <div class="header">
          <span>线上热门搜索</span>
          <el-dropdown><span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </div>
        <!-- 折现图部分 -->
        <div>
          <el-row :gutter="5" class="linerow">
            <el-col :span="12">
              <lineChart></lineChart>
            </el-col>
            <el-col :span="12">
              <lineChart></lineChart>
            </el-col>
          </el-row>
        </div>
        <!-- tabel表格 -->
        <!-- :default-sort="{ prop: 'date', order: 'descending' }" -->
        <el-table class="table" :data="tableData" style="width: 100%" border>
          <el-table-column label="排名" width="180">
          </el-table-column>
          <el-table-column label="搜索关键字" width="180">
          </el-table-column>
          <el-table-column label="用户数" sortable>
          </el-table-column>
          <el-table-column label="周涨幅" sortable>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination layout="prev, pager, next" :total="1000" class="pagination">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import lineChart from './lineChart'
export default {
  data() {
    return {
      tableData: [{}]
    }
  },
  components: {
    lineChart
  },

}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}


.el-card__header {
  border-bottom: 1px solid #eee
}

.table {
  margin-top: 10px;
}

.pagination {
  float: right;
  margin-top: 10px
}

.linerow {
  display: flex;
  justify-content: center;
}
</style>