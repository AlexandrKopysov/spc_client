import axios from '@/services/axios.service';
import { IUserGroupDTO } from '@/api';
import { Module } from 'vuex';

export interface IUserGroups {
  userGroups: IUserGroupDTO[];
}

const prefixApi = 'user-group';

export const userGroupsStoreModule: Module<IUserGroups, object> = {
  namespaced: true,
  state: () => ({
    userGroups: null,
  }),
  mutations: {
    GROUPS_SET(state, groups: IUserGroupDTO[]) {
      state.userGroups = groups;
    },
  },
  getters: {
    ALL(state) {
      return state.userGroups;
    },
  },
  actions: {
    async all(context) {
      return await axios.get<IUserGroupDTO>(`${prefixApi}/all`).then((response) => {
        context.commit('GROUPS_SET', response.data);
      });
    },
    async upsert(context, group: IUserGroupDTO) {
      return axios.post<IUserGroupDTO>(`${prefixApi}/upsert`, group).catch(() => {
        return Promise.reject(false);
      });
    },
    async remove(context, uid: string) {
      return await axios.delete<IUserGroupDTO>(`${prefixApi}/remove/${uid}`).catch(() => {
        return Promise.reject(false);
      });
    },
  },
};
