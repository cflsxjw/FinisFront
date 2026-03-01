<script setup>
import {ref} from "vue";

// TODO: 从后端拉取 Tags
const tags = [
    "关注", "综合", "前端", "后端", "数据库", "人工智能", "Android", "IOS"
];
const currentTag = ref(tags[1]);
</script>

<template>
<ul class="menu bg-base-300 text-xl rounded-lg">
  <li class="menu-title">文章分类</li>
  <li v-for="tag in tags" :key="tag"
      :class="{'menu-active': currentTag === tag }" @click="currentTag = tag"
      class="rounded-lg">
   <a>{{tag}}</a>
  </li>
</ul>
</template>

<style scoped>

</style>