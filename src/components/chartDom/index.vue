<template>
  <div :id="id" class="echart-box" :style="'height: ' + height + 'px;background: #fff;'" />
</template>
<script type="text/javascript">
import * as echarts from 'echarts'
import { v4 as uuid } from 'uuid'
export default {
  props: {
    option: {
      type: Object,
      default: function() {
        return {}
      }
    },
    height: {
      type: Number,
      default: 350
    }
  },
  data() {
    return {
      chart: null,
      id: ''
    }
  },
  watch: {
    option: {
      handler(val) {
        if (val) {
          this.initChart()
        }
      },
      deep: true
    }
  },
  created() {
    this.id = uuid()
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })

    window.addEventListener('resize', this.handleResize)

  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    initChart() {
      const chartDom = document.getElementById(this.id)
      this.chart = echarts.init(chartDom)
      this.chart.clear()
      this.chart.setOption(this.option)
    },
    handleResize() {
      this.chart && this.chart.resize()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
