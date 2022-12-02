<template>
  <Dialog
    v-model:visible="CDialog.value"
    header="Сменить пароль"
    :style="{ width: '450px' }"
    :modal="true"
    class="p-fluid spc"
    :closable="false"
  >
    <div class="grid">
      <div class="col-12 field">
        <Password
          v-model="passwordFormNew.input1"
          promptLabel="Введите пароль"
          weakLabel="Слабый"
          mediumLabel="Средний"
          strongLabel="Сильный"
          toggleMask
        >
          <template #footer>
            <Divider />
            <p class="mt-2">Совет</p>
            <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
              <li>По крайней мере, одна строчная буква</li>
              <li>По крайней мере, одна заглавная буква</li>
              <li>Минимум 6 символов</li>
            </ul>
          </template>
        </Password>
      </div>
      <div class="col-12 field">
        <Password
          v-model="passwordFormNew.input2"
          promptLabel="Введите пароль"
          weakLabel="Слабый"
          mediumLabel="Средний"
          strongLabel="Сильный"
          toggleMask
        >
          <template #footer>
            <Divider />
            <p class="mt-2">Совет</p>
            <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
              <li>По крайней мере, одна строчная буква</li>
              <li>По крайней мере, одна заглавная буква</li>
              <li>Минимум 6 символов</li>
            </ul>
          </template>
        </Password>
      </div>
      <div class="col-6">
        <Button label="Сохранить" class="button-add" @click="okEditPassword()" />
      </div>
      <div class="col-6">
        <Button label="Отмена" class="button-error mb-2" @click="offEditPassword()" />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CToastMessage } from '@/model/IToastMessage';
import { CDialog } from '@/store/storeHelper/baseModel';
import { CHelperUsers, CPasswordFormNew } from '@/store/storeHelper/usersStoreHelper';

export default defineComponent({
  name: 'UpsertUserPassword',
  props: {
    upsertRowUID: String,
    dialogProp: {} as PropType<CDialog>,
  },
  data() {
    return {
      passwordFormNew: new CPasswordFormNew(),
      CDialog: {} as CDialog,
      storeHelper: new CHelperUsers(this.$store, 'users'),
    };
  },
  methods: {
    okEditPassword() {
      try {
        if (this.passwordFormNew.input1 !== this.passwordFormNew.input2) {
          throw new Error('Пароли не совпадают');
        }
        /**Выполняем запрос на обновление пароля */
        this.storeHelper.actions
          .upsertPass(this.passwordFormNew.input1, this.upsertRowUID)
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
    offEditPassword() {
      this.CDialog.value = false;
      this.passwordFormNew.input1 = '';
      this.passwordFormNew.input2 = '';
      this.$emit('upsertRowRefresh');
    },
  },
  mounted() {
    this.CDialog = this.dialogProp;
  },
});
</script>
