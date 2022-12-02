import axios from '@/services/axios.service';
import { IUserAndUserGroupItemDTO, IUserDto, INewPasswordReqDTO } from '@/api';
import { Module } from 'vuex';

export interface IISUserAndUserGroupState {
  userAndUserGroupState?: IUserAndUserGroupItemDTO;
  users: IUserDto[];
}

interface IPassUser {
  userUid: string;
  passDTO: INewPasswordReqDTO;
}

export const usersStoreModule: Module<IISUserAndUserGroupState, object> = {
  namespaced: true,
  state: () => ({
    userAndUserGroupState: null,
    users: null,
  }),
  mutations: {
    USERS_SET(state, users: IUserDto[]) {
      state.users = users;
    },
  },
  getters: {
    ALL(state) {
      return state.users;
    },
    BY_UID: (state) => (uid: string) => {
      return state.users.find((user) => {
        return user.uid == uid;
      });
    },
  },
  actions: {
    async get() {
      return await axios.get<IUserAndUserGroupItemDTO>('user', {}).then((response) => {
        return response.data;
      });
    },
    async getDict() {
      return await axios.get<IUserAndUserGroupItemDTO>('user-user-group/dict').then((response) => {
        return response.data;
      });
    },
    async all(context) {
      return await axios.get<IUserAndUserGroupItemDTO>('user/all').then((response) => {
        context.commit('USERS_SET', response.data);
      });
    },

    async upsert(context, newUser: IUserDto) {
      return await axios.post<IUserDto>('user/upsert', newUser).catch(() => {
        return Promise.reject(false);
      });
    },

    async remove(context, uid: string) {
      return await axios.delete<string>(`user/remove/${uid}`, {}).catch(() => {
        return Promise.reject(false);
      });
    },
    async upsertPass(context, newPass: IPassUser) {
      return await axios
        .post<string>(`user/set-new-password/${newPass.userUid}`, newPass.passDTO)
        .catch(() => {
          return Promise.reject(false);
        });
    },
  },
};
