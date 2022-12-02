import axios from '@/services/axios.service';
import { IEntityBase, IParamDTO } from '@/api';
import { Module } from 'vuex';

export interface ISParameterStore {
  parameterStore?: IParamDTO;
}

interface ISFilter {
  name: { value: string; matchMode: string };
  description: { value: string; matchMode: string };
}

interface ISLazyParams {
  first: number;
  rows: number;
  order: null;
  filters: ISFilter;
  sortField: string;
  sortOrder: number;
}

export const parameterStoreModule: Module<ISParameterStore, object> = {
  namespaced: true,
  state: () => ({
    parameterStore: null,
  }),
  mutations: {},
  getters: {},
  actions: {
    async get() {
      return await axios.get<IParamDTO>('param/all', {}).then((response) => {
        return response.data;
      });
    },

    async getLazy(state, lazyParams: ISLazyParams) {
      const order =
        lazyParams.sortField && lazyParams.sortOrder
          ? `&order={"${lazyParams.sortField}" : "${lazyParams.sortOrder == 1 ? 'ASC' : 'DESC'}"}`
          : '&order={}';
      return await axios
        .get<IParamDTO>(
          `param/query?limit=${lazyParams.rows}&offset=${lazyParams.first}&filter={
            "name":"${lazyParams.filters.name.value || ''}",
            "description":"${lazyParams.filters.description.value || ''}"
          }${order}`,
          {},
        )
        .then((response) => {
          return response.data;
        });
    },
    async upsert(state, addRow: IParamDTO) {
      return await axios.post<IParamDTO>('param/upsert', addRow).then((response) => {
        return response.data;
      });
    },
    async getByUid(state, getUid: IParamDTO) {
      return await axios.get<IParamDTO>('param/single/' + getUid.uid, {}).then((response) => {
        return response.data;
      });
    },

    async delete(state, deleteRow: IParamDTO) {
      return await axios.delete<IParamDTO>('param/remove/' + deleteRow.uid, {}).then((response) => {
        return response.data;
      });
    },

    async getDict() {
      return await axios.get<Array<IEntityBase>>('param/dict').then((response) => {
        return response.data;
      });
    },
  },
};
