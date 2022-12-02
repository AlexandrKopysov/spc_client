import { Module } from 'vuex';
import IRequestMessage from '../model/IToastMessage';

export interface IToastMessage {
  dataMessage: IRequestMessage;
}
export const toastMessageModule: Module<IToastMessage, object> = {
  namespaced: true,
  state: () => ({
    dataMessage: null,
  }),
  mutations: {
    SET_STATE(state, payload: IRequestMessage) {
      state.dataMessage = payload;
    },
  },
  getters: {
    getMessage(state) {
      return state.dataMessage;
    },
  },
  actions: {
    error(state, request: IRequestMessage) {
      request.severity = 'error';
      request.life = 10000;
      request.group = 'br';
      state.commit('SET_STATE', request);
    },
    success(state, request: IRequestMessage) {
      request.severity = 'success';
      request.life = 3000;
      request.group = 'br';
      state.commit('SET_STATE', request);
    },
    warn(state, request: IRequestMessage) {
      request.severity = 'warn';
      request.life = 10000;
      request.group = 'br';
      state.commit('SET_STATE', request);
    },
  },
};
