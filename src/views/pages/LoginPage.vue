<script setup>
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import axiosServer from '../../utils/axios.js'
import FinisNotification from '../../components/FinisNotification/FinisNotification.js'
import { useUserStore } from '../../utils/pinia-stores/user.js'
import { jwtDecode } from 'jwt-decode'

const router = useRouter()
const userStore = useUserStore()

const username = ref('')
const password = ref('')

const login = () => {
  const form = document.querySelector('#login-form')
  if (form.checkValidity()) {
    axiosServer
      .post('/user/login', {
        name: username.value,
        password: password.value,
      })
      .then((res) => {
        if (res.data['isSuccess']) {
          const greeting = computed(() => {
            const hour = new Date().getHours()
            if (hour < 6) return '凌晨好'
            if (hour < 9) return '早上好'
            if (hour < 12) return '上午好'
            if (hour < 14) return '中午好'
            if (hour < 17) return '下午好'
            if (hour < 19) return '傍晚好'
            return '晚上好'
          })
          const token = res.data['data']['token']
          /** @type {{ sub: string, role: string, username: string, exp: number }} */
          const jwtPayload = jwtDecode(token)
          userStore.setLogin({
            token: token,
            userid: jwtPayload.sub,
            username: jwtPayload.username,
            role: jwtPayload.role,
          })
          FinisNotification({
            title: 'Success',
            message: `${greeting.value}，${username.value}`,
            type: 'Success',
          })
          router.push('/')
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          const hint = document.querySelector('.password-hint')
          hint.innerText = '用户名或密码不正确'
          const pwd = document.querySelector('.password')
          pwd.setCustomValidity('用户名或密码不正确')
        }
      })
  }
}
function toRegister() {
  router.push('/register')
}
</script>

<template>
  <div
    class="bg-base-200 flex min-h-screen items-center justify-center p-4 transition-colors duration-300"
  >
    <div
      class="bg-base-100 border-base-300/50 w-full max-w-sm rounded-2xl border p-8 shadow-xl"
    >
      <div class="mb-8 text-center">
        <div
          class="bg-primary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg p-2"
        >
          <img
            alt="logo"
            class="brightness-0 invert"
            src="/src/assets/icon.png"
          />
        </div>
        <h2 class="text-base-content text-xl font-bold">欢迎回来</h2>
        <p class="text-base-content/60 mt-1 text-xs">请输入您的账号信息</p>
      </div>

      <form
        id="login-form"
        class="grid gap-4"
        novalidate
        @submit.prevent="login"
      >
        <fieldset class="fieldset">
          <legend
            class="fieldset-legend text-base-content/80 text-xs font-semibold"
          >
            用户名
          </legend>
          <label class="input input-sm validator w-full">
            <svg
              class="h-[1em] opacity-50"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </g>
            </svg>
            <input
              v-model="username"
              placeholder="Username"
              required
              type="text"
            />
          </label>
          <p class="validator-hint text-error mt-1 hidden text-xs">
            请输入您的账号
          </p>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="mb-1 flex w-full items-center justify-between">
            <span
              class="fieldset-legend text-base-content/80 p-0 text-xs font-semibold"
              >密码</span
            >
            <a class="text-primary text-[10px] hover:underline" href="#"
              >忘记密码？</a
            >
          </legend>
          <label class="input input-sm validator w-full">
            <svg
              class="h-[1em] opacity-50"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
              >
                <rect height="11" rx="2" ry="2" width="18" x="3" y="11"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </g>
            </svg>
            <input
              v-model="password"
              class="password"
              placeholder="••••••••"
              required
              type="password"
            />
          </label>
          <p
            class="validator-hint password-hint text-error mt-1 hidden text-xs"
          >
            请输入密码
          </p>
        </fieldset>

        <button
          class="btn btn-primary btn-md shadow-primary/20 mt-2 w-full shadow-lg"
          type="submit"
        >
          登录
        </button>
      </form>

      <p class="text-base-content/50 mt-8 text-center text-[11px]">
        还没有账号？
        <a
          class="text-primary ml-1 font-bold hover:underline"
          href="/register"
          @click.prevent="toRegister"
          >立即注册</a
        >
      </p>
    </div>
  </div>
</template>

<style scoped></style>
