<script setup>
import TopBarAvatarDropdown from '../../components/TopBarAvatarDropdown.vue';
import { useRoute, useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import ThemeButton from '../../components/ThemeButton.vue';
const router = useRouter();
const route = useRoute();
const keyword = ref('');
const handleSearch = () => {
  if (keyword.value.trim() != '') {
    router.push({
    path: '/search', 
    query: { 
      query: keyword.value,      // 搜索词
      type: 'article', // 过滤类型
      page: 1          // 初始页码
    }
  });
  }
};
watch(
  () => route.path,
  (newPath, oldPath) => {
    if (oldPath === '/search' && newPath !== '/search') {
      keyword.value = '';
    }
  }
);
</script>

<template>
  <div class="flex flex-col">
    <nav class="sticky top-0 z-10 flex h-16 items-center gap-4 bg-base-200 p-4 text-xl shadow">
      <div class="h-full rounded-sm bg-primary p-1">
        <img src="/src/assets/icon.png" class="h-full brightness-0 invert" alt="logo" />
      </div>
      <router-link to="/" class="font-bold text-primary transition-all hover:bg-base-100"
        >首页</router-link
      >
      <router-link to="/about" class="font-bold text-primary transition-all hover:bg-base-100"
        >关于</router-link
      >
      <label class="input input-sm pr-0 py-1">
        <input type="search" class="grow" placeholder="Search" v-model="keyword" />
        <button class="btn h-full btn-ghost btn-sm" @click="handleSearch">
          <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke-width="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
        </button>
      </label>
      <button class="btn ml-auto btn-primary" @click="router.push('/editor')">写文章</button>
      <ThemeButton></ThemeButton>
      <TopBarAvatarDropdown />
    </nav>
    <main class="flex-1">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped></style>
