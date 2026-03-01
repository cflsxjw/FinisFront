<script setup>
import {ref} from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import axiosServer from "../../utils/axios.js";
import API_HOST from "../../constants.js";
const text = ref('')
const theme = ref('dark')
const onUploadImg = async (files, callback) => {
  try {
    const uploadPromises = files.map((file) => {
      const form = new FormData();
      form.append('file', file);
      return axiosServer.post('/resource/upload/image', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    });
    const responses = await Promise.all(uploadPromises);
    const urls = responses.map((res) => {
      const path = res.data['data'];
      return `${API_HOST}/${path}`;
    });
    callback(urls);
  } catch (error) {
    console.error('图片上传失败:', error);
  }
};

const onSave = (v, h) => {
  console.log(v);

  h.then((html) => {
    console.log(html);
  });
};
</script>
<template>
  <div class="h-screen flex flex-col">
    <div class="flex w-full items-center">
      <div class="flex w-20 items-center justify-center text-xl bg-base-300 h-full font-bold">
        标题
      </div>
      <input class="input input-lg input-ghost outline-0 flex-1" placeholder="请输入标题">
      <button class="btn btn-primary">提交</button>
    </div>
    <MdEditor class="editor flex-1" v-model="text" :theme="theme" @onSave="onSave" @onUploadImg="onUploadImg"/>
  </div>

</template>


<style scoped>
:deep(.md-editor-preview ul) {
  list-style: disc !important;
  padding-left: 2em !important;
}

:deep(.md-editor-preview ol) {
  list-style: decimal !important;
  padding-left: 2em !important;
}
</style>