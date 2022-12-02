import { createRouter, createWebHistory, RouteMeta, RouteRecordRaw } from 'vue-router';
import Home from '../components/app/Home.vue';
import Login from '../components/app/Login/Login.vue';
import NotFoundPage from '../components/NotFoundPage.vue';
import PhonePage from '../components/PhonePage.vue';
import ConnectionStringSettings from '../components/app/ConnectionStringSettings/ConnectionStringSettings.vue';
import Directorys from '../components/app/Dictionary/Directorys.vue';
import DirectoryDimensions from '../components/app/Dictionary/DirectoryDimensions.vue';
import DirectoryParameters from '../components/app/Dictionary/DirectoryParameters.vue';
import DirectoryProcess from '../components/app/Dictionary/DirectoryProcess.vue';
import DirectoryOperation from '../components/app/Dictionary/DirectoryOperation.vue';
import DirectoryProduction from '../components/app/Dictionary/DirectoryProduction.vue';

import DirectorySpecialReasonType from '@/components/app/Dictionary/DirectorySpecialReasonType.vue';
import DirectorySpecialReasonGroup from '@/components/app/Dictionary/DirectorySpecialReasonGroup.vue';
import ShewhartCardUpsertForm from '@/components/app/ShewhartCard/Upsert/ShewhartCardUpsertForm.vue';
import ShewhartCardMainForm from '@/components/app/ShewhartCard/View/ShewhartCardMainForm.vue';
import ShewhartCardViewForm from '@/components/app/ShewhartCard/View/ShewhartCardViewForm.vue';
import ShewhardCardHistoForm from '@/components/app/ShewhartCard/View/ShewhardCardHistoForm.vue';
import MainLayout from '../components/app/MainLayout.vue';

//#region Groups and Users
import DictonarysUsersAndGroups from '../components/app/DictionaryUsersGroups/DictonarysUsersAndGroups.vue';
import UserViewForm from '../components/app/DictionaryUsersGroups/Users/UserViewForm.vue';
import GroupsViewForm from '../components/app/DictionaryUsersGroups/Groups/GroupsViewForm.vue';
import CronsComponent from '../components/app/Cron/crons.vue';
//#endregion
import { store } from '@/store';
import { EUserRole } from '@/api';
// import checkPhoneService from '@/services/checkPhone.service';

export interface IMetaRouteType extends RouteMeta {
  roleAcess?: Array<EUserRole>;
  label?: string;
  /**  title документа */
  title?: string;
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'mainLayout',
    component: MainLayout,
    children: [
      {
        meta: <IMetaRouteType>{
          roleAcess: [EUserRole.Analyst, EUserRole.User, EUserRole.Admin],
          label: 'Контрольные карты',
          title: 'Контрольные карты',
        },
        path: '/',
        name: 'home',
        alias: 'Домой',
        component: Home,
      },
      {
        meta: <IMetaRouteType>{
          roleAcess: [EUserRole.Admin],
          label: 'Настройка строк подключений',
          title: 'Строки подключений',
        },
        path: '/connectionStringSettings',
        name: 'connectionStringSettings',
        alias: 'Настройка строк подключений',
        component: ConnectionStringSettings,
      },
      {
        meta: <IMetaRouteType>{
          roleAcess: [EUserRole.Analyst, EUserRole.Admin],
          label: 'Справочники',
          title: 'Справочники',
        },
        path: '/directorys',
        name: 'directorys',
        alias: 'Справочники',
        component: Directorys,
        children: [
          {
            path: '',
            redirect: '/directorys/dymensions',
          },
          {
            path: 'dymensions',
            name: 'Изделия',
            component: DirectoryDimensions,
            meta: {
              title: 'Изделия',
            },
          },
          {
            path: 'parameters',
            name: 'Параметры',
            component: DirectoryParameters,
            meta: {
              title: 'Параметры',
            },
          },
          {
            path: 'process',
            name: 'Процессы',
            component: DirectoryProcess,
            meta: {
              title: 'Процессы',
            },
          },
          {
            path: 'production',
            name: 'Производство',
            component: DirectoryProduction,
            meta: {
              title: 'Производство',
            },
          },
          {
            path: 'operation',
            name: 'Операции',
            component: DirectoryOperation,
            meta: {
              title: 'Операции',
            },
          },
          {
            path: 'specialReasonGroup',
            name: 'Группы особых причин',
            component: DirectorySpecialReasonGroup,
            meta: {
              title: 'Группы особых причин',
            },
          },
          {
            path: 'specialReasonType',
            name: 'Типы особых причин',
            component: DirectorySpecialReasonType,
            meta: {
              title: 'Типы особых причин',
            },
          },
        ],
      },
      {
        meta: <IMetaRouteType>{
          roleAcess: [EUserRole.Admin],
          label: 'Пользователи и группы',
        },
        path: '/usersAndGroups',
        name: 'usersAndGroups',
        alias: 'Пользователи и группы',
        component: DictonarysUsersAndGroups,
        children: [
          {
            path: '',
            redirect: '/usersAndGroups/users',
          },
          {
            path: 'users',
            name: 'Пользователи',
            component: UserViewForm,
            meta: {
              title: 'Пользователи',
            },
          },
          {
            path: 'groups',
            name: 'Группы',
            component: GroupsViewForm,
            meta: {
              title: 'Группы',
            },
          },
        ],
      },
      {
        meta: <IMetaRouteType>{
          roleAcess: [EUserRole.Analyst, EUserRole.Admin],
          label: 'Создание карты шухарта',
          title: 'Редактирование карты',
        },
        path: '/createShewhartCard/:cardUid?',
        name: 'Создание карты шухарта',
        component: ShewhartCardUpsertForm,
      },
      {
        meta: <IMetaRouteType>{
          roleAcess: [EUserRole.Analyst, EUserRole.User, EUserRole.Admin],
          label: 'Просмотр карты',
          title: 'Карта',
        },
        path: '/viewShewhartCard/:cardUid?',
        name: 'Просмотр карты шухарта',
        component: ShewhartCardMainForm,
        children: [
          {
            path: '',
            redirect: 'viewShewhartCard/graphics/:cardUid?',
          },
          {
            path: 'graphics/:cardUid?',
            name: 'График',
            component: ShewhartCardViewForm,
          },
          {
            path: 'histogram/:cardUid?',
            name: 'Гистограммы',
            component: ShewhardCardHistoForm,
          },
        ],
      },
      {
        meta: <IMetaRouteType>{
          roleAcess: [EUserRole.Admin, EUserRole.Analyst, EUserRole.Admin],
          label: 'Задачи по расписанию',
          title: 'Задачи по расписанию',
        },
        path: '/crons',
        name: 'crons',
        alias: 'Задачи по расписанию',
        component: CronsComponent,
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'Авторизация',
    },
  },
  {
    path: '/phonePage',
    name: 'phonePage',
    component: PhonePage,
    meta: {
      title: 'Авторизация',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not found',
    component: NotFoundPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  console.log(store.getters['phoneState/GET']);
  // if (store.getters['phoneState/get'] && to.fullPath != '/phonePage') {
  //   return '/phonePage';
  // }
  // if (store.getters['phoneState/GET'] && to.fullPath != '/phonePage') {
  //   return '/phonePage';
  // }
  const userRole: EUserRole = store.getters['user/GET_ROLE'];
  if (userRole === 'Admin') {
    return;
  }
  const meta = to.meta as IMetaRouteType;
  if (meta.roleAcess?.length && !meta.roleAcess.includes(userRole)) {
    return '/login';
  }
});

export default router;
