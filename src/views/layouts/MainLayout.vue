<script setup>
import TopBarAvatarDropdown from "../../components/TopBarAvatarDropdown.vue";
import {useRouter} from "vue-router";

const router = useRouter();




</script>

<template>
  <nav class="p-4 bg-base-200 shadow flex gap-4 h-16 items-center text-xl">
    <div class="h-full bg-primary p-1 rounded-sm">
      <img src="/src/assets/icon.png" class="h-full brightness-0 invert" alt="logo"/>
    </div>
    <router-link to="/"
                 class="text-primary hover:bg-base-100 transition-all"
                 exact-active-class="font-bold text-2xl">首页</router-link>
    <router-link to="/about"
                 class="text-primary hover:bg-base-100 transition-all"
                 exact-active-class="font-bold text-2xl">关于</router-link>
    <button class="btn btn-primary ml-auto" @click="router.push('/editor')">发布文章</button>
    <TopBarAvatarDropdown/>
  </nav>
  <main class="p-6">
    <router-view></router-view>
  </main>
</template>

<style scoped>
</style>