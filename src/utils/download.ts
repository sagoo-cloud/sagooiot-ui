import download from 'downloadjs';
import { ElMessage } from 'element-plus';

const downloadFile = (res: any, fileName: string = '导出日志.xlsx') => {

  // 判断是不是返回的是json，是json说明报错了，否则返回的是文本流
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(res.data);

  try {
    const errJson = JSON.parse(text)
    if (errJson.message) {
      ElMessage.closeAll()
      ElMessage.error(errJson.message)
    }
  } catch {
    // 用split是避免多次取值重复都好分割的情况，比如 
    // attachment; filename="2022-12-06 21:34:35-SysLoginLog.xlsx", attachment; filename="2022-12-06 21:34:35-SysLoginLog.xlsx"
    const lastFileName = res.headers['content-disposition'] ? res.headers['content-disposition'].split(',')[0].replaceAll('attachment; filename="', '').replaceAll('"', '') : fileName;
    download(res.data, lastFileName, res.headers['content-type']);
  }
}

export default downloadFile