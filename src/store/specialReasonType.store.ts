import axios from '@/services/axios.service';
import { IEntityBase, ISpecialReasonDTO } from '@/api';
import { Module } from 'vuex';

export interface ISSpecialReasonTypeStore {
  specialReasonTypeState?: ISpecialReasonDTO;
}
/**
 * Имя API команда
 */
// const apiName = 'special-reason';

interface ISFilter {
  name: { value: string; matchMode: string };
  description: { value: string; matchMode: string };
  specialReasonGroupUId: { value: string; matchMode: string };
}

interface ISLazyParams {
  first: number;
  rows: number;
  order: null;
  filters: ISFilter;
  sortField: string;
  sortOrder: number;
}

export const specialReasonTypeStoreModule: Module<ISSpecialReasonTypeStore, object> = {
  namespaced: true,
  state: () => ({
    specialReasonTypeState: null,
  }),
  mutations: {},
  getters: {},
  actions: {
    async get() {
      return await axios.get<ISpecialReasonDTO>('special-reason-type/all', {}).then((response) => {
        return response.data;
      });
    },
    async getDict() {
      return await axios.get<IEntityBase>('special-reason-type/dict', {}).then((response) => {
        return response.data;
      });
    },

    async getLazy(state, lazyParams: ISLazyParams) {
      const order =
        lazyParams.sortField && lazyParams.sortOrder
          ? `&order={"${lazyParams.sortField}" : "${lazyParams.sortOrder == 1 ? 'ASC' : 'DESC'}"}`
          : '';
      const filter = {
        name: lazyParams.filters.name.value,
        description: lazyParams.filters.description.value,
      };
      return await axios
        .get<ISpecialReasonDTO>(
          `special-reason-type/query?limit=${lazyParams.rows}&offset=${
            lazyParams.first
          }&filter=${JSON.stringify(filter)}${order}`,
          {},
        )
        .then((response) => {
          return response.data;
        });
    },
    async upsert(state, addRow: ISpecialReasonDTO) {
      return await axios
        .post<ISpecialReasonDTO>('special-reason-type/upsert', addRow)
        .then((response) => {
          return response.data;
        });
    },
    async getByUid(state, getUid: ISpecialReasonDTO) {
      return await axios
        .get<ISpecialReasonDTO>('special-reason-type/single/' + getUid.uid, {})
        .then((response) => {
          return response.data;
        });
    },

    async delete(state, deleteRow: ISpecialReasonDTO) {
      return await axios
        .delete<ISpecialReasonDTO>('special-reason-type/remove/' + deleteRow.uid, {})
        .then((response) => {
          return response.data;
        });
    },
  },
};
