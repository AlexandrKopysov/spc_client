import { CActions, CGetters } from './baseModel';
import { INewPasswordReqDTO, IUserDto } from '@/api';
import { Store } from 'vuex';
import { State } from 'vue';

class CPassUser {
  passDTO: INewPasswordReqDTO;
  constructor(public userUid: string, password: string) {
    this.passDTO = { password: password } as INewPasswordReqDTO;
  }
}

class CGettersExtends<T> extends CGetters<T> {
  BY_UID(): Array<T> {
    return this.state.getters[`${this.apiName}/BY_UID`];
  }
  constructor(public state: Store<State>, public apiName: string) {
    super(state, apiName);
  }
}

class CActionsExtends<T> extends CActions<T> {
  upsertPass(newPass: string, uid: string) {
    const passUser = new CPassUser(uid, newPass);
    return this.state.dispatch('users/upsertPass', passUser);
  }
  constructor(public state: Store<State>, public apiName: string) {
    super(state, apiName);
  }
}

export class CHelperUsers {
  getters!: CGettersExtends<IUserDto>;
  actions!: CActionsExtends<IUserDto>;
  constructor(private store: Store<State>, apiName: string) {
    this.getters = new CGettersExtends(this.store, apiName);
    this.actions = new CActionsExtends(this.store, apiName);
  }
}

export class CPasswordFormNew {
  constructor(public input1: string = '', public input2: string = '') {}
}
