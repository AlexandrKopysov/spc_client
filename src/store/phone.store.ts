import { Module } from 'vuex';

export interface IPhoneCheck {
  isMobile: boolean;
}
export const phoneStoreModule: Module<IPhoneCheck, object> = {
  namespaced: true,
  state: () => ({
    isMobile: false,
  }),
  getters: {
    GET(state) {
      return state.isMobile;
    },
  },
  mutations: {
    SET(state, newVal: boolean) {
      state.isMobile = newVal;
    },
  },
  actions: {},
};
