import axios from '@/services/axios.service';
import { IProductDTO } from '@/api';
import { Module } from 'vuex';

export interface ISProductStore {
  productStore?: IProductDTO;
}

interface ISFilter {
  name: { value: string; matchMode: string };
  description: { value: string; matchMode: string };
  decNumber: { value: string; matchMode: string };
  kodOzm: { value: number; matchMode: string };
}

interface ISLazyParams {
  first: number;
  rows: number;
  order: null;
  filters: ISFilter;
  sortField: string;
  sortOrder: number;
}

export const productStoreModule: Module<ISProductStore, object> = {
  namespaced: true,
  state: () => ({
    productStore: null,
  }),
  mutations: {},
  getters: {},
  actions: {
    async get() {
      return await axios
        .get<IProductDTO>('product/all', {})
        .then((response) => response.data)
        .then((data) => {
          return data;
        });
    },
    async allJoin() {
      return await axios.get<IProductDTO>('product/dict').then((response) => response.data);
    },
    async getLazy(state, lazyParams: ISLazyParams) {
      const order =
        lazyParams.sortField && lazyParams.sortOrder
          ? `&order={"${lazyParams.sortField}" : "${lazyParams.sortOrder == 1 ? 'ASC' : 'DESC'}"}`
          : '&order={}';
      return await axios
        .get<IProductDTO>(
          `product/query?limit=${lazyParams.rows}&offset=${lazyParams.first}&filter={
            "name":"${lazyParams.filters.name.value}",
            "description":"${lazyParams.filters.description.value || ''}",
            "decNumber":"${lazyParams.filters.decNumber.value || ''}"
          }${order}`,
          {},
        )
        .then((response) => response.data)
        .then((data) => {
          return data;
        });
    },
    async upsert(state, addRow: IProductDTO) {
      return await axios
        .post<IProductDTO>('product/upsert', addRow)
        .then((response) => response.data)
        .then((data) => {
          return data;
        });
    },
    async getByUid(state, uid: string) {
      return await axios
        .get<IProductDTO>('product/single/' + uid, {})
        .then((response) => response.data)
        .then((data) => {
          return data;
        });
    },

    async delete(state, deleteRow: IProductDTO) {
      return await axios
        .delete<IProductDTO>('product/remove/' + deleteRow.uid, {})
        .then((response) => response.data)
        .then((data) => {
          return data;
          // state.commit('DELETE_ROW_IN_STATE', deleteRow);
        });
    },
  },
};
