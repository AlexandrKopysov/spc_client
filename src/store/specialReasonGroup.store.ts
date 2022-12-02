import axios from '@/services/axios.service';
import { ISpecialReasonDTO, ISpecialReasonGroupDTO } from '@/api';
import { Module } from 'vuex';

export interface ISSpecialReasonGroupStore {
  specialReasonGroupState?: ISpecialReasonGroupDTO;
}
/**
 * Имя API команда
 */
// const apiName = 'special-reason-group';

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

export const specialReasonGroupStoreModule: Module<ISSpecialReasonGroupStore, object> = {
  namespaced: true,
  state: () => ({
    specialReasonGroupState: null,
  }),
  mutations: {},
  getters: {},
  actions: {
    async get() {
      return await axios
        .get<ISpecialReasonGroupDTO>('special-reason-type-group/all', {})
        .then((response) => {
          return response.data;
        });
    },

    async getLazy(state, lazyParams: ISLazyParams) {
      const order =
        lazyParams.sortField && lazyParams.sortOrder
          ? `&order={"${lazyParams.sortField}" : "${lazyParams.sortOrder == 1 ? 'ASC' : 'DESC'}"}`
          : '&order={}';
      return await axios
        .get<ISpecialReasonGroupDTO>(
          `special-reason-type-group/query?limit=${lazyParams.rows}&offset=${
            lazyParams.first
          }&filter={
            "name":"${lazyParams.filters.name.value || ''}",
            "description":"${lazyParams.filters.description.value || ''}"
          }${order}`,
          {},
        )
        .then((response) => {
          return response.data;
        });
    },
    async upsert(state, addRow: ISpecialReasonGroupDTO) {
      const newRow: ISpecialReasonGroupDTO = {
        uid: addRow?.uid,
        name: addRow.name,
        description: addRow.description,
        specialReasonUids: addRow.specialReasonUids,
      };
      return await axios
        .post<ISpecialReasonGroupDTO>('special-reason-type-group/upsert', newRow)
        .then((response) => {
          return response.data;
        });
    },
    async getByUid(state, getUid: ISpecialReasonGroupDTO) {
      return await axios
        .get<ISpecialReasonGroupDTO>('special-reason-type-group/single/' + getUid.uid, {})
        .then((response) => {
          return response.data;
        });
    },

    async delete(state, deleteRow: ISpecialReasonGroupDTO) {
      return await axios
        .delete<ISpecialReasonDTO>('special-reason-type-group/remove/' + deleteRow.uid, {})
        .then((response) => {
          return response.data;
        });
    },
  },
};
