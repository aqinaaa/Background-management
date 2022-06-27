<template>
  <div>
    <el-card class="box-card" style="margin:10px 0;">
      <!-- v-model="activeName" @tab-click="handleClick" -->
      <div slot="header" class="clearfix">
        <!-- 头部右侧区域 -->
        <el-tabs class="left" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visite"></el-tab-pane>
        </el-tabs>
        <!-- 头部左侧区域 -->
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWekend">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <!-- v-model="value1" -->
          <el-date-picker class="data" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"
            :default-time="['12:00:00']" size="mini" v-model="data" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="16">
            <!-- 准备图表的容器 -->
            <div class="echarts" ref="charts">
            </div>
          </el-col>
          <el-col :span="6">
            <h3>门店{{ title }}排名</h3>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span class="li-center">肯德基</span>
                <span class="li-right">123456</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span class="li-center">肯德基</span>
                <span class="li-right">123456</span>
              </li>
              <li>
                <span class="rindex">3</span>
                <span class="li-center">肯德基</span>
                <span class="li-right">123456</span>
              </li>
              <li>
                <span class="rindex">4</span>
                <span class="li-center">肯德基</span>
                <span class="li-right">123456</span>
              </li>
              <li>
                <span class="rindex">5</span>
                <span class="li-center">肯德基</span>
                <span class="li-right">123456</span>
              </li>
              <li>
                <span class="rindex">6</span>
                <span class="li-center">肯德基</span>
                <span class="li-right">123456</span>
              </li>
              <li>
                <span class="rindex">7</span>
                <span class="li-center">肯德基</span>
                <span class="li-right">123456</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>

    </el-card>
  </div>
</template>

<script>
// 引入echarts
import * as echarts from 'echarts';
// 下载后需要引入
import dayjs from 'dayjs'
export default {
  data() {
    return {
      activeName: 'sale',
      mycharts: null,
      data: []
    }
  },
  mounted() {
    // 初始化echarts实例
    this.mycharts = echarts.init(this.$refs.charts)
    // 配置数据
    this.mycharts.setOption({
      title: {
        text: "销售额趋势",

      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220, 400, 320, 60, 60, 21],
          color: '#7cc70a'
        }
      ]
    })
  },
  computed: {
    // 计算属性-标题
    title() {
      return this.activeName == 'sale' ? '销售额' : '访问量'
    }
  },
  methods: {
    // 本日
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.data = [day, day]
    },
    // 本周
    setWekend() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.data = [start, end]
    },
    // 本月
    setMonth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.data = [start, end];
    },
    // 本年
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.data = [start, end];
    }
  },
  watch: {
    title() {
      // 建通title的变化重新修改图表的配置数据
      this.mycharts.setOption({
        // 只重新配置标题
        title: {
          text: this.title

        }
      })

    }
  }
}
</script>

<style scoped>
.el-card__header {
  border-bottom: 0px solid #eee
}

.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.left {
  width: 100%
}

.right {
  position: absolute;
  right: 0;
}

.data {
  width: 100px;
  margin-left: 10px;
}

.el-date-editor--datetimerange.el-input__inner {
  width: 300px;
}

.right span {
  margin: 0 10px
}

ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}

ul li {
  height: 8%;
  margin: 10px 0;
}
</style>
<style scoped>
.echarts {
  height: 300px;
}

.rindex {
  float: left;
  width: 20px;
  height: 20px;
  background-color: black;
  color: #fff;
  border-radius: 10px;
  margin: 0 5px;
  text-align: center;
}

.li-right {
  float: right;
}

.li-center {
  padding: 0 10px;
}
</style>