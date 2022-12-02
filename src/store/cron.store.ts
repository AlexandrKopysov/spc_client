import { Module } from 'vuex';
import axios from '@/services/axios.service';
import { ICronDTO } from '@/api';

export interface ICronStore {
  crons: Array<IUICronDTO>;
}

export interface IUICronDTO extends ICronDTO {
  isNew?: boolean;
  shewhartLength?: number;
}

const BASE_CONTROLLER_URL = 'cron';

const mapToUIModel = (cron: ICronDTO) => {
  return <IUICronDTO>Object.assign(cron, {
    shewhartLength: cron.shewhartCardUids?.length || 0,
    disable: cron.disable || false,
  });
};

const cronStoreModule: Module<ICronStore, object> = {
  namespaced: true,
  state: () => ({
    crons: [],
  }),
  mutations: {
    setAll(state, records: Array<ICronDTO>) {
      state.crons = records.map(mapToUIModel);
    },
    upsert(state, cron: IUICronDTO) {
      const existIndex = state.crons.findIndex((c) => c.uid === cron.uid);
      if (existIndex < 0) {
        state.crons.unshift(cron);
        return;
      }
      state.crons[existIndex] = cron;
    },

    remove(state, cronUid: string) {
      const existIndex = state.crons.findIndex((c) => c.uid === cronUid);
      if (existIndex < 0) {
        return;
      }
      state.crons.splice(existIndex, 1);
    },
  },
  actions: {
    async getAll({ commit }) {
      return await axios
        .get<Array<ICronDTO>>(`${BASE_CONTROLLER_URL}/all`, {})
        .then((response) => response.data)
        .then((data) => {
          commit('setAll', data);
          return data;
        });
    },
    async upsert({ commit }, payload: ICronDTO) {
      return await axios
        .post<ICronDTO>(`${BASE_CONTROLLER_URL}/upsert`, payload)
        .then((response) => response.data)
        .then((data) => {
          commit('upsert', mapToUIModel(data));
          return data;
        });
    },
    async remove({ commit }, cronUId: string) {
      return await axios
        .delete<Array<ICronDTO>>(`${BASE_CONTROLLER_URL}/remove/${cronUId}`)
        .then((response) => response.data)
        .then((data) => {
          commit('remove', cronUId);
          return data;
        });
    },
  },
};
export default {
  BASE_CONTROLLER_URL,
  cronStoreModule,
};
