import axios from '@/services/axios.service';
import { IStoreConnectionDTO, EConnectionType } from '@/api';
import { Module } from 'vuex';

export interface IStoreConnectionState {
  storeConnection?: IStoreConnectionDTO<EConnectionType>[];
}

export const connetctionStateStoreModule: Module<IStoreConnectionState, object> = {
  namespaced: true,
  state: () => ({
    storeConnection: null,
  }),
  mutations: {
    SET_STATE(state, payload: IStoreConnectionDTO<EConnectionType>[]) {
      state.storeConnection = payload;
    },
    ADD_ROW_IN_STATE(state, newRow: IStoreConnectionDTO<EConnectionType>) {
      state.storeConnection.push(newRow);
    },
    REMOVE_STATE(state) {
      // !Реализовать удаление из стейта по UID
      state.storeConnection = [];
    },
  },
  getters: {
    connections(state) {
      return state.storeConnection;
    },
  },
  actions: {
    async getStoreConnection(state) {
      return await axios
        .get<Array<IStoreConnectionDTO<EConnectionType>>>('store-connection/all', {})
        .then(({ data }) => {
          state.commit('SET_STATE', data);
          return data;
        });
    },
    async addStoreConnection(state, connectionString: IStoreConnectionDTO<EConnectionType>) {
      return await axios
        .post<IStoreConnectionDTO<EConnectionType>>('store-connection/upsert', connectionString)
        .then((response) => {
          return response.data;
        });
    },
    async getStoreConnectionByUid(state, getUid: IStoreConnectionDTO<EConnectionType>) {
      return (await axios.get)<IStoreConnectionDTO<EConnectionType>>(
        'store-connection/single/' + getUid.uid,
        {},
      ).then((response) => {
        return response.data;
      });
    },
    async deleteStoreConnection(state, deleteUid: IStoreConnectionDTO<EConnectionType>) {
      return await axios
        .delete<IStoreConnectionDTO<EConnectionType>>(
          'store-connection/remove/' + deleteUid.uid,
          {},
        )
        .then((response) => {
          return response.data;
        });
    },
  },
};
