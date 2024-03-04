export default function getOrigin(suffix: string = '', type: string = 'http') {
  if (type === 'ws') {
    if (import.meta.env.VITE_SERVER_PROTOCOL === 'https:') {
      return `wss://${import.meta.env.VITE_SERVER_HOSTNAME}${suffix}`
    } else if (!import.meta.env.VITE_SERVER_PROTOCOL) {
      if (window.location.protocol === 'https:') {
        return `wss://${window.location.host}${suffix}`
      } else {
        return `ws://${window.location.host}${suffix}`
      }
    }
    return `ws://${import.meta.env.VITE_SERVER_HOSTNAME}${suffix}`
  }

  // 如果配置的第三方服务直接是http开头的，就直接使用即可
  if (suffix.includes('http')) {
    return suffix
  } else if (import.meta.env.VITE_SERVER_HOSTNAME) {
    return `${import.meta.env.VITE_SERVER_PROTOCOL}//${import.meta.env.VITE_SERVER_HOSTNAME}${suffix}`
  } else {
    return `${window.location.protocol}//${window.location.host}${suffix}`
  }
}