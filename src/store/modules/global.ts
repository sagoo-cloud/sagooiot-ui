import { Module } from 'vuex';
import { GlobalState, RootStateTypes } from '/@/store/interface/index';

const globalModule: Module<GlobalState, RootStateTypes> = {
  namespaced: true,
  state: {
    resize: {
      innerHeight: window.innerHeight,
      innerWidth: window.innerWidth
    }
  },
  mutations: {
    setResize(state: any) {
      state.resize = {
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth
      }
    },
  },
};

export default globalModule;
