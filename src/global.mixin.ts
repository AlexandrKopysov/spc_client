/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserBaseDTO, EUserRole } from '@/api';

export default {
  methods: {
    checkUserRoleEntry(...list: Array<EUserRole>) {
      const self = this as any;
      const userRole = self.$store.getters['user/GET_ROLE'];
      return list.includes(userRole);
    },
    checkResponsibles(responsibleUsers: Array<IUserBaseDTO>) {
      const self = this as any;
      if (self.$store.getters['user/GET_ROLE'] == EUserRole.Admin) {
        return true;
      }
      const user = self.$store.getters['user/GET_UID'];
      return !!responsibleUsers.find((userResp) => {
        return userResp.uid == user;
      });
    },
  },
};
