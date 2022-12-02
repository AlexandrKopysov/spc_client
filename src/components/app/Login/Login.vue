<template>
  <div class="grid spc-login">
    <div class="col-fixed">
      <div class="logo">
        <img src="/assets/SB-logo.png" />
      </div>
      <div class="form">
        <div class="grid">
          <!-- <div class="col-12 form-header">Авторизируйтесь в сервисе</div> -->
          <div class="col-12 form-label">Логин</div>
          <div class="col-12">
            <InputText
              v-model="userReq.username"
              v-on:keyup.enter="login()"
              type="text"
              placeholder="Login"
              class="w-12"
            ></InputText>
          </div>
          <div class="col-12 form-label">Пароль</div>
          <div class="col-12">
            <InputText
              v-model="userReq.password"
              v-on:keyup.enter="login()"
              type="password"
              placeholder="Password"
              class="w-12"
            ></InputText>
          </div>
          <div class="col-12 form-button-enter">
            <Button type="button" @click="login()" class="justify-content-center">Войти</Button>
            <!-- <a href="" class="">Восстановаление пароля</a> -->
          </div>
        </div>
      </div>
    </div>
    <Message v-for="msg of errorMessages" :severity="msg.severity" :key="msg.content">{{
      msg.content
    }}</Message>
    <ToastComponent position="bottom-right" group="br" />
  </div>
</template>

<script lang="ts">
import { IAuthReqDto } from '@/api';
import { defineComponent } from 'vue';

interface TextMessage {
  severity: 'success' | 'info' | 'warn' | 'error' | undefined;
  content: string;
}

export default defineComponent({
  name: 'Login',
  data() {
    return {
      errorMessages: [] as TextMessage[],
      userReq: {
        username: '',
        password: '',
      } as IAuthReqDto,
    };
  },
  methods: {
    login() {
      if (this.userReq.username && this.userReq.password) {
        this.$store.dispatch('user/logIn', this.userReq);
      }
    },
  },
});
</script>

<style scoped lang="less">
@import url(./login.less);
</style>
