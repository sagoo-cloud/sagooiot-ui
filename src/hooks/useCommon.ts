import { reactive } from 'vue'

export default function () {
  const statusParams = reactive({
    status: 1
  })

  return { statusParams }
}
