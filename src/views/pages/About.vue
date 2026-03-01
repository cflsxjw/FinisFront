<script setup>
import axiosServer  from "../../utils/axios.js";
import {ref} from "vue";
import FinisNotification from "../../components/FinisNotification/FinisNotification.js";
import ArticleView from "../../components/ArticleView.vue";
import ArticleCard from "../../components/ArticleCard.vue";

const text = ref("");
axiosServer("/user/hello/1")
    .then(res => {
      text.value = res.data['data'];
    })

function toast() {
  FinisNotification({
    title: 'Success',
    message: '登录成功',
    type: "Success"
  });
}
function toast2() {
  FinisNotification({
    title: 'Error',
    message: '登录失败',
    type: "Error"
  });
}
</script>

<template>
<h1 class="text-7xl font-bold">{{text}}</h1>
  <ArticleCard></ArticleCard>
</template>

<style scoped>

</style>