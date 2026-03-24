<script setup>
const props = defineProps({
  keyword: String,
});
import ArticleCard from '../../components/ArticleCard.vue';
import axiosServer from '../../utils/axios.js';
import { useInfiniteScroll } from '@vueuse/core';
import {  ref } from 'vue';
const canLoadMore = ref(true);
const articles = ref([]);
const articlesCountPerFetch = 10;
const articleListUrl = ((count) => {
  let url = `/article/list?count=${count}&lastId=${articles.value.at(-1)?.id || 0}`;
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
console.log(props.keyword);
useInfiniteScroll(
  window,
  async () => {
    fetchArticleList(articlesCountPerFetch)
  },
  {
    distance: 11,
    canLoadMore: () => {
      return canLoadMore.value;
    },
  },
);

</script>
<template>
  <div ref="el" class="gap-3">
    <div v-for="item in articles" :key="item">
      <ArticleCard v-bind="item"></ArticleCard>
    </div>
  </div>
</template>
