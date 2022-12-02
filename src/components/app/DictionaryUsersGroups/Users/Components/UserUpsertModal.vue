<template>
  <Dialog
    v-model:visible="CDialogs.value"
    header="Добавить/изменить пользователя"
    class="p-fluid spc"
    :closable="false"
    :modal="true"
    :style="{ width: '450px' }"
  >
    <div class="grid">
      <div class="col-12 field">
        <label>Полное имя</label>
        <InputText
          v-model="upsertRow.fullName"
          placeholder="Полное имя"
          class="w-full w-input"
        ></InputText>
      </div>
      <div class="col-12 field">
        <label>Логин</label>
        <InputText v-model="upsertRow.login" placeholder="Логин" class="w-full w-input"></InputText>
      </div>
      <div class="col-12 field">
        <label>Выберите роль</label>
        <Dropdown v-model="upsertRow.role" :options="userRole" placeholder="Выберите роль">
          <template #option="data">
            {{ data.option }}
          </template>
        </Dropdown>
      </div>
      <div class="col-12 field">
        <label>Email</label>
        <InputText v-model="upsertRow.email" placeholder="Email" class="w-full w-input"></InputText>
      </div>
      <div class="col-6">
        <Button label="Сохранить" class="button-add" @click="okEditRow()" />
      </div>
      <div class="col-6">
        <Button label="Отмена" class="button-error mb-2" @click="clearEditRow()" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IUserDto, EUserRole } from '@/api';
import { CToastMessage } from '@/model/IToastMessage';
import { CDialog } from '@/store/storeHelper/baseModel';
import { CHelperUsers } from '@/store/storeHelper/usersStoreHelper';

export default defineComponent({
  name: 'UpsertUserModal',
  props: {
    upsertRowProp: {} as PropType<IUserDto>,
    userRoleProp: [] as PropType<Array<EUserRole>>,
    dialogProp: {} as PropType<CDialog>,
  },
  data() {
    return {
      upsertRow: {} as IUserDto,
      userRole: [] as EUserRole[],
      CDialogs: {} as CDialog,
      storeHelper: new CHelperUsers(this.$store, 'users'),
    };
  },
  methods: {
    okEditRow() {
      this.storeHelper.actions.upsert(this.upsertRow).then(() => {
        this.$emit('okEditRow');
        this.$store.dispatch(
          'toastMessageState/success',
          new CToastMessage('Запись добавлена/изменена'),
        );
      });
    },
    clearEditRow() {
      this.$emit('clearEditRow');
    },
  },
  mounted() {
    this.upsertRow = this.upsertRowProp;
    this.userRole = this.userRoleProp;
    this.CDialogs = this.dialogProp;
  },
});
</script>
