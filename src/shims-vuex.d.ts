import { Store } from 'vuex';
import { IUserState } from '@/store/user.store';
import { IStoreConnectionState } from '@/store/connectionState.store';
import { ISProductStore } from '@/store/product.store';
import { ISParameterStore } from '@/store/parameter.store';
import { ISSpecialReasonTypeStore } from '@/store/specialReasonType.store';
import { ISSpecialReasonGroupStore } from '@/store/specialReasonGroup.store';
import { IISShewhartCardStore } from './store/shewhartCard.store';
import { ISProgressBarStore } from '@/store/progressBar.store';
import { IToastMessage } from '@/store/toastMessage.store';
import { IISUserAndUserGroupStore } from '@/store/users.store';
import { IISQueryStore } from '@/store/query.sotre';
import { IshewhartCardSpecialReasonStore } from '@/store/shewhartCardSpecialReason.store';
import { IPointsArray } from '@/store/selectedPoints.store';
import { IUserGroupsStore } from '@/store/userGroups.store';
import { ICronStore } from '@/store/cron.store';
import { ISProcessStore } from '@/store/process.store';
import { ISOperationStore } from '@/store/operation.store';
import { ISProductionStore } from '@/store/production.store';
import { IPhoneCheck } from '@/store/phone.store';

declare module '@vue/runtime-core' {
  // declare your own store states
  interface State {
    user: IUserState;
    users: IISUserAndUserGroupStore;
    connectionState: IStoreConnectionState;
    productState: ISProductStore;
    parameterState: ISParameterStore;
    processState: ISProcessStore;
    operationState: ISOperationStore;
    productionState: ISProductionStore;
    specialReasonTypeState: ISSpecialReasonTypeStore;
    specialReasonGroupState: ISSpecialReasonGroupStore;
    shewhartCardState: IISShewhartCardStore;
    queryState: IISQueryStore;
    shewhartCardSpecialReasonState: IshewhartCardSpecialReasonStore;
    progressBarState: ISProgressBarStore;
    toastMessage: IToastMessage;
    pointsArray: IPointsArray;
    userGroupsState: IUserGroupsStore;
    cron: ICronStore;
    phone: IPhoneCheck;
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
