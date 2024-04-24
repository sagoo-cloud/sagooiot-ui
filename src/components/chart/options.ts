import { title } from "process";

const fontFamily = 'CenturyGothic';

function getPx(px: number) {
  return Math.round((window.innerWidth * px) / 1920)
  // return px
}

const grid = {
  top: 25,
  left: 15,
  right: 25,
  bottom: 0,
  containLabel: true
};

export const echarts_loading_config = {
  // text: "loading",
  text: '',
  color: '#409EFF',
  textColor: '#999999',
  maskColor: 'rgba(255, 255, 255, 0)',
  fontSize: 18,
  spinnerRadius: 17,
  lineWidth: 2,
  fontFamily
};

export default {
  tooltip: {},
  grid: grid,
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
};

export function getPieOption({ data = [] as any[],
  radius = ['30%', '50%'],
  center = ['50%', '55%'],
  legend = { bottom: '5%', left: 'center', top: '0' } as any,
  rate = ''
}) {
  return {
    // tooltip: {
    //   trigger: 'item'
    // },
    legend: {
      textStyle: {
        fontSize: getPx(14),
      },
      itemWidth: getPx(20), itemHeight: getPx(14),
      ...legend
    },
    title: {
      text: rate,
      top: 'center',
      left: 'center',
      // bottom: 0,
      textStyle: {
        fontSize: getPx(24),
        // fontWeight: 'normal'
      },
    },
    color: ['#2578f2', '#a1c7f8'],
    series: [
      {
        name: '',
        type: 'pie',
        radius,
        center,
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          position: 'outer',
          alignTo: 'labelLine',
          bleedMargin: 5,
          formatter: '{b}\n{d}%',
          minMargin: 5,
          edgeDistance: 10,
          lineHeight: getPx(14),
          fontSize: getPx(14),
        },
        labelLine: {
          length: 15,
          length2: 0,
          maxSurfaceAngle: 80
        },
        data
      }
    ]
  };
}

export function getPie3Option({ data = [] as any[],
  radius = ['40%', '57%'],
  center = ['50%', '45%'],
  title = 'Server Group Name_1'
}) {
  return {
    tooltip: {
      trigger: 'item'
    },
    title: {
      text: title,
      bottom: '0',
      left: 'center',
      textStyle: {
        fontSize: getPx(14),
        fontWeight: 'normal'
      },
    },
    color: ['#2578f2', '#a1c7f8'],
    series: [
      {
        name: '',
        type: 'pie',
        radius,
        center,
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          position: 'outer',
          alignTo: 'labelLine',
          bleedMargin: 5,
          formatter: '{b}\n{d}%',
          minMargin: 5,
          edgeDistance: 10,
          lineHeight: getPx(12),
          fontSize: getPx(12),
        },
        labelLine: {
          length: 6,
          length2: 6,
          maxSurfaceAngle: 80
        },
        data
      }
    ]
  };
}

export function getPie4Option({ data = [] as any[],
  radius = ['40%', '57%'],
  center = ['50%', '45%'],
  title = 'Server Group Name_1'
}) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: function (params: any) {
        // $.get('detail?name=' + params.name, function (content) {
        //   callback(ticket, toHTML(content));
        // });
        return params.name + ': ' + params.data.count;
      }
    },
    title: {
      text: title,
      bottom: '0',
      left: 'center',
      textStyle: {
        fontSize: getPx(14),
        fontWeight: 'normal'
      },
    },
    color: ['#2578f2', '#a1c7f8'],
    series: [
      {
        name: '',
        type: 'pie',
        radius,
        center,
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          position: 'outer',
          alignTo: 'labelLine',
          bleedMargin: 5,
          formatter: '{b}\n{d}%',
          minMargin: 5,
          edgeDistance: 10,
          lineHeight: getPx(12),
          fontSize: getPx(12),
        },
        labelLine: {
          length: 6,
          length2: 6,
          maxSurfaceAngle: 80
        },
        data
      }
    ]
  };
}

export function getPie2Option({ data = [] as any[],
  radius = ['65%', '85%'],
  center = ['50%', '50%'],
}) {
  return {
    title: {
      text: data[0],
      top: 'center',
      left: 'center',
      // bottom: 0,
      textStyle: {
        fontSize: getPx(40),
        // fontWeight: 'normal'
      },
    },
    color: ['#1891FF', '#EFEFEF'],
    series: [
      {
        type: 'pie',
        radius,
        center,
        labelLine: {
          show: false
        },
        data
      }
    ]
  };
}

export function getBarOption({
  data = [12, 14, 0, 0] as any[],
  data2 = [12, 14, 0, 0] as any[],
  xAxis = ['Q1', 'Q2', 'Q3', 'Q4'] as any[],
}) {
  return {
    tooltip: {
      trigger: 'item'
    },
    grid: { top: 10, bottom: 0, left: 0, right: 0, containLabel: true },
    color: ['#2578f2', '#a1c7f8'],
    xAxis: {
      type: 'category',
      data: xAxis
    },
    yAxis: [{
      type: 'value'
    }, {
      type: 'value',
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: '{value}%'
      }
    }],
    series: [
      {
        data,
        type: 'bar',
        barMaxWidth: '60%',
      },
      {
        data: data2,
        yAxisIndex: 1,
        type: 'line',
        smooth: true
      },
    ]
  };
}

export function getRadarOption({
  data1 = [12, 14, 0] as any[],
  data2 = [12, 14, 0] as any[],
  legend = [] as string[],
}) {
  const max = Math.max(...data1, ...data2);

  return {
    tooltip: {
    },
    legend: {
      left: 'center',
      textStyle: {
        fontSize: getPx(16),
      },
      itemWidth: getPx(20), itemHeight: getPx(12), top: 0, data: legend
    },
    color: ['rgb(6, 176, 60)', 'rgb(253, 109, 90)'],
    radar: {
      indicator: [
        { name: 'Non-Critical', max },
        { name: 'Security\nAdvisory', max },
        { name: 'Product Enhancement Advisory', max },
        { name: 'Bug Fix\nAdvisory', max },
      ],
      center: ['50%', '55%'],
      radius: 65,
      nameGap: 4,
      // startAngle: 45,
      axisName: {
        color: '#222',
        fontSize: getPx(14),
        padding: [0, 0]
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: data1,
            name: legend[0]
          },
          {
            value: data2,
            name: legend[1]
          }
        ]
      }
    ]
  };
}

export function getLineOption({
  datas = [[12, 14, 0]] as any[],
  xAxis = ['4', '5', '6'] as any[],
  legend = [] as string[]
}) {

  const series = datas.map((data, i) => {
    return {
      data,
      type: 'line',
      name: legend[i],
      smooth: true
    }
  })

  return {
    tooltip: {
      trigger: 'axis',
    },
    legend: { left: 'center', top: 0, data: legend },
    grid: { top: 30, bottom: 0, left: 35, right: 30, containLabel: true },
    color: ['rgb(6, 176, 60)', 'rgb(253, 109, 90)'],
    xAxis: {
      type: 'category',
      data: xAxis
    },
    yAxis: {
      type: 'value'
    },
    series
  };
}

export function getLineAreaOption({
  data1 = [12, 14, 0] as any[],
  data2 = [12, 14, 0] as any[],
  xAxis = ['4', '5', '6'] as any[],
  legend = [] as string[]
}) {
  const color = ['rgb(36, 120, 242)', '#84b7f9']
  return {
    tooltip: {
      trigger: 'axis'
    },
    legend: { left: 'center', top: 0, data: legend },
    grid: { top: 40, bottom: 0, left: 0, right: 0, containLabel: true },
    color,
    xAxis: {
      type: 'category',
      // boundaryGap: false,
      data: xAxis
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: data1,
        type: 'line',
        name: legend[0],
        areaStyle: {
          opacity: 0.2
        },
        label: {
          show: true,
          color: color[0],
          position: 'top'
        },
        smooth: true
      },
      {
        data: data2,
        type: 'line',
        name: legend[1],
        areaStyle: {
          opacity: 0.2
        },
        label: {
          show: true,
          color: color[1],
          position: 'top'
        },
        smooth: true
      },
    ]
  };
}

export function getBarRowOption({
  data = [2, 3, 4, 5, 7] as any[],
  xAxis = ['Group_1', 'Group_2', 'Group_3', 'Group_4', 'Group_5'] as any[],
  legend = [] as string[],
  max = undefined as any
}) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: "{b}: <b>{c}%</b>"
    },
    legend: { left: 'center', bottom: 0, data: legend },
    grid: { top: 10, bottom: 28, left: 5, right: 15, containLabel: true },
    color: ['#2578f2', '#a1c7f8'],
    xAxis: {
      type: 'value',
      // splitNumber: 4,
      max: max,
      axisLabel: {
        formatter: "{value}%"
      }
    },
    yAxis: {
      type: 'category',
      axisTick: { show: false },
      //开启鼠标事件！！这一句很重要
      triggerEvent: true,
      // nameLocation: 'end',
      axisLine: {
        show: false
      },
      axisLabel: {
        // color: '#fff', // 文字颜色
        // 文字省略
        formatter: function (value: string) {
          if (value.length > 9) {
            return `${value.slice(0, 9)}...`
          }
          return value
        }
      },
      data: xAxis
    },
    series: [
      {
        data,
        type: 'bar',
        name: legend[0],
        barMaxWidth: 30
      },
    ]
  };
}
