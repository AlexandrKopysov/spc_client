import axios from '@/services/axios.service';
import { IEntityBase, IProductionDTO } from '../../../web-api';
import { Module } from 'vuex';

export interface IProductionStore {
  productionStore?: IProductionDTO;
}

const controllerName = 'production';

interface IFilter {
  name: { value: string; matchMode: string };
  description: { value: string; matchMode: string };
}

interface ILazyParams {
  first: number;
  rows: number;
  order: null;
  filters: IFilter;
  sortField: string;
  sortOrder: number;
}

export const productionStoreModule: Module<IProductionStore, object> = {
  namespaced: true,
  state: () => ({
    productionStore: null,
  }),
  mutations: {},
  getters: {},
  actions: {
    async getAll() {
      return await axios.get<IProductionDTO>(`${controllerName}/all`, {}).then((response) => {
        return response.data;
      });
    },

    async getLazy(state, lazyParams: ILazyParams) {
      const order =
        lazyParams.sortField && lazyParams.sortOrder
          ? `&order={"${lazyParams.sortField}" : "${lazyParams.sortOrder == 1 ? 'ASC' : 'DESC'}"}`
          : '&order={}';
      return await axios
        .get<IProductionDTO>(
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

    async upsert(state, addRow: IProductionDTO) {
      return await axios
        .post<IProductionDTO>(`${controllerName}/upsert`, addRow)
        .then((response) => {
          return response.data;
        });
    },

    async delete(state, deleteRow: IProductionDTO) {
      return await axios
        .delete<IProductionDTO>(`${controllerName}/remove/` + deleteRow.uid, {})
        .then((response) => {
          return response.data;
        });
    },
  },
};
