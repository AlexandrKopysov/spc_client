import { Module } from 'vuex';

export interface IProgressBar {
  value?: boolean;
}
export const progressBarModule: Module<IProgressBar, object> = {
  namespaced: true,
  state: () => ({
    value: false,
  }),
  mutations: {
    setBar(state, load: boolean) {
      state.value = load;
    },
  },
  getters: {
    getProgressBar(state) {
      return state.value;
    },
  },
  actions: {
    setProgressBar(state, load: boolean) {
      state.commit('setBar', load);
    },
  },
};
