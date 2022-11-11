<template>
  <div class="system-user-container">
    <div class="flex-row gap-3">
      <el-col :xs="24" :sm="12" :md="8" class="marg-b-15">
        <el-card class="box-card-meter">
          <div class="el-table--enable-row-hover el-table--medium">
            <el-row :gutter="30">
              <el-col :xs="24" :sm="24" :md="12">
                <table cellspacing="0" style="width: 100%">
                  <tbody>
                    <tr>
                      <td>
                        <div class="cell-card">CPU数: </div>
                      </td>
                      <td>
                        <div class="cell-card">{{ sysInfo.cpuNum }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cell-card">核心数: </div>
                      </td>
                      <td>
                        <div class="cell-card">{{ sysInfo.cpuCores }}</div>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div class="cell-card">使用率:</div>
                      </td>
                      <td>
                        <div class="cell-card">{{ sysInfo.cpuUsed }}%</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cell-card">LA5:</div>
                      </td>
                      <td>
                        <div class="cell-card">{{ sysInfo.cpuAvg5 }}%</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cell-card">LA15:</div>
                      </td>
                      <td>
                        <div class="cell-card">{{ sysInfo.cpuAvg15 }}%</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12">
                <div style="min-height: 180px" ref="chartsWarningRef1"></div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" class="marg-b-15">
        <el-card class="box-card-meter">
          <div class="el-table--enable-row-hover el-table--medium">
            <el-row :gutter="30">
              <el-col :xs="24" :sm="24" :md="12">
                <table cellspacing="0" style="width: 100%">
                  <tbody>
                    <tr>
                      <td>
                        <div class="cell-card">内存总数:</div>
                      </td>
                      <td>
                        <div class="cell-card">{{ memorySizeFormat(sysInfo.memTotal) }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cell-card">已使用:</div>
                      </td>
                      <td>
                        <div class="cell-card">{{ memorySizeFormat(sysInfo.memUsed) }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cell-card">剩余:</div>
                      </td>
                      <td>
                        <div class="cell-card">{{ memorySizeFormat(sysInfo.memFree) }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cell-card">系统使用:</div>
                      </td>
                      <td>
                        <div class="cell-card">{{ memorySizeFormat(sysInfo.goUsed) }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cell-card">使用率:</div>
                      </td>
                      <td>
                        <div class="cell-card">{{ sysInfo.memUsage }}%</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12">
                <div style="min-height: 180px" ref="chartsWarningRef2"></div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" class="marg-b-15">
        <el-card class="box-card-meter">
          <div class="el-table--enable-row-hover el-table--medium">
            <el-row :gutter="30">
              <el-col :xs="24" :sm="24" :md="12">
                <table cellspacing="0" style="width: 100%">
                  <tbody>
                    <tr>
                      <td>
                        <div class="cell-card">磁盘容量:</div>
                      </td>
                      <td>
                        <div class="cell-card">{{ memorySizeFormat(sysInfo.diskTotal) }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cell-card">已使用:</div>
                      </td>
                      <td>
                        <div class="cell-card">{{ memorySizeFormat(sysInfo.diskUsed) }}</div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="cell-card">使用率:</div>
                      </td>
                      <td>
                        <div class="cell-card">{{ sysInfo.diskUsedPercent }}%</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12">
                <div style="min-height: 180px" ref="chartsWarningRef3"></div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </div>
    <!-- <div class="flex-row gap-3">
      <el-col :xs="24" :sm="12" :md="12" class="marg-b-15">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>运行资源</span>
            </div>
          </template>
          <div class="el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td>
                    <div class="cell">操作系统:</div>
                  </td>
                  <td>
                    <div class="cell">{{ sysInfo.sysOsName }}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">系统架构:</div>
                  </td>
                  <td>
                    <div class="cell">{{ sysInfo.sysOsArch }}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">服务器名称:</div>
                  </td>
                  <td>
                    <div class="cell">{{ sysInfo.sysComputerName }}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">服务器IP:</div>
                  </td>
                  <td>
                    <div class="cell">{{ sysInfo.sysComputerIp }}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">Go语言版本</div>
                  </td>
                  <td>
                    <div class="cell">{{ sysInfo.goVersion }}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">启动时间</div>
                  </td>
                  <td>
                    <div class="cell">{{ sysInfo.goStartTime }}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="cell">运行时长:</div>
                  </td>
                  <td>
                    <div class="cell">{{ timeFormat(sysInfo.goRunTime) }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" class="marg-b-15">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>硬盘资源</span>
            </div>
          </template>
          <div class="el-table--enable-row-hover el-table--medium" style="height: 280px; overflow: auto">
            <table cellspacing="0" style="width: 100%">
              <tbody>
                <tr>
                  <td>
                    <div class="cell">盘符路径</div>
                  </td>
                  <td>
                    <div class="cell">文件系统</div>
                  </td>
                  <td>
                    <div class="cell">总大小</div>
                  </td>
                  <td>
                    <div class="cell">可用大小</div>
                  </td>
                  <td>
                    <div class="cell">已用大小</div>
                  </td>
                  <td>
                    <div class="cell">已用百分比</div>
                  </td>
                </tr>
                <tr v-for="(sysFile, index) in sysInfo.diskList" :key="index">
                  <td>
                    <div class="cell">{{ sysFile.path }}</div>
                  </td>
                  <td>
                    <div class="cell">{{ sysFile.fstype }}</div>
                  </td>
                  <td>
                    <div class="cell">{{ memorySizeFormat(sysFile.total) }}</div>
                  </td>
                  <td>
                    <div class="cell">{{ memorySizeFormat(sysFile.free) }}</div>
                  </td>
                  <td>
                    <div class="cell">{{ memorySizeFormat(sysFile.used) }}</div>
                  </td>
                  <td>
                    <div class="cell">{{ sysFile.usedPercent }}%</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
    </div> -->
    <div class="flex-row gap-3">
      <el-col :xs="24" :sm="12" :md="8" class="marg-b-15">
        <el-card class="box-card-height" style="height:auto">
          <template #header>
            <div class="card-header">
              <span>CPU运行情况</span>
            </div>
          </template>
          <div style="height: 250px" ref="chartsWarningRef4"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" class="marg-b-15">
        <el-card class="box-card-height" style="height:auto">
          <template #header>
            <div class="card-header">
              <span>内存运行情况</span>
            </div>
          </template>
          <div style="height: 250px" ref="chartsWarningRef5"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" class="marg-b-15">
        <el-card class="box-card-height" style="height:auto">
          <template #header>
            <div class="card-header">
              <span>磁盘使用情况</span>
            </div>
          </template>
          <div style="height: 250px" ref="chartsWarningRef6"></div>
        </el-card>
      </el-col>
    </div>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, getCurrentInstance, defineComponent } from 'vue';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import dayjs from 'dayjs';
import getOrigin from '/@/utils/origin'
let interval: any = null;
export default defineComponent({
  name: 'monitor',
  components: {},
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const state: any = reactive({
      myCharts: [],
      sysInfo: {},
    });

    let myChart1: any;
    let myChart2: any;
    let myChart3: any;
    let myChart4: any;
    let myChart5: any;
    let myChart6: any;

    const myChart4Data: any = {
      name: [],
      value: [],
    }
    const myChart5Data: any = {
      name: [],
      value: [],
    }
    const myChart6Data: any = {
      name: [],
      value: [],
    }

    const moveOption = {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        top: 10,
        bottom: 20,
        left: 10,
        right: 10,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: '使用率',
          type: 'line',
          showSymbol: false,
          data: []
        }
      ]
    };

    function setOptChart1(value: number) {
      myChart1.setOption({
        series: [
          {
            data: [
              {
                value: value,
                name: '',//cpu
              },
            ],
          },
        ],
      });
    }
    function setOptChart2(value: number) {
      myChart2.setOption({
        series: [
          {
            data: [
              {
                value: value,
                name: '',//内存
              },
            ],
          },
        ],
      });
    }
    function setOptChart3(value: number) {
      myChart3.setOption({
        series: [
          {
            data: [
              {
                value: value,
                name: '',//磁盘
              },
            ],
          },
        ],
      });
    }
    function setOptChart(myChart: any, myChartData: any, value: number) {
      myChartData.name.push(dayjs().format('HH:mm:ss'));
      myChartData.value.push(value);
      myChart.setOption({
        xAxis: {
          data: myChartData.name
        },
        series: [
          {
            data: myChartData.value
          },
        ],
      });
    }

    //CPU
    const initChartCPU = () => {
      myChart1 = echarts.init(proxy.$refs.chartsWarningRef1);
      const option = {
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%',
        },
        series: [
          {
            type: 'gauge',
            name: 'CPU',
            radius: '90%', //修改表盘大小
            title: {
              show: true, //控制表盘title(今日预计用电量)字体是否显示
              fontSize: 12, //控制表盘title(今日预计用电量)字体大小
              'color': 'green',           		//控制表盘title(今日预计用电量)字体颜色
              offsetCenter: [-2, '30%'], //设置表盘title(今日预计用电量)位置
            },
            axisLine: {
              show: true,
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [
                  [0.3, '#4dabf7'],
                  [0.6, '#69db7c'],
                  [0.8, '#ffa94d'],
                  [1, '#ff6b6b'],
                ],
              },
            },
            splitNumber: 5, //分割线之间的刻度

            detail: {
              valueAnimation: true,
              formatter: '{value}%',
              textStyle: {
                fontSize: 20,
                color: 'red',
              },
              offsetCenter: ['0', '80%'], //表盘数据(30%)位置
            },
            // data: [
            // 	{
            // 		value: 15,
            // 		name: 'CPU使用率',
            // 	},
            // ],
          },
        ],
      };
      myChart1.setOption(option);
      state.myCharts.push(myChart1);
    };
    //内存
    const initChartRAM = () => {
      myChart2 = echarts.init(proxy.$refs.chartsWarningRef2);
      const option = {
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%',
        },
        series: [
          {
            type: 'gauge',
            name: '内存',
            radius: '90%', //修改表盘大小
            title: {
              show: true, //控制表盘title(今日预计用电量)字体是否显示
              fontSize: 12, //控制表盘title(今日预计用电量)字体大小
              'color': 'green',           		//控制表盘title(今日预计用电量)字体颜色
              offsetCenter: [-2, '30%'], //设置表盘title(今日预计用电量)位置
            },
            axisLine: {
              show: true,
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [
                  [0.3, '#4dabf7'],
                  [0.6, '#69db7c'],
                  [0.8, '#ffa94d'],
                  [1, '#ff6b6b'],
                ],
              },
            },
            splitNumber: 5, //分割线之间的刻度

            detail: {
              valueAnimation: true,
              formatter: '{value}%',
              textStyle: {
                fontSize: 20,
                color: 'red',
              },
              offsetCenter: ['0', '80%'], //表盘数据(30%)位置
            },
            // data: [
            // 	{
            // 		value: 30,
            // 		name: '内存使用率',
            // 	},
            // ],
          },
        ],
      };
      myChart2.setOption(option);
      state.myCharts.push(myChart2);
    };
    //磁盘
    const initChartDISK = () => {
      myChart3 = echarts.init(proxy.$refs.chartsWarningRef3);
      const option = {
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%',
        },
        series: [
          {
            type: 'gauge',
            name: '磁盘',
            radius: '90%', //修改表盘大小
            title: {
              show: true, //控制表盘title(今日预计用电量)字体是否显示
              fontSize: 12, //控制表盘title(今日预计用电量)字体大小
              'color': 'green',           		//控制表盘title(今日预计用电量)字体颜色
              offsetCenter: [-2, '30%'], //设置表盘title(今日预计用电量)位置
            },
            axisLine: {
              show: true,
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [
                  [0.3, '#4dabf7'],
                  [0.6, '#69db7c'],
                  [0.8, '#ffa94d'],
                  [1, '#ff6b6b'],
                ],
              },
            },
            splitNumber: 5, //分割线之间的刻度

            detail: {
              valueAnimation: true,
              formatter: '{value}%',
              textStyle: {
                fontSize: 20,
                color: 'red',
              },
              offsetCenter: ['0', '80%'], //表盘数据(30%)位置
            },
            // data: [
            // 	{
            // 		value: 30,
            // 		name: '内存使用率',
            // 	},
            // ],
          },
        ],
      };
      myChart3.setOption(option);
      state.myCharts.push(myChart3);
    };

    //cpu运行状态
    const initChartCPURun = () => {
      myChart4 = echarts.init(proxy.$refs.chartsWarningRef4);
      myChart4.setOption({ ...moveOption });
      state.myCharts.push(myChart4);
    };

    //内存运行状态
    const initChartRAMRun = () => {
      myChart5 = echarts.init(proxy.$refs.chartsWarningRef5);
      myChart5.setOption({ ...moveOption });
      state.myCharts.push(myChart5);
    };

    //磁盘运行状态
    const initChartDISKRun = () => {
      myChart6 = echarts.init(proxy.$refs.chartsWarningRef6);
      myChart6.setOption({ ...moveOption });
      state.myCharts.push(myChart6);
    };

    // 页面加载时
    onMounted(() => {
      initChartCPU();
      initChartRAM();
      initChartDISK();
      initChartCPURun();
      initChartRAMRun();
      initChartDISKRun();
    });

    function startWs() {
      // ws = null;
      // ws = new WebSocket(import.meta.env.VITE_WS_URL + '/monitorServer/ws');
      // ws.onopen = () => {};
      // ws.onmessage = ({ data: dataStr }) => {
      // 	const data = JSON.parse(dataStr);
      // 	state.sysInfo = data;
      // 	setOptChart1(data.cpuUsed);
      // 	setOptChart2(data.memUsage);
      //   setOptChart3(data.diskUsedPercent);
      // };

      const es = new EventSource(getOrigin(import.meta.env.VITE_SERVER_URL + "/subscribe/sysenv"));

      es.addEventListener("host", displayHost);
      es.addEventListener("mem", displayMem);
      es.addEventListener("cpu", displayCpu);
      es.addEventListener("sysLoad", displaySysLoad);
      es.addEventListener("disk", displayDisk);
    }

    startWs();

    function displayHost(event: { data: any; }) {
      const data = JSON.parse(event.data);
      state.sysInfo.sysOsName = data.os
      state.sysInfo.sysOsArch = data.kernelArch
      state.sysInfo.sysComputerName = data.hostname
      state.sysInfo.goStartTime = data.bootTime
      state.sysInfo.goRunTime = data.uptime
    }

    function displayMem(event: { data: any; }) {
      const data = JSON.parse(event.data);
      setOptChart2(data.usedPercent.toFixed(2));
      state.sysInfo.memTotal = data.total
      state.sysInfo.memUsed = data.used
      state.sysInfo.memFree = data.free
      state.sysInfo.goUsed = data.goUsed
      state.sysInfo.memUsage = data.usedPercent.toFixed(2)
      // console.log(state.sysInfo.memUsage)
      setOptChart(myChart5, myChart5Data, state.sysInfo.memUsage);

    }

    function displayCpu(event: { data: any; }) {
      const data = JSON.parse(event.data);
      state.sysInfo.cpuNum = data.Number
      state.sysInfo.cpuCores = data.Cores
      state.sysInfo.cpuUsed = data.UsedPercent[0].toFixed(2)
      setOptChart1(data.UsedPercent[0].toFixed(2));
      setOptChart(myChart4, myChart4Data, state.sysInfo.cpuUsed);
    };

    function displaySysLoad(event: { data: any; }) {
      const data = JSON.parse(event.data)
      state.sysInfo.cpuAvg5 = data.load5.toFixed(2)
      state.sysInfo.cpuAvg15 = data.load15.toFixed(2)

    };

    function displayDisk(event: { data: any; }) {
      const data = JSON.parse(event.data)
      state.sysInfo.diskTotal = data.total
      state.sysInfo.diskUsed = data.used
      state.sysInfo.diskUsedPercent = data.usedPercent.toFixed(2)
      setOptChart3(data.usedPercent.toFixed(2));
      setOptChart(myChart6, myChart6Data, state.sysInfo.diskUsedPercent);

    };


    // function getSystemInfo() {
    // 	api.getSysInfo().then((res: any) => {
    // 		state.sysInfo = res;
    // 		setOptChart1(res.cpuUsed);
    // 		setOptChart2(res.memUsage);
    //     setOptChart3(res.diskUsedPercent);
    //
    //   });
    // }

    return {
      ...toRefs(state),
      // getSystemInfo,
      setOptChart1,
      setOptChart2,
      setOptChart3,

      // ws,
    };
  },
  created() {
    // this.getSystemInfo();
    // if (interval === null) {
    // 	interval = setInterval(() => {
    // 		this.getSystemInfo();
    // 	}, 5000);
    // }
  },
  unmounted() {
    // if (this.ws) {
    // 	(this.ws as WebSocket).close();
    // }
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  },
  data() {
    return {};
  },
  methods: {
    memorySizeFormat(size: any) {
      size = parseFloat(size);
      let rank = 0;
      let rankchar = 'Bytes';
      while (size > 1024 && rankchar != 'TB') {
        size = size / 1024;
        rank++;
        if (rank == 1) {
          rankchar = 'KB';
        } else if (rank == 2) {
          rankchar = 'MB';
        } else if (rank == 3) {
          rankchar = 'GB';
        } else if (rank == 4) {
          rankchar = 'TB';
        }
      }
      return size.toFixed(2) + ' ' + rankchar;
    },
    timeFormat(second: any) {
      second = parseFloat(second);
      let rank = 0;
      let rankchar = '秒';
      while ((second > 60 && rankchar != '小时' && rankchar != '天') || (second > 24 && rankchar == '小时')) {
        if (rankchar == '小时') {
          second = second / 24;
        } else {
          second = second / 60;
        }
        rank++;
        if (rank == 1) {
          rankchar = '分';
        } else if (rank == 2) {
          rankchar = '小时';
        } else if (rank == 3) {
          rankchar = '天';
        }
      }
      return second.toFixed(2) + ' ' + rankchar;
    },
  },
});

</script>

<style scoped lang="scss">
.el-card {
	height: 300px;
	overflow-y: auto;
}

.marg-b-15 {
	margin-bottom: 15px;
}

.cell {
	box-sizing: border-box;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: normal;
	word-break: break-all;
	line-height: 36px;
	padding-left: 10px;
	padding-right: 10px;
}

.cell-card {
	box-sizing: border-box;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: normal;
	word-break: break-all;
	line-height: 36px;
}

.box-card {
	min-height: 380px;
}

.box-card-meter {
	height: 230px;

	min-height: 180px;
}
</style>
