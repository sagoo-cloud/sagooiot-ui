export default function getOrigin(suffix: string = '', type: string = 'http') {
  if (type === 'ws') {
    if (import.meta.env.VITE_SERVER_PROTOCOL === 'https:') {
      return `wss//${import.meta.env.VITE_SERVER_HOSTNAME}${suffix}`
    } else if (!import.meta.env.VITE_SERVER_PROTOCOL) {
      if (window.location.protocol === 'https:') {
        return `wss//${window.location.hostname}${suffix}`
      }
    }
    return `ws//${import.meta.env.VITE_SERVER_HOSTNAME}${suffix}`
  }


  if (import.meta.env.VITE_SERVER_HOSTNAME) {
    return `${import.meta.env.VITE_SERVER_PROTOCOL}//${import.meta.env.VITE_SERVER_HOSTNAME}${suffix}`
  } else {
    return `${window.location.protocol}//${window.location.hostname}${suffix}`
  }
}