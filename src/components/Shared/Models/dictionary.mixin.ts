/* eslint-disable @typescript-eslint/no-explicit-any */
import IRequestMessage from '../../../model/IToastMessage';
import { unsavedDataMix } from './unsavedData.mixin';
export interface ISelectRow<T> {
  index: number;
  entity: T;
}
interface IUniqueModel {
  uid?: string;
  isNew?: boolean;
}

/**
 * миксин для компоннетов словаря. Если переходим на defineComponent
 * @returns
 */
export function dictMixis<TDict extends IUniqueModel>() {
  return {
    mixins: [unsavedDataMix],
    setup() {
      return {
        storeActoinUpsertRow: null as string,
        storeActoinDeleteRow: null as string,
      };
    },
    data() {
      return {
        showDialogDelete: false,
        selectRowDelete: null as ISelectRow<TDict>,
        /**обязательнве на переопределение поля */
        rows: [] as Array<TDict>,
        editingRows: {} as Record<string, TDict>,
      };
    },
    methods: {
      getNewObj(): TDict {
        throw 'Объявите метод для получения нового объекта';
      },
      editRow(row: TDict) {
        const self = this as any;
        self.editingRows[row.uid] = { ...row };
      },
      canselEdit(row: TDict, index: number) {
        const self = this as any;
        if (row.isNew) {
          self.rows.splice(index, 1);
        }
        delete self.editingRows[row.uid];
      },
      okEditRow(row: TDict, index: number) {
        const self = this as any;
        return self.$store.dispatch(self.storeActoinUpsertRow, row).then((srvObj) => {
          self.rows[index] = srvObj;
          delete self.editingRows[row.uid];
          row.isNew = false;
          const message: IRequestMessage = {
            detail: 'Строка добавлена/Изменена',
          };
          self.$store.dispatch('toastMessageState/success', message);
        });
      },
      /**Добавление строки */
      addRow() {
        const self = this as any;
        const newObj = self.getNewObj();
        self.rows.unshift(newObj);
        self.editRow(newObj);
      },

      confirmDeleteSelected(data: TDict, index: number) {
        const self = this as any;
        self.selectRowDelete = {
          index: index,
          entity: data,
        } as ISelectRow<TDict>;
        self.$confirm.require({
          message: 'Вы точно хотите удалить строку?',
          acceptLabel: 'Да',
          rejectLabel: 'Нет',
          accept: () => {
            self.deleteRow();
          },
        });
      },

      dataValidate() {
        const self = this as any;
        return !Object.keys(self.editingRows).length;
      },

      /**Удаление строки */
      deleteRow() {
        const self = this as any;
        self.$store
          .dispatch(self.storeActoinDeleteRow, self.selectRowDelete.entity)
          .then(() => {
            self.rows.splice(self.selectRowDelete.index, 1);
            const message: IRequestMessage = { detail: 'Строка удалена' };
            self.$store.dispatch('toastMessageState/success', message);
          })
          .finally(() => {
            self.selectRowDelete = null;
          });
      },

      /**
       * Toast сообщение
       */
      showSucessToastMessage(message: string) {
        const self = this as any;
        self.$store.dispatch('toastMessageState/success', { detail: message } as IRequestMessage);
      },
    },
  };
}
