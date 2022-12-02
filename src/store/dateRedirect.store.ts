import axios from '@/services/axios.service';
import { IDateRedirectUpsertDTO } from '@/api';
import IDateRedirect from '../components/app/ShewhartCard/Model/IDateRedirect';
import { Module } from 'vuex';

const comandName = 'shewhard-card';
export interface IDateRedirectUpsertStore {
  dateRedirectUpsert: IDateRedirectUpsertDTO;
}

export const dateRedirectStoreModule: Module<IDateRedirectUpsertStore, object> = {
  namespaced: true,
  state: () => ({
    dateRedirectUpsert: null,
  }),
  mutations: {},
  getters: {},
  actions: {
    async upsert(state, upsertDateRedirect: IDateRedirect) {
      const dateRedirect: IDateRedirectUpsertDTO = {
        comment: upsertDateRedirect.comment,
        date: upsertDateRedirect.date,
        uid: upsertDateRedirect.uid,
        tehMaxLimit: upsertDateRedirect.tehMaxLimit,
        tehMinLimit: upsertDateRedirect.tehMinLimit,
      };
      return await axios
        .post(`${comandName}/${upsertDateRedirect.shewhardUID}/date-redirect/upsert`, dateRedirect)
        .then((response) => {
          return response.data;
        });
    },
    async delete(state, upsertDateRedirect: IDateRedirect) {
      return await axios
        .delete(
          `${comandName}/${upsertDateRedirect.shewhardUID}/date-redirect/${upsertDateRedirect.uid}`,
        )
        .then((response) => {
          return response.data;
        });
    },
  },
};
