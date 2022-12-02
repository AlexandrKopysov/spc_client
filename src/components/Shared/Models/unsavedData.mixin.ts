/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigationGuardNext } from 'vue-router';
import { diff } from 'deep-object-diff';

export const unsavedDataMix = {
  // mixins: [confirmMixin],
  data() {
    return {
      nextRoute: null as NavigationGuardNext,
    };
  },
  methods: {
    confirmAccept() {
      const self = this as any;
      self.nextRoute();
    },

    /**
     * Базовый метод валидации данных, необходимо переопределить в компоненте или миксине
     */
    dataValidate() {
      console.warn('Метод не переопределен - dataValidate');
      return true;
    },
    /**
     * Проверка данных и отображение всплывающего окна
     */
    checkGuardValidate(next: NavigationGuardNext) {
      const self = this as any;
      self.nextRoute = next;
      if (this.dataValidate()) {
        self.confirmAccept();
      } else {
        self.$confirm.require({
          message: 'Есть несохраненные данные. Продолжить?',
          acceptLabel: 'Да',
          rejectLabel: 'Нет',
          accept: () => {
            self.confirmAccept();
          },
        });
      }
    },
    /**
     * Метод сравнение обьектов
     */
    isEqual(object1: any, object2: any) {
      return Object.keys(diff(object1, object2)).length === 0 ? true : false;
    },
  },
};
