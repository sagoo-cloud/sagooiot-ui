<template>
  <div class="" v-loading="loading">
    <el-row :gutter="15">
      <el-col :xs="24" :sm="12" :md="8" class="mb-4">
        <el-card shadow="nover" class="box-card-meter">
          <el-row :gutter="20">
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
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" class="mb-4">
        <el-card shadow="nover" class="box-card-meter">
          <el-row :gutter="20">
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
                      <div class="cell-card">{{ memorySizeFormat(sysInfo.available) }}</div>
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
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" class="mb-4">
        <el-card shadow="nover" class="box-card-meter">
          <el-row :gutter="20">
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
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :xs="24" :sm="12" :md="8" class="mb-4">
        <el-card shadow="nover" class="box-card-height" style="height:auto">
          <template #header>
            <div class="card-header">
              <span>CPU运行情况</span>
            </div>
          </template>
          <div style="height: 250px" ref="chartsWarningRef4"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" class="mb-4">
        <el-card shadow="nover" class="box-card-height" style="height:auto">
          <template #header>
            <div class="card-header">
              <span>内存运行情况</span>
            </div>
          </template>
          <div style="height: 250px" ref="chartsWarningRef5"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="8" class="mb-4">
        <el-card shadow="nover" class="box-card-height" style="height:auto">
          <template #header>
            <div class="card-header">
              <span>磁盘使用情况</span>
            </div>
          </template>
          <div style="height: 250px" ref="chartsWarningRef6"></div>
        </el-card>
      </el-col>
    </el-row>
    <div class="flex-row gap-2">
      <el-col :xs="24" :sm="24" :md="24">
        <el-card shadow="nover" class="box-card-height" style="height:auto">
          <template #header>
            <div class="card-header">
              <span>运行环境信息</span>
            </div>
          </template>
          <div class="flex-row">
            <el-form label-position="right" label-width="100px" class="flex1" style="max-width: 460px">
              <el-form-item label="操作系统">{{ hostData.os }}</el-form-item>
              <el-form-item label="启动时间">{{ goInfoData.startTime }}</el-form-item>
              <el-form-item label="运行时长">{{ timeFormat(goInfoData.runTime) }}</el-form-item>
              <el-form-item label="运行内存">{{ goInfoData.goMem }}</el-form-item>
            </el-form>
            <el-form label-position="right" label-width="100px" class="flex1" style="max-width: 460px">
              <el-form-item label="系统架构">{{ goInfoData.arch }}</el-form-item>
              <el-form-item label="语言环境">{{ goInfoData.goName }}</el-form-item>
              <el-form-item label="磁盘占用">{{ goInfoData.goSize }}</el-form-item>
              <el-form-item label="项目地址">{{ goInfoData.pwd }}</el-form-item>
            </el-form>
            <el-form label-position="right" label-width="100px" class="flex1" style="max-width: 460px">
              <el-form-item label="架构版本">{{ hostData.kernelArch }}</el-form-item>
              <el-form-item label="GO 版本">{{ goInfoData.goVersion }}</el-form-item>
              <el-form-item label="协程数量">{{ goInfoData.goroutine }}</el-form-item>
              <el-form-item label="服务器IP">{{ hostData.intranet_ip }} (内) &nbsp;&nbsp;&nbsp; {{ hostData.public_ip }} (公) </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, getCurrentInstance, defineComponent } from 'vue';
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
      sysInfo: {},
    });

    const loading = ref(true)

    let myChart1: any;
    let myChart2: any;
    let myChart3: any;
    let myChart4: any;
    let myChart5: any;
    let myChart6: any;
    const hostData = reactive({
      "bootTime": "2022-11-24T11:12:13+08:00",
      "hostId": "8be74718-1a53-4208-be22-9c126d891ddd",
      "hostname": "iZ2zee04uvnkmhvglw9oghZ",
      "intranet_ip": "172.17.47.62",
      "kernelArch": "x86_64",
      "kernelVersion": "3.10.0-1127.19.1.el7.x86_64",
      "os": "linux",
      "platform": "centos",
      "platformFamily": "rhel",
      "platformVersion": "7.7.1908",
      "procs": 138,
      "public_ip": "101.200.198.249",
      "uptime": 6393278,
      "virtualizationRole": "guest",
      "virtualizationSystem": ""
    });
    const goInfoData = reactive({
      "goOs": "-", "arch": "-", "goVersion": "-", "goMem": "-", "goName": "-", "goSize": "-", "goroutine": '-', "pwd": "-", "rootPath": "-",
      "runTime": '', "startTime": "-", "intranet_ip": "-"
    });

    function goInfo(event: { data: any; }) {
      const data = JSON.parse(event.data);
      Object.assign(goInfoData, data);
      loading.value = false
    }

    function hostInfo(event: { data: any; }) {
      const data = JSON.parse(event.data);
      Object.assign(hostData, data);
      loading.value = false
    }

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
        top: 5,
        bottom: 5,
        left: 5,
        right: 30,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        axisLabel: {
          formatter: '{value}%'
        },
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: '使用率',
          type: 'line',
          showSymbol: false,
          data: [],
          smooth: true,
          lineStyle: {
            width: 0
          },
          areaStyle: {}
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
      if (myChartData.name.length > 20) {
        myChartData.name.shift()
        myChartData.value.shift()
      }
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
              lineStyle: {
                show: true,
                with: 25,
                // 属性lineStyle控制线条样式
                color: [
                  [0.3, '#4dabf7'],
                  [0.6, '#69db7c'],
                  [0.8, '#ffa94d'],
                  [1, '#ff6b6b'],
                ],
              },
            },
            axisTick: {
              distance: 0,
              length: 4,
              lineStyle: {
                color: 'auto',
                width: 1
              }
            },
            axisLabel: {
              distance: 12,
              color: '#000',
              fontSize: 12
            },
            splitLine: { // 分割线
              length: 5,
              distance: 2,
              lineStyle: {
                width: 1,
                color: 'auto'
              }
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
              lineStyle: {
                show: true,
                with: 25,
                // 属性lineStyle控制线条样式
                color: [
                  [0.3, '#4dabf7'],
                  [0.6, '#69db7c'],
                  [0.8, '#ffa94d'],
                  [1, '#ff6b6b'],
                ],
              },
            },
            axisTick: {
              distance: 0,
              length: 4,
              lineStyle: {
                color: 'auto',
                width: 1
              }
            },
            axisLabel: {
              distance: 12,
              color: '#000',
              fontSize: 12
            },
            splitLine: { // 分割线
              length: 5,
              distance: 2,
              lineStyle: {
                width: 1,
                color: 'auto'
              }
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
              lineStyle: {
                show: true,
                with: 25,
                // 属性lineStyle控制线条样式
                color: [
                  [0.3, '#4dabf7'],
                  [0.6, '#69db7c'],
                  [0.8, '#ffa94d'],
                  [1, '#ff6b6b'],
                ],
              },
            },
            axisTick: {
              distance: 0,
              length: 4,
              lineStyle: {
                color: 'auto',
                width: 1
              }
            },
            axisLabel: {
              distance: 12,
              color: '#000',
              fontSize: 12
            },
            splitLine: { // 分割线
              length: 5,
              distance: 2,
              lineStyle: {
                width: 1,
                color: 'auto'
              }
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
    };

    //cpu运行状态
    const initChartCPURun = () => {
      myChart4 = echarts.init(proxy.$refs.chartsWarningRef4);
      moveOption.series[0].areaStyle = {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgb(1, 191, 236)'
          }
        ])
      }
      myChart4.setOption(moveOption);
    };

    //内存运行状态
    const initChartRAMRun = () => {
      myChart5 = echarts.init(proxy.$refs.chartsWarningRef5);
      moveOption.series[0].areaStyle = {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(0, 221, 255)'
          },
          {
            offset: 1,
            color: 'rgb(77, 119, 255)'
          }
        ])
      }
      myChart5.setOption(moveOption);
    };

    //磁盘运行状态
    const initChartDISKRun = () => {
      myChart6 = echarts.init(proxy.$refs.chartsWarningRef6);
      moveOption.series[0].areaStyle = {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgb(55, 162, 255)'
          },
          {
            offset: 1,
            color: 'rgb(116, 21, 219)'
          }
        ])
      }
      myChart6.setOption(moveOption);
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
      const es = new EventSource(getOrigin(import.meta.env.VITE_SERVER_URL + "/subscribe/sysenv"));

      es.addEventListener("host", displayHost);
      es.addEventListener("mem", displayMem);
      es.addEventListener("cpu", displayCpu);
      es.addEventListener("sysLoad", displaySysLoad);
      es.addEventListener("disk", displayDisk);
      es.addEventListener("go", goInfo);
      es.addEventListener("host", hostInfo);
    }

    startWs();

    function displayHost(event: { data: any; }) {
      const data = JSON.parse(event.data);
      state.sysInfo.os = data.os
      state.sysInfo.kernelArch = data.kernelArch
      state.sysInfo.sysComputerName = data.hostname
      state.sysInfo.goStartTime = data.bootTime
      state.sysInfo.goRunTime = data.uptime
      loading.value = false
    }

    function displayMem(event: { data: any; }) {
      const data = JSON.parse(event.data);
      setOptChart2(data.usedPercent.toFixed(2));
      state.sysInfo.memTotal = data.total
      state.sysInfo.memUsed = data.used
      state.sysInfo.available = data.available
      state.sysInfo.goUsed = data.goUsed
      state.sysInfo.memUsage = data.usedPercent.toFixed(2)
      setOptChart(myChart5, myChart5Data, state.sysInfo.memUsage);
      loading.value = false
    }

    function displayCpu(event: { data: any; }) {
      const data = JSON.parse(event.data);
      // console.log(dayjs().format('HH:mm:ss'))
      // console.log(data)

      state.sysInfo.cpuNum = data.Number
      state.sysInfo.cpuCores = data.Cores
      state.sysInfo.cpuUsed = data.UsedPercent[0].toFixed(2)
      setOptChart1(data.UsedPercent[0].toFixed(2));
      setOptChart(myChart4, myChart4Data, state.sysInfo.cpuUsed);
      loading.value = false
    }

    function displaySysLoad(event: { data: any; }) {
      const data = JSON.parse(event.data)
      state.sysInfo.cpuAvg5 = data.load5.toFixed(2)
      state.sysInfo.cpuAvg15 = data.load15.toFixed(2)
      loading.value = false
    }

    function displayDisk(event: { data: any; }) {
      const data = JSON.parse(event.data)
      state.sysInfo.diskTotal = data.total
      state.sysInfo.diskUsed = data.used
      state.sysInfo.diskUsedPercent = data.usedPercent.toFixed(2)
      setOptChart3(data.usedPercent.toFixed(2));
      setOptChart(myChart6, myChart6Data, state.sysInfo.diskUsedPercent);
      loading.value = false
    }


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
      goInfoData,
      hostData,
      loading,
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
      if (size === null || size === undefined) return ''
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
      if (!second) return '-'
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

.mb-4 {
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
