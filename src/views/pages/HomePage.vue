<script setup>
import ArticleCard from '../../components/ArticleCard.vue';
import { useInfiniteScroll } from '@vueuse/core';
import {  ref, useTemplateRef } from 'vue';
import axiosServer from '../../utils/axios.js';
const el = useTemplateRef('el');
const articles = ref([]);
const currentIndex = ref(0);
const articlesCountPerFetch = 10;
const canLoadMore = ref(true);
const articleListUrl = ((count) => {
  let url = `/article/list?count=${count}&lastId=${articles.value.at(-1)?.id || 0}`;
  if (currentIndex.value !== 0) {
    url += `&category=${currentIndex.value - 1}`;
  }
  return url;
});
const fetchArticleList = async (count) => {
  let newArticles = [];
  await axiosServer.get(articleListUrl(count)).then((res) => {
    newArticles = [...res.data.data];
  });
  if (newArticles.length < articlesCountPerFetch) {
    canLoadMore.value = false;
  }
  articles.value.push(...newArticles);
};
useInfiniteScroll(
  window,
  async () => {
    fetchArticleList(articlesCountPerFetch)
  },
  {
    distance: 10,
    canLoadMore: () => {
      return canLoadMore.value;
    },
  },
);

const tags = ref(['推荐']);

axiosServer.get('/article/categories').then((res) => {
  tags.value = ['推荐', ...res.data['data']];
  console.log(tags);
});
</script>

<template>
  <div class="container grid grid-cols-[1fr_3fr] gap-4">
    <ul class="menu sticky top-20 mt-5 h-128 rounded-lg bg-base-300 text-xl">
      <li class="menu-title">文章分类</li>
      <li
        v-for="(tag, index) in tags"
        :key="index"
        :class="{ 'menu-active': tags[currentIndex] === tag }"
        @click="
          currentIndex = index;
          articles = [];
          fetchArticleList(10);
        "
        class="rounded-lg"
      >
        <a>{{ tag }}</a>
      </li>
    </ul>
    <div ref="el" class="gap-3">
      <div v-for="item in articles" :key="item">
        <ArticleCard v-bind="item"></ArticleCard>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
