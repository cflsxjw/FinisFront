<script setup>
import axiosServer from '../utils/axios.js';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import articleCategoryToString from '../utils/converters.js';
const props = defineProps([
  'id',
  'articleCategory',
  'title',
  'summary',
  'authorId',
  'createdOn',
  'coverPath',
]);
const authorInfo = ref({
  authorName: '',
});
axiosServer.get(`/user/info/${props.authorId}`).then((res) => {
  const data = res.data['data'];
  authorInfo.value.authorName = data['name'];
});
const avatarUrl = computed(() => {
  return `/api/resource/avatar/${props.authorId}`;
});
const coverUrl = computed(() => {
  return `/api/resource/image/${props.coverPath}`;
});
</script>

<template>
  <div
    class="group card card-side h-fit max-w-4xl overflow-hidden border border-base-200 bg-base-100 shadow-sm transition-all hover:shadow-md"
  >
    <div class="card-body w-full p-4 md:w-1/3 group-hover:hover:bg-neutral/20">
      <div class="mb-1 flex items-center gap-2 text-xs font-semibold text-primary">
        <span>{{ articleCategoryToString(props.articleCategory) }}</span>
        <span class="text-base-content/20">|</span>
        <span class="font-normal text-base-content/50 normal-case">5 分钟阅读</span>
      </div>
      <a :href="`/article/${props.id}`" target="_blank">
        <div>
          <div class="card-title cursor-pointer text-xl leading-tight font-bold transition-colors" :title="props.title">
            {{ props.title }}
          </div>
          <p class="mt-3 line-clamp-2 text-base-content/70 md:line-clamp-3">
            {{ props.summary }}
          </p>
        </div>
      </a>
      <div class="mt-2 card-actions items-center justify-between border-t border-base-200 pt-4">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <div class="w-9 rounded-full">
              <img :src="avatarUrl" alt="头像" />
            </div>
          </div>
          <div>
            <a :href="`/space/${props.authorId}`" target="_blank">
              <div class="text-sm font-bold hover:text-primary">{{ authorInfo.authorName }}</div>
            </a>
            <div class="text-[10px] opacity-60">
              发布于 {{ dayjs(props.createOn).format('YYYY-MM-DD') }}
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button class="btn btn-square btn-ghost btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-5 w-5 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <figure class="hidden w-1/3 min-w-60 overflow-hidden md:block">
      <img
        :src="coverUrl"
        alt="封面"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </figure>
  </div>
</template>

<style scoped></style>
