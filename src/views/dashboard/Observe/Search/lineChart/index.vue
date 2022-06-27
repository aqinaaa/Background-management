<template>
  <div>
    <div class="header">
      <span class="search-header">搜索用户数</span>
      <svg t="1656222612553" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="2207" width="16" height="16">
        <path
          d="M512 958.016C266.08 958.016 65.984 757.952 65.984 512 65.984 266.08 266.08 65.984 512 65.984c245.952 0 446.016 200.064 446.016 446.016 0 245.952-200.064 446.016-446.016 446.016z m0-828.032c-210.656 0-382.016 171.36-382.016 382.016 0 210.624 171.36 382.016 382.016 382.016 210.624 0 382.016-171.36 382.016-382.016S722.624 129.984 512 129.984z"
          p-id="2208"></path>
        <path
          d="M464 304a1.5 1.5 0 1 0 96 0 1.5 1.5 0 1 0-96 0zM512 768c-17.664 0-32-14.304-32-32V448c0-17.664 14.336-32 32-32s32 14.336 32 32v288c0 17.696-14.336 32-32 32z"
          p-id="2209"></path>
      </svg>
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span class="main-content">17.1</span>
      <!-- 向上的箭头 -->
      <svg t="1656255734497" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="4265" width="16" height="16">
        <path
          d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z"
          p-id="4266" fill="#d81e06"></path>
      </svg>
      <!-- 向下的箭头 -->
      <svg t="1656255649122" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="3303" width="16" height="16">
        <path
          d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"
          p-id="3304" fill="#1afa29"></path>
      </svg>
    </div>
    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts';
export default {

  props: ['title'],
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
          type: 'line',
          data: [33, 60, 20, 88, 10, 23, 4],
          // 拐点的样式： opacity为0则不显示
          itemStyle: {
            opacity: 0
          },
          // 线条的样式
          lineStyle: {
            color: 'blue'
          },
          // 填充颜色设置
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'blue' // 0% 处的颜色
              }, {
                offset: 1, color: '#fff' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          // 设置曲线的平滑度
          smooth: true
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

<style scoped>
.box {
  height: 300px;
}

.header {
  display: flex;
  align-items: center;
  height: 100px;
}

.search-header {
  margin-right: 20px;
}

.main-title {
  margin-right: 30px;
}

.main-content {
  margin-right: 10px;
}

.charts {
  width: 100%;
  height: 70px;
  margin-bottom: 30px;
}
</style>