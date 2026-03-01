<script setup>
import {useRouter} from "vue-router";
import {computed, ref} from "vue";
import axiosServer from "../../utils/axios.js";
import FinisNotification from "../../components/FinisNotification/FinisNotification.js";
import {useUserStore} from "../../utils/pinia-stores/user.js";
import {jwtDecode} from "jwt-decode";

const router = useRouter();
const userStore = useUserStore();

const username = ref('');
const password = ref('');

const login = () => {
  const form = document.querySelector("#login-form");
  if (form.checkValidity()) {
    axiosServer.post("/user/login", {
      name: username.value,
      password: password.value,
    }).then(res => {
      if (res.data['isSuccess']) {
        const greeting = computed(() => {
          const hour = new Date().getHours();
          if (hour < 6) return "凌晨好";
          if (hour < 9) return "早上好";
          if (hour < 12) return "上午好";
          if (hour < 14) return "中午好";
          if (hour < 17) return "下午好";
          if (hour < 19) return "傍晚好";
          return "晚上好";
        });
        /** @type {{ sub: string, role: string, username: string, exp: number }} */
        const jwtPayload = jwtDecode(res.data['data']);
        const payload = {
          token: res.data['data'],
          userid: jwtPayload.sub,
          username: jwtPayload.name,
          role: jwtPayload.role,
        }
        console.log(payload)
        userStore.setLogin({
          token: res.data['data'],
          userid: jwtPayload.sub,
          username: jwtPayload.username,
          role: jwtPayload.role,
        })
        FinisNotification({
          title: "Success",
          message: `${greeting.value}，${username.value}`,
          type: "Success"
        })
        router.push("/");
      }
    }).catch(err => {
      if (err.response.status === 401) {
        const hint = document.querySelector('.password-hint');
        hint.innerText = '用户名或密码不正确';
        const pwd = document.querySelector(".password")
        pwd.setCustomValidity('用户名或密码不正确');
      }
    })
  }

}
function toRegister() {
  router.push("/register");
}
</script>

<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4 transition-colors duration-300">
    <div class="w-full max-w-sm bg-base-100 rounded-2xl shadow-xl p-8 border border-base-300/50">
      <div class="text-center mb-8">
        <div class="w-12 h-12 bg-primary rounded-lg mx-auto mb-3 flex items-center justify-center p-2">
          <img src="/src/assets/icon.png" alt="logo" class="brightness-0 invert"/>
        </div>
        <h2 class="text-xl font-bold text-base-content">欢迎回来</h2>
        <p class="text-xs text-base-content/60 mt-1">请输入您的账号信息</p>
      </div>

      <form novalidate id="login-form" class="grid gap-4" @submit.prevent="login">
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-xs font-semibold text-base-content/80">用户名</legend>
          <label class="input input-sm validator w-full">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></g></svg>
            <input v-model="username" type="text" placeholder="Username" required />
          </label>
          <p class="validator-hint hidden text-xs text-error mt-1">请输入您的账号</p>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="flex justify-between items-center mb-1 w-full">
            <span class="fieldset-legend text-xs font-semibold text-base-content/80 p-0">密码</span>
            <a href="#" class="text-[10px] text-primary hover:underline">忘记密码？</a>
          </legend>
          <label class="input input-sm validator w-full">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></g></svg>
            <input v-model="password" class="password" type="password" placeholder="••••••••" required />
          </label>
          <p class="validator-hint password-hint hidden text-xs text-error mt-1">请输入密码</p>
        </fieldset>

        <button type="submit" class="btn btn-primary btn-md w-full mt-2 shadow-lg shadow-primary/20">
          登录
        </button>
      </form>

      <p class="text-center text-[11px] text-base-content/50 mt-8">
        还没有账号？
        <a href="/register" @click.prevent="toRegister" class="text-primary font-bold hover:underline ml-1">立即注册</a>
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>