import axios from '@/services/axios.service';
import { IEntityBase, IProcessDTO } from '../../../web-api';
import { Module } from 'vuex';

export interface ISProcessStore {
  processStore?: IProcessDTO;
}

const controllerName = 'process';

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

export const processStoreModule: Module<ISProcessStore, object> = {
  namespaced: true,
  state: () => ({
    processStore: null,
  }),
  mutations: {},
  getters: {},
  actions: {
    async getAll() {
      return await axios.get<IProcessDTO>(`${controllerName}/all`, {}).then((response) => {
        return response.data;
      });
    },

    async getDict() {
      return await axios.get<Array<IEntityBase>>(`${controllerName}/dict`).then((response) => {
        return response.data;
      });
    },

    async getLazy(state, lazyParams: ISLazyParams) {
      const order =
        lazyParams.sortField && lazyParams.sortOrder
          ? `&order={"${lazyParams.sortField}" : "${lazyParams.sortOrder == 1 ? 'ASC' : 'DESC'}"}`
          : '&order={}';
      return await axios
        .get<IProcessDTO>(
          `${controllerName}/query?limit=${lazyParams.rows}&offset=${lazyParams.first}&filter={
            "name":"${lazyParams.filters.name.value || ''}",
            "description":"${lazyParams.filters.description.value || ''}"
          }${order}`,
          {},
        )
        .then((response) => {
          return response.data;
        });
    },

    async upsert(state, addRow: IProcessDTO) {
      return await axios.post<IProcessDTO>(`${controllerName}/upsert`, addRow).then((response) => {
        return response.data;
      });
    },

    async delete(state, deleteRow: IProcessDTO) {
      return await axios
        .delete<IProcessDTO>(`${controllerName}/remove/` + deleteRow.uid, {})
        .then((response) => {
          return response.data;
        });
    },
  },
};
