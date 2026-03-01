<script setup>
import axiosServer from "../../utils/axios.js";
import FinisNotification from "../../components/FinisNotification/FinisNotification.js";
import {useRouter} from "vue-router";
import {ref} from "vue";
const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const repeatPassword = ref('');

const checkPwd = () => {
  const cfpwd = document.querySelector('.confirm-password');
  if (cfpwd) {
    const isMatch = password.value === repeatPassword.value;
    cfpwd.setCustomValidity(isMatch ? '' : '密码不匹配');
  }
};
const register = () => {
  const form = document.getElementById("form");
  if (form.checkValidity()) {
    axiosServer.post('/user/register', {
      name: username.value,
      email: email.value,
      password: password.value,
    }).then(res => {
      console.log(res);
          const data = res.data
          console.log(data)
          if (data['isSuccess']) {
            FinisNotification({
              title: 'Success',
              message: data['message'],
              type: 'Success'
            });
            router.push('/login');
          }
        })
        .catch(error => {

        });
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4 transition-colors duration-300">
    <div class="w-full max-w-sm bg-base-100 rounded-2xl shadow-xl p-8 border border-base-300/50">
      <div class="text-center mb-8">
        <div class="w-12 h-12 bg-primary rounded-lg mx-auto mb-3 flex items-center justify-center p-2">
          <img src="/src/assets/icon.png" alt="logo" class="brightness-0 invert"/>
        </div>
        <h2 class="text-xl font-bold text-base-content">创建账号</h2>
        <p class="text-xs text-base-content/60 mt-1">请输入您的注册信息</p>
      </div>

      <form novalidate id="form" class="grid gap-4" @submit.prevent="register">
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-xs font-semibold text-base-content/80">用户名</legend>
          <label class="input input-sm validator w-full">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></g></svg>
            <input type="text" v-model="username" placeholder="Username" required minlength="3" pattern="[A-Za-z0-9]+" />
          </label>
          <p class="validator-hint hidden text-xs text-error mt-1">请输入至少3位字母或数字</p>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend text-xs font-semibold text-base-content/80">邮箱</legend>
          <label class="input input-sm validator w-full">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
            <input type="text" v-model="email" placeholder="mail@site.com" required pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$" />
          </label>
          <div class="validator-hint hidden text-xs text-error mt-1">请输入正确的邮箱格式</div>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend text-xs font-semibold text-base-content/80">密码</legend>
          <label class="input input-sm validator w-full">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></g></svg>
            <input type="password" v-model="password" class="password" placeholder="••••••••" required minlength="8" @input="checkPwd" />
          </label>
          <div class="validator-hint hidden text-xs text-error mt-1">密码长度不能少于8位</div>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-xs font-semibold text-base-content/80">确认密码</legend>
          <label class="input input-sm validator w-full">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></g></svg>
            <input type="password" v-model="repeatPassword" class="confirm-password" placeholder="••••••••" required @input="checkPwd" />
          </label>
          <div class="validator-hint hidden text-xs text-error mt-1">两次输入的密码不一致</div>
        </fieldset>
        <button type="submit" class="btn btn-primary btn-md w-full mt-2 shadow-lg shadow-primary/20">
          立即注册
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>