<template>
  <router-view class="spc" />
  <ConfirmDialog class="spc"></ConfirmDialog>
</template>

<script lang="ts">
import { IAuthResDto } from '@/api';
import axios from './services/axios.service';
import { defineComponent } from 'vue';
// import { checkPhone } from './services/checkPhone.service';
export default defineComponent({
  name: 'Login',
  beforeCreate() {
    // checkPhone();

    const { access_token } = this.$store.state.user.user;
    if (access_token?.length) {
      axios.defaults.headers['Authorization'] = `Bearer ${access_token}`;
      return;
    }
    document.title = 'Авторизация';
  },
  watch: {
    '$store.state.user.user'(newVal: IAuthResDto) {
      if (newVal?.access_token) {
        this.$router.push('/');
        return;
      }
      this.$router.push('/login');
    },
  },
});
</script>

<style lang="less">
@import 'primeflex/primeflex.css';
@import url(primevue/resources/themes/saga-blue/theme.css);
@import url(primevue/resources/primevue.min.css);
@import url(primeicons/primeicons.css);
@import url(style-ui-cit/spc-main.less);
@font-face {
  font-family: 'Roboto';
  src: local('Roboto'), url(../public/assets/fonts/roboto/Roboto-Regular.ttf) format('truetype');
}

#app {
  font-family: 'Roboto';
  color: #000000;
  font-size: @font-size-global;
  font-weight: normal;
  font-style: normal;
  line-height: 20px;
  width: 100%;
  height: 100%;
}

html {
  width: 100%;
  height: 100%;
}

body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  overflow: hidden;
}

h1,
h2,
h3 {
  margin: 0;
}

a {
  text-decoration: none;
}

nav {
  padding: 30px;
  a {
    font-weight: bold;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
