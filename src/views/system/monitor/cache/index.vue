<template>
  <div class="page">
    <el-row :gutter="15">
      <el-col :span="12" class="marg-b-15">
        <el-card shadow="nover" class="box-card-height" style="height:auto">
          <template #header>
            <div class="card-header">
              <span>客户端信息</span>
            </div>
          </template>
          <table cellspacing="0" style=";width: 100%">
            <tbody v-if="sysInfo.clients">
              <tr>
                <td>
                  <div class="cell-card">当前客户端连接数: </div>
                </td>
                <td>
                  <div class="cell-card">{{ sysInfo.clients.connected_clients }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card">输出缓冲区中队列对象个数的最大值: </div>
                </td>
                <td>
                  <div class="cell-card">{{ sysInfo.clients.client_recent_max_output_buffer }}</div>
                </td>
              </tr>

              <tr>
                <td>
                  <div class="cell-card">输入缓冲区中占用的最大容量:</div>
                </td>
                <td>
                  <div class="cell-card">{{ memorySizeFormat(sysInfo.clients.client_recent_max_input_buffer) }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card">等待阻塞命令的客户端数量:</div>
                </td>
                <td>
                  <div class="cell-card">{{ sysInfo.clients.blocked_clients }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </el-card>
      </el-col>
      <el-col :span="12" class="marg-b-15">
        <el-card shadow="nover" class="box-card-height" style="height:auto">
          <template #header>
            <div class="card-header">
              <span>CPU 信息</span>
            </div>
          </template>
          <table cellspacing="0" style="width: 100%">
            <tbody v-if="sysInfo.cpu">
              <tr>
                <td>
                  <div class="cell-card" title="Redis主进程在内核态所占用的CPU时钟总和">主进程内核态占用CPU时钟: </div>
                </td>
                <td>
                  <div class="cell-card">{{ lengthToFixed2(sysInfo.cpu.used_cpu_sys) }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card" title="Redis主进程在用户态所占用的CPU时钟总和">主进程用户态占用CPU时钟: </div>
                </td>
                <td>
                  <div class="cell-card">{{ lengthToFixed2(sysInfo.cpu.used_cpu_user) }}</div>
                </td>
              </tr>

              <tr>
                <td>
                  <div class="cell-card" title="Redis子进程在内核态所占用的CPU时钟总和">子进程内核态占用CPU时钟:</div>
                </td>
                <td>
                  <div class="cell-card">{{ lengthToFixed2(sysInfo.cpu.used_cpu_sys_children) }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card" title="Redis子进程在用户态所占用的CPU时钟总和">子进程用户态占用CPU时钟:</div>
                </td>
                <td>
                  <div class="cell-card">{{ lengthToFixed2(sysInfo.cpu.used_cpu_user_children) }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :span="12" class="marg-b-15">
        <el-card shadow="nover" class="box-card-height" style="height:auto">
          <template #header>
            <div class="card-header">
              <span>服务信息</span>
            </div>
          </template>
          <table cellspacing="0" style="width: 100%">
            <tbody v-if="sysInfo.clients">
              <tr>
                <td>
                  <div class="cell-card">Redis服务版本: </div>
                </td>
                <td>
                  <div class="cell-card">{{ sysInfo.server.redis_version }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card">运行模式: </div>
                </td>
                <td>
                  <div class="cell-card">{{ sysInfo.server.redis_mode }}</div>
                </td>
              </tr>

              <tr>
                <td>
                  <div class="cell-card">Redis所在机器的操作系统:</div>
                </td>
                <td>
                  <div class="cell-card">{{ sysInfo.server.os }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card">架构:</div>
                </td>
                <td>
                  <div class="cell-card">{{ sysInfo.server.arch_bits }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card">Redis所使用的事件处理机制:</div>
                </td>
                <td>
                  <div class="cell-card">{{ sysInfo.server.multiplexing_api }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card">自Redis服务启动以来，运行的秒数:</div>
                </td>
                <td>
                  <div class="cell-card">{{ sysInfo.server.uptime_in_seconds }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card">自Redis服务启动以来，运行的天数:</div>
                </td>
                <td>
                  <div class="cell-card">{{ sysInfo.server.uptime_in_days }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card">serverCron每秒运行次数:</div>
                </td>
                <td>
                  <div class="cell-card">{{ sysInfo.server.hz }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </el-card>
      </el-col>
      <el-col :span="12" class="marg-b-15">
        <el-card shadow="nover" class="box-card-height" style="height:auto">
          <template #header>
            <div class="card-header">
              <span>内存信息</span>
            </div>
          </template>
          <table v-if='sysInfo.memory' cellspacing="0" style="width: 100%">
            <tbody>
              <tr>
                <td>
                  <div class="cell-card">Redis分配器分配的内存总量: </div>
                </td>
                <td>
                  <div class="cell-card">
                    {{ memorySizeFormat(sysInfo.memory.used_memory) }} -
                    {{ lengthToFixed2(sysInfo.memory.used_memory / sysInfo.memory.maxmemory) }}%

                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card">以可读的格式返回used_memory: </div>
                </td>
                <td>
                  <div class="cell-card">{{ memorySizeFormat(sysInfo.memory.used_memory_human) }}</div>
                </td>
              </tr>

              <tr>
                <td>
                  <div class="cell-card">从操作系统的角度，Redis进程占用的物理内存总量:</div>
                </td>
                <td>
                  <div class="cell-card">{{ memorySizeFormat(sysInfo.memory.used_memory_rss) }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card">内存使用的最大值:</div>
                </td>
                <td>
                  <div class="cell-card">{{ memorySizeFormat(sysInfo.memory.used_memory_peak) }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card">以可读的格式返回used_memory_peak:</div>
                </td>
                <td>
                  <div class="cell-card">{{ memorySizeFormat(sysInfo.memory.used_memory_peak_human) }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card">Lua引擎所消耗的内存大小:</div>
                </td>
                <td>
                  <div class="cell-card">{{ memorySizeFormat(sysInfo.memory.used_memory_lua) }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card">内存碎片率:</div>
                </td>
                <td>
                  <div class="cell-card">{{ sysInfo.memory.mem_fragmentation_ratio }}</div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="cell-card">Redis所使用的内存分配器:</div>
                </td>
                <td>
                  <div class="cell-card">{{ sysInfo.memory.mem_allocator }}</div>
                </td>
              </tr>

            </tbody>
          </table>
        </el-card>
      </el-col>
    </el-row>
    <div class="flex-row gap-3">
      <el-col :xs="24" :sm="24" :md="24" class="marg-b-15">
        <el-card shadow="nover" class="box-card-height" style="height:auto">
          <template #header>
            <div class="card-header">
              <span>基础统计信息</span>
            </div>
          </template>
          <div class="flex-row">
            <el-form v-if="sysInfo.stats" label-position="right" label-width="160px" class="flex1" style="max-width: 460px">
              <el-form-item label="连接过的客户端总数">{{ sysInfo.stats.total_connections_received }}</el-form-item>
              <el-form-item label="执行过的命令总数">{{ sysInfo.stats.total_commands_processed }}</el-form-item>
              <el-form-item label="每秒处理命令条数">{{ sysInfo.stats.instantaneous_ops_per_sec }}</el-form-item>
              <el-form-item label="拒绝的连接个数">{{ sysInfo.stats.rejected_connections }}</el-form-item>
              <el-form-item label="key数量">{{ sysInfo.stats.evicted_keys }}</el-form-item>
            </el-form>

            <el-form v-if="sysInfo.stats" label-position="right" label-width="160px" class="flex1" style="max-width: 460px">
              <el-form-item label="网络总入流量">{{ memorySizeFormat(sysInfo.stats.total_net_input_bytes) }}</el-form-item>
              <el-form-item label="网络总出流量">{{ memorySizeFormat(sysInfo.stats.total_net_output_bytes) }}</el-form-item>
              <el-form-item label="每秒输入量">{{ sysInfo.stats.instantaneous_input_kbps }} kb/s</el-form-item>
              <el-form-item label="每秒输出量">{{ sysInfo.stats.instantaneous_output_kbps }} kb/s</el-form-item>
              <el-form-item label="最近fork消耗时间">{{ sysInfo.stats.evicted_keys }} μs</el-form-item>
            </el-form>

            <el-form v-if="sysInfo.stats" label-position="right" label-width="160px" class="flex1" style="max-width: 460px">
              <el-form-item label="主从完全同步成功次数">{{ sysInfo.stats.sync_full }}</el-form-item>
              <el-form-item label="主从部分同步成功次数">{{ sysInfo.stats.sync_partial_ok }}</el-form-item>
              <el-form-item label="主从部分同步失败次数">{{ sysInfo.stats.sync_partial_err }}</el-form-item>
              <el-form-item label="正migrate的Redis个数">{{ sysInfo.stats.migrate_cached_sockets }} μs</el-form-item>
              <el-form-item label="过期的key数量">{{ sysInfo.stats.expired_keys }}</el-form-item>
            </el-form>

            <el-form v-if="sysInfo.stats" label-position="right" label-width="160px" class="flex1" style="max-width: 460px">
              <el-form-item label="当前使用中的频道数量">{{ sysInfo.stats.pubsub_channels }}</el-form-item>
              <el-form-item label="当前使用中的模式数量">{{ sysInfo.stats.pubsub_patterns }}</el-form-item>
              <el-form-item label="不命中次数">{{ sysInfo.stats.keyspace_misses }}</el-form-item>
              <el-form-item label="命中次数">{{ sysInfo.stats.keyspace_hits }}</el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </div>
    <div class="flex-row gap-3">
      <el-col :xs="24" :sm="24" :md="24">
        <el-card shadow="nover" class="box-card-height" style="height:auto">
          <template #header>
            <div class="card-header">
              <span>info Keyspace统计信息</span>
            </div>
          </template>
          <div style="" class="flex-column" v-if="sysInfo.keyspaceList && sysInfo.keyspace">
            <el-form style="display: flex;width: 100%;" v-for="(item, index) in sysInfo.keyspaceList" :key="index" label-position="right" label-width="160px">
              <el-form-item class="flex1" label="key名称">{{ item }}</el-form-item>
              <el-form-item class="flex1" label="当前数据库key总数">{{ sysInfo.keyspace[item].keys }}</el-form-item>
              <el-form-item class="flex1" label="带有过期时间的key总数">{{ sysInfo.keyspace[item].expires }}</el-form-item>
              <el-form-item class="flex1" label="平均存活时间">{{ timeFormat(sysInfo.keyspace[item].avg_ttl / 1000) }}</el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </div>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, defineComponent } from 'vue';
import 'echarts-wordcloud';
import getOrigin from '/@/utils/origin'
let interval: any = null;
export default defineComponent({
  name: 'monitor',
  components: {},
  setup() {
    const state: any = reactive({
      myCharts: [],
      sysInfo: {},
    });

    function startWs() {
      const es = new EventSource(getOrigin(import.meta.env.VITE_SERVER_URL + "/subscribe/redisinfo"));

      es.addEventListener("stats", statsInfoMsg);
      es.addEventListener("clients", clientsInfoMsg);
      es.addEventListener("cpu", cpuInfoMsg);
      es.addEventListener("server", serverInfoMsg);
      es.addEventListener("memory", memoryInfoMsg);
      es.addEventListener("keyspace", keyspaceInfoMsg);
    }

    startWs();

    function keyspaceInfoMsg(event: { data: any; }) {
      const data = JSON.parse(event.data);
      state.sysInfo.keyspaceList = Object.keys(data);
      state.sysInfo.keyspace = data

    }

    function memoryInfoMsg(event: { data: any; }) {
      const data = JSON.parse(event.data);
      state.sysInfo.memory = data
    }

    function serverInfoMsg(event: { data: any; }) {
      const data = JSON.parse(event.data);
      state.sysInfo.server = data
    }

    function cpuInfoMsg(event: { data: any; }) {
      const data = JSON.parse(event.data);
      state.sysInfo.cpu = data
    }


    function statsInfoMsg(event: { data: any; }) {
      const data = JSON.parse(event.data);
      state.sysInfo.stats = data
    }

    function clientsInfoMsg(event: { data: any; }) {
      const data = JSON.parse(event.data);
      state.sysInfo.clients = data
    }

    return {
      ...toRefs(state),
    };
  },
  unmounted() {
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
    lengthToFixed2(size: any) {
      size = parseFloat(size);
      return size.toFixed(2);
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
  line-height: 1.2;
  margin: 10px 0;
}

.box-card {
  min-height: 380px;
}

.box-card-meter {
  height: 230px;

  min-height: 180px;
}
.el-form-item{
  margin-bottom: 5px;
}
</style>
