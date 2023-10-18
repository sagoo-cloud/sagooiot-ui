<template>
  <div class="type-item">
    <div v-for="(item, index) in actionList" :key="index" class="item " :class="index > 0 ? 'biankang' : ''">
      <div class="conicon" style="width: 100%; text-align: right; position: relative; right: -8px; top: -8px; color: red"
        v-if="index > 0">
        <el-icon @click="delAction(index)">
          <CircleClose />
        </el-icon>
      </div>
      <div class="title flex">
        <div class="icon"></div>串行动作
      </div>
      <div class="product flex flex-warp">
        <ActionSerialItem :index="index" :serial="item.serial" :sourceData="sourceData" @saveData="saveData" @delData="delData"></ActionSerialItem>

      
      </div>

      <div class="title flex">
        <div class="icon"></div>并行动作
      </div>
      <div class="product flex flex-warp">
            <ActionParallelItem :index="index"  :parallel="item.parallel" :sourceData="sourceData" @saveData="saveData" @delData="delData"></ActionParallelItem>
      
      </div>
    </div>
    <div>
      <div class="edit">
        <el-button type="primary" :icon="DocumentAdd" @click="addAction()">新增场景动作</el-button>
      </div>
    </div>
 
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref  } from 'vue'
import { DocumentAdd, CircleClose } from '@element-plus/icons-vue';
import ActionSerialItem from './actionSerialItem.vue';
import ActionParallelItem from './actionParallelItem.vue';
import api from '/@/api/scene';


//初始化数据
const actionList_temp=ref([{
  serial:[{}],
  parallel:[{}],
}]);
const actionList=ref([{
  serial:[{}],
  parallel:[{}],
}]);
const originalSceneList = ref([{
	id: 0
}]);
interface testIValueType {
  id: string;
  key: string;
  name?: string;
}

const props = defineProps({
  sourceData: {
    type: Array as PropType<testIValueType[]>,
    default: () => []
  },
  scene_id:{
    type:String,
    default: () => ''
  }
})

const getOneDetail = () => {
			api.manage.getOneDetail({ "sceneId": props.scene_id, 'group': 'action' }).then((res: any) => {
				if (!res) {
					addActionDetail();
					// getOneDetail();
				}

       	originalSceneList.value = res;
        const combinedArray = res.map((scene: any)  => {
          const parsedBodyJson = JSON.parse(scene.bodyjson);
          if (Array.isArray(parsedBodyJson)) {
            const serial = parsedBodyJson.map(item => item.serial).flat();
            const parallel = parsedBodyJson.map(item => item.parallel).flat();
            return {
              serial,
              parallel
            };
          } else {
            return {
              serial: [parsedBodyJson.serial].flat(),
              parallel: [parsedBodyJson.parallel].flat()
            };
          }
        });

        actionList.value=combinedArray;
			})
		};
getOneDetail();    

//新增一条场景动作
const addActionDetail = () => {
		let data = {
			sceneId: props.scene_id,
			group: 'action',
			bodyjson: actionList_temp.value,
		}
		api.manage.addDetail(data).then((res: any) => {
			getOneDetail();
		});
}
//删除一条场景
const delData = (index: number) => {
			let ids =originalSceneList.value[index].id;
			api.manage.delDetail(ids).then((res: any) => {
				// getOneDetail();
			});
}

//修改一条场景
const saveData = (data: any) => {
      let ids = originalSceneList.value[data.index].id;
			api.manage.editDetail({ id: ids, bodyjson:actionList.value[data.index] }).then((res: any) => {
				  getOneDetail();
			});

}


const addAction = () => {
  actionList.value.push({
    'serial':[],
    'parallel':[],
  });
  addActionDetail();

};
const delAction = (index: number) => {
  actionList.value.splice(index, 1);
  delData(index);
}

</script>
<style scoped lang="scss">

.type-item {
  margin-top: 15px;

  .edit {
    margin-top: 15px;
    margin-left: 10px;
    color: #2041d4;
  }

  .conicon {
    width: 55px;
    height: 25px;

    font-size: 28px;
    line-height: 28px;
    cursor: pointer;
  }

  .item {
    padding: 10px;


  }

  .biankang {
    margin-top: 10px;
    border: 1px solid #cfcfcf;;
    border-radius: 2px;
  }


  .title {
    height: 40px;

    .icon {
      margin-left: 2px;
      margin-right: 10px;
      width: 5px;
      height: 20px;
      background-color: #315efb;
    }
  }

  .product {

    .el-form-item {
      margin-left: 30px;
      margin-bottom: 10px;
      margin-top: 10px;
    }
  }

}
</style>

