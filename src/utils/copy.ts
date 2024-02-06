import { copyText } from 'vue3-clipboard'
import { ElMessage } from 'element-plus'

export default function copy(text: string) {
  copyText(text || '', undefined, (error: Error) => {
    if (error) {
      ElMessage.warning(`复制失败: ${error} ！`);
    } else {
      ElMessage.success(`复制成功！`);
    }
  });
}