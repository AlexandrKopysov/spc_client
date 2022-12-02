import axios from '@/services/axios.service';
import { ICheckQueryReqDTO, EConnectionType } from '@/api';
import { Module } from 'vuex';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IISQueryState {}

export const querySltoreModule: Module<IISQueryState, object> = {
  namespaced: true,
  state: () => ({}),
  mutations: {},
  getters: {},
  actions: {
    async checkQuery(state, reqQuery: ICheckQueryReqDTO<EConnectionType>) {
      return await axios
        .post<ICheckQueryReqDTO<EConnectionType>>('query/check-query', reqQuery)
        .then((response) => {
          return response.data;
        });
    },
  },
};
