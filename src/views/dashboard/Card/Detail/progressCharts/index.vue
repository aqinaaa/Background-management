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
        // x轴设置了最小值和最大值，数据不会占满整个容器
        min: 0,
        max: 100

      },
      // y轴
      yAxis: {
        // 隐藏y轴
        show: false,
        // 让显示折现的:均分
        type: 'category',
      },
      // 系列
      series: [
        {
          type: 'bar',
          data: [60],
          color: 'yellowgreen',
          barWidth: '20px',
          // 设置了true才会生效
          showBackground: 'true',
          // 设置背景颜色
          backgroundStyle: {
            color: '#eee'
          },
          // 文本标签
          label: {
            show: true,
            // 改变文本内容
            formatter: '|',
            // 文本标签位置调试
            position: 'right',
            color: 'red'
          },

        }
      ],

      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
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