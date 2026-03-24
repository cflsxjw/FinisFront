<script setup>
import {useUserStore} from "../utils/pinia-stores/user.js";
import {computed} from "vue";
import {useRouter} from "vue-router";
import axiosServer from "../utils/axios.js";

const router = useRouter();
const userStore = useUserStore();
const fullAvatarUrl = computed(() => {
  return `/api/Resource/avatar/${userStore.userid}`;
});
function onLoginButtonClick() {
  router.push("/login");
}
const onLogoutButtonClick = () => {
  axiosServer.post("/user/logout");
  userStore.setLogout();
}
</script>

<template>
  <div class="dropdown dropdown-end cursor-pointer" role="button" tabindex="0" v-if="userStore.isLogin">
    <img class="w-10 rounded-full hover:ring-4 ring-base-100" :src="fullAvatarUrl" alt="Avatar" />
    <ul class="dropdown-content menu w-44 bg-base-100 border-2 border-base-200 rounded-md shadow-lg mt-4">
      <li>
        <div class="flex items-center cursor-pointer gap-2 h-14" @click="router.push(`/space/${userStore.userid}`)">
          <div class="avatar flex">
            <img class="w-8 rounded-full" :src="fullAvatarUrl" alt="Avatar" />
          </div>
          <div>
            <div class="text-sm">个人主页</div>
            <div class="text-sm text-base-content/60">{{ userStore.username }}</div>
          </div>
        </div>
      </li>
      <li>
        <div class="flex items-center cursor-pointer h-8" @click="onLogoutButtonClick">
          退出登录
        </div>
      </li>
    </ul>
  </div>
  <button @click="onLoginButtonClick" class="btn btn-primary" v-if="!userStore.isLogin">注册 | 登录</button>
</template>

<style scoped>

</style>