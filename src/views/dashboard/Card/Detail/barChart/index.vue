<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts';
export default {
  name: "",
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      // x轴
      xAxis: {
        // 隐藏x轴
        show: false,
        // 让显示折现的
        type: 'category',
        boundaryGap: false
      },
      // y轴
      yAxis: {
        // 隐藏y轴
        show: false,
      },
      // 系列
      series: [
        {
          // 图表形式：柱状图
          type: 'bar',
          data: [10, 7, 33, 88, 9, 23, 44, 33, 65, 120],
          // 设置曲线的平滑度
          // smooth: true
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {
      }
    })
  }
}
</script>

<style>
/* 设置容器的宽高 */
.charts {
  width: 100%;
  height: 100%;
}
</style>