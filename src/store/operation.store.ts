import axios from '@/services/axios.service';
import { IEntityBase, IOperationDTO } from '../../../web-api';
import { Module } from 'vuex';

export interface ISOperationStore {
  operationStore?: IOperationDTO;
}

const controllerName = 'operation';

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

export const operationStoreModule: Module<ISOperationStore, object> = {
  namespaced: true,
  state: () => ({
    operationStore: null,
  }),
  mutations: {},
  getters: {},
  actions: {
    async getAll() {
      return await axios.get<IOperationDTO>(`${controllerName}/all`, {}).then((response) => {
        return response.data;
      });
    },

    async getLazy(state, lazyParams: ISLazyParams) {
      const order =
        lazyParams.sortField && lazyParams.sortOrder
          ? `&order={"${lazyParams.sortField}" : "${lazyParams.sortOrder == 1 ? 'ASC' : 'DESC'}"}`
          : '&order={}';
      return await axios
        .get<IOperationDTO>(
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

    async getDict() {
      return await axios.get<Array<IEntityBase>>(`${controllerName}/dict`).then((response) => {
        return response.data;
      });
    },

    async upsert(state, addRow: IOperationDTO) {
      return await axios
        .post<IOperationDTO>(`${controllerName}/upsert`, addRow)
        .then((response) => {
          return response.data;
        });
    },

    async delete(state, deleteRow: IOperationDTO) {
      return await axios
        .delete<IOperationDTO>(`${controllerName}/remove/` + deleteRow.uid, {})
        .then((response) => {
          return response.data;
        });
    },
  },
};
