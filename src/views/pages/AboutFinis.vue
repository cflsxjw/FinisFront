<script setup>
import axiosServer from '../../utils/axios.js';
import AiChatBox from '../../components/AiChatBox.vue'
import { ref } from 'vue';

const text = ref('');
axiosServer('/user/hello/1').then((res) => {
  text.value = res.data['data'];
});


</script>

<template>
  <h1 class="text-7xl font-bold">{{ text }}</h1>
  <AiChatBox class="h-96"></AiChatBox>
</template>

<style scoped></style>
