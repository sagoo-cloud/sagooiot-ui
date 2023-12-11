import apiSystem from '/@/api/system';
import { ElMessageBox } from 'element-plus';

let centerPoint: any

// 增加map配置
export function initMap(): any {
  return new Promise((resolve, reject) => {
    if (window.BMapGL) {
      console.log('已经初始化了...');
      return resolve({ BMapGL: window.BMapGL, centerPoint })
    }

    Promise.all([apiSystem.getInfoByKey('sys.map.access.key'), apiSystem.getInfoByKey('sys.map.lngAndLat')]).then(([res1, res2]) => {
      const ak = res1.data.configValue
      const centerStr = res2.data.configValue

      // 百度地图异步加载回调处理
      window.onBMapCallback = () => {
        console.log('百度地图脚本初始化成功...');
        if (centerStr) {
          const [lng, lat] = centerStr.split(',')
          centerPoint = new window.BMapGL.Point(lng.trim(), lat.trim())
        } else {
          centerPoint = '北京'
        }
        resolve({ BMapGL: window.BMapGL, centerPoint })
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      // 加上callback才会加载成功
      script.src = `//api.map.baidu.com/api?v=1.0&type=webgl&ak=${ak}&callback=onBMapCallback`
      document.head.appendChild(script);
    }).catch(() => {
      reject(new Error('地图加载失败，请刷新重试或联系开发者'))
      ElMessageBox.alert('地图加载失败，请刷新重试或联系开发者', '提示', { type: 'error' })
    })
  });
}
