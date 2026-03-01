<template>
  <MdPreview :id="id" :modelValue="text" theme="dark" />
</template>

<script setup>
import { ref } from 'vue';
import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

const id = 'preview-only';
const text = ref('- [x] 第三方');
const scrollElement = document.documentElement;
</script>
