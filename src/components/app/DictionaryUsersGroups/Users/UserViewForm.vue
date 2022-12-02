<template>
  <div class="spc flex flex-column">
    <div class="spc-table-header">
      <Button label="Добавить" class="button-add" @click="addRow()" />
    </div>
    <div class="flex-grow-1 content-table">
      <DataTable
        class="p-datatable-sm spc-table-body"
        responsiveLayout="scroll"
        paginatorTemplate="PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        filterMode="lenient"
        :value="rows"
        :filters="filter"
        :rows="10"
        :rowsPerPageOptions="[10, 20, 50]"
        :paginator="true"
        :scrollable="true"
        scrollHeight="flex"
      >
        <Column field="fullName" header="Полное имя">
          <template #body="{ data, field }">
            {{ data[field] }}
          </template>
        </Column>
        <Column field="isSystem" header="Системная запись">
          <template #body="{ data, field }">
            {{ data[field] }}
          </template>
        </Column>
        <Column field="login" header="Логин">
          <template #body="{ data, field }">
            {{ data[field] }}
          </template>
        </Column>
        <Column field="role" header="Роль">
          <template #body="{ data, field }">
            {{ data[field] }}
          </template>
        </Column>
        <Column field="email" header="EMail">
          <template #body="{ data, field }">
            {{ data[field] }}
          </template>
        </Column>
        <Column field="detaile" header="Примечание">
          <template #body="{ data, field }">
            {{ data[field] }}
          </template>
        </Column>
        <Column style="width: 10%; display: flex; justify-content: end">
          <template #body="{ data }">
            <div class="actions">
              <div v-if="!upsertRow[data.uid]">
                <Button
                  icon="spc spc-i-pencil"
                  class="p-button-rounded p-button-text pencil-hover"
                  @click="editRow(data)"
                />
                <Button
                  icon="pi pi-cog"
                  class="p-button-rounded p-button-text"
                  @click="editPassword(data)"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-text"
                  @click="confirmDeleteSelected(data)"
                />
              </div>
            </div>
          </template>
          ></Column
        >
      </DataTable>
    </div>
    <UpsertUserModal
      v-if="CDialogs.Upsert.value"
      :upsertRowProp="upsertRow"
      :userRoleProp="userRole"
      :dialogProp="CDialogs.Upsert"
      @ok-edit-row="okEditRow()"
      @clear-edit-row="clearEditRow()"
    />
    <UpsertUserPassword
      :upsertRowUID="upsertRow.uid"
      :dialogProp="CDialogs.UpsertPass"
      @upsert-row-refresh="upsertRowRefresh()"
    />
    <Dialog
      v-model:visible="CDialogs.Delete.value"
      :style="{ width: '450px' }"
      header="Подтверждение"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>Вы точно хотите удалить строку,</span>
      </div>
      <template #footer>
        <Button label="Нет" icon="pi pi-times" class="p-button-text" @click="offDelete()" />
        <Button label="Да" icon="pi pi-check" class="p-button-text" @click="okDelete()" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { IUserDto, INewPasswordReqDTO, EUserRole } from '@/api';
import { CToastMessage } from '../../../../model/IToastMessage';
import { CDialog } from '@/store/storeHelper/baseModel';
import { CHelperUsers, CPasswordFormNew } from '@/store/storeHelper/usersStoreHelper';
import deebCopy from '../../../../services/deepCopy.service';
import UpsertUserModal from './Components/UserUpsertModal.vue';
import UpsertUserPassword from './Components/PasswordUpsertModal.vue';

export default defineComponent({
  name: 'UserViewForm',
  components: {
    UpsertUserModal: UpsertUserModal,
    UpsertUserPassword: UpsertUserPassword,
  },
  setup() {
    const userRole = Object.values(EUserRole);
    const selectUserRole: EUserRole = null;

    return {
      userRole,
      selectUserRole,
    };
  },
  data() {
    return {
      filter: {},
      rows: [] as IUserDto[],
      upsertRow: {} as IUserDto,
      passwordFormNew: new CPasswordFormNew(),
      passwordNewDTO: {} as INewPasswordReqDTO,
      CDialogs: {
        Delete: new CDialog(),
        Upsert: new CDialog(),
        UpsertPass: new CDialog(),
      },
      storeHelper: new CHelperUsers(this.$store, 'users'),
    };
  },
  methods: {
    /**Получаем всех пользователей */
    getUsersAll() {
      this.storeHelper.actions.all().then(() => {
        this.rows = this.storeHelper.getters.ALL();
      });
    },
    /**Запрос подтверждения на удаление */
    confirmDeleteSelected(editData: IUserDto) {
      this.upsertRow = deebCopy(editData);
      this.$confirm.require({
        message: 'Вы точно хотите удалить строку?',
        acceptLabel: 'Да',
        rejectLabel: 'Нет',
        accept: () => {
          this.okDelete();
        },
        reject: () => {
          this.offDelete();
        },
      });
    },
    /**Получаем новый обьект*/
    getNewObj(): IUserDto {
      return {
        fullName: '',
        login: '',
        role: null,
        detaile: '',
        email: '',
        otherData: null,
        uid: uuidv4(),
      };
    },
    /**Событие добавления новой строки */
    addRow() {
      const newObj = this.getNewObj();
      this.upsertRow = deebCopy(newObj);
      this.CDialogs.Upsert.value = true;
    },
    /**Событие обновление строки */
    editRow(data: IUserDto) {
      this.upsertRow = deebCopy(data);
      this.CDialogs.Upsert.value = true;
    },
    /**Событие изменения пароля */
    editPassword(data: IUserDto) {
      this.upsertRow = deebCopy(data);
      this.CDialogs.UpsertPass.value = true;
    },
    /**Подтверждение изменения пользователя*/
    okEditRow() {
      this.getUsersAll();
      this.clearEditRow();
    },
    /**Подтверждение изменения пароля */
    okEditPassword() {
      try {
        if (this.passwordFormNew.input1 !== this.passwordFormNew.input2) {
          throw new Error('Пароли не совпадают');
        }

        /**Выполняем запрос на обновление пароля */
        this.storeHelper.actions
          .upsertPass(this.passwordFormNew.input1, this.upsertRow.uid)
          .then(() => {
            this.$store.dispatch(
              'toastMessageState/success',
              new CToastMessage('Пароль успешно обновлен'),
            );
            this.offEditPassword();
          });
      } catch (error) {
        this.$store.dispatch('toastMessageState/warn', new CToastMessage(error.toString()));
      }
    },
    /**Отмена изменения пароля */
    offEditPassword() {
      this.clearPassRow();
    },
    /**Подтверждение удаления пароля*/
    okDelete() {
      this.storeHelper.actions.remove(this.upsertRow.uid).then(() => {
        this.CDialogs.Delete.value = false;
        this.getUsersAll();
        this.$store.dispatch('toastMessageState/success', new CToastMessage('Запись удалена'));
      });
    },

    offDelete() {
      this.CDialogs.Delete.value = false;
      this.upsertRowRefresh();
    },
    /**Очистка изменяемой строки */
    clearEditRow() {
      this.CDialogs.Upsert.value = false;
      this.upsertRowRefresh();
    },
    /**Очистка изменяемого пароля */
    clearPassRow() {
      this.CDialogs.UpsertPass.value = false;
      this.passwordFormNew.input1 = '';
      this.passwordFormNew.input2 = '';
      this.upsertRowRefresh();
    },
    upsertRowRefresh() {
      this.upsertRow = { fullName: '', login: '', role: null };
    },
  },
  mounted() {
    this.getUsersAll();
  },
});
</script>

<style scoped lang="less">
@import url('./userViewForm.style.less');
</style>
