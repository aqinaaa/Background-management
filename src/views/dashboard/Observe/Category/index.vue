<template>
  <el-card>
    <div slot="header" class="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <!-- v-model="radio1" -->
        <el-radio-group v-model="value">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
      <!-- 饼图 -->
      <div>
        <div class="charts" ref="charts"></div>
      </div>
    </div>
  </el-card>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts';
export default {
  data() {
    return {
      value: '全部渠道'
    }
  },
  mounted() {
    // 初始化echarts实例
    let myCharts = echarts.init(this.$refs.charts);
    myCharts.setOption({
      title: {
        text: '视频',
        subtext: 1048,
        left: 'center',
        top: 'center',
      },
      tooltip: {
        trigger: 'item'
      },
      // legend: {
      //   top: '5%',
      //   left: 'center'
      // },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside'
          },
          // 鼠标放大效果
          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: '40',
          //     fontWeight: 'bold'
          //   }
          // },
          labelLine: {
            show: true
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    });
    //  绑定事件
    myCharts.on('mouseover', (params) => {
      // console.log(params);
      // 可以获取鼠标移上去的那条数据
      // 解构出想要的值
      const { name, value } = params.data
      myCharts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    });
  },

}

</script>

<style scoped>
.category-header {

  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;

}

.category-header {
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.radius {
  float: right;
}

.charts {
  width: 100%;
  height: 300px;
}
</style>