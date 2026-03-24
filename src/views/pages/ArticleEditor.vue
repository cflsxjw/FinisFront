<script setup>
import { ref } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import axiosServer from '../../utils/axios.js';
import API_HOST from '../../constants.js';
import { useFileDialog } from '@vueuse/core';
import { useUserStore } from '../../utils/pinia-stores/user.js';
import { isDark } from '../../main.js';

const userStore = useUserStore();
const text = ref('');
const title = ref('');
const summary = ref('');
// dropdown 状态，防止意外关闭
const dropdownOpen = ref(false);
// tags
const tags = ref([]);
const coverPath = ref(null);

// 编辑器图片上传
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
      const path = res.data['data']['path'];
      return `${API_HOST}/${path}`;
    });
    callback(urls);
  } catch (error) {
    console.error('图片上传失败:', error);
  }
};

//编辑器保存
const onSave = (v, h) => {
  console.log(v);

  h.then((html) => {
    console.log(html);
  });
};

// 获取 Tags
axiosServer.get('/article/categories').then((res) => {
  tags.value = res.data['data'];
});
const selectedTag = ref('');

// 封面上传
const previewUrl = ref('');
const { open, onChange, reset } = useFileDialog({
  accept: 'image/*',
  multiple: false,
});

onChange((files) => {
  if (files?.[0]) {
    const form = new FormData();
    form.append('file', files[0]);
    axiosServer.post('/resource/upload/image', form).then((res) => {
      coverPath.value = res.data['data']['path'];
      if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
      previewUrl.value = URL.createObjectURL(files[0]);
    });
  }
});
// 文章提交
const submitArticle = () => {
  const form = document.querySelector('#article-info-form');
  if (form.checkValidity()) {
    const data = {
      title: title.value,
      category: tags.value.indexOf(selectedTag.value),
      summary: summary.value,
      content: text.value,
      authorId: userStore.userid,
      coverPath: coverPath.value,
    };
    axiosServer.post('/article/post', data);
  }
};
</script>
<template>
  <div class="flex h-screen flex-col">
    <div class="flex w-full items-center">
      <div class="flex h-full w-20 items-center justify-center bg-base-300 text-xl font-bold">
        标题
      </div>
      <input
        class="input input-lg flex-1 input-ghost outline-0"
        v-model="title"
        placeholder="请输入标题"
      />
      <!-- 提交 Dropdown -->
      <div
        class="dropdown dropdown-end mx-2"
        :class="dropdownOpen ? 'dropdown-open' : 'dropdown-close'"
      >
        <button class="btn btn-primary" @click="dropdownOpen = true">发布文章</button>
        <div
          tabindex="0"
          class="dropdown-content z-10 mt-2 w-96 rounded-md border-2 border-base-200 bg-base-100 p-6 shadow-md"
        >
          <div class="font-bold">请填写文章信息</div>
          <div class="divider"></div>
          <form id="article-info-form" novalidate>
            <fieldset>
              <legend class="fieldset-legend text-sm">分类</legend>
              <div
                class="mx-0.5 badge cursor-pointer badge-outline badge-neutral"
                tabindex="0"
                v-for="tag in tags"
                :key="tag"
                :class="{ 'badge-primary': selectedTag === tag }"
                role="button"
                @click="selectedTag = tag"
              >
                {{ tag }}
              </div>
            </fieldset>
            <fieldset class="fieldset">
              <legend class="fieldset-legend text-sm">封面图 (可选)</legend>
              <div
                class="group relative h-32 w-full cursor-pointer overflow-hidden rounded-lg border-2 border-dashed border-base-300 bg-base-200/50 transition-all hover:border-primary"
              >
                <div @click="open()" class="h-full w-full">
                  <template v-if="previewUrl">
                    <img :src="previewUrl" class="h-full w-full object-cover" alt="封面预览" />
                    <div
                      class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <span class="text-xs font-bold text-white">更换封面</span>
                    </div>
                  </template>
                  <div
                    v-else
                    class="flex h-full flex-col items-center justify-center text-base-content/40"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="mb-1 h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span class="text-xs">点击上传封面</span>
                  </div>
                </div>
                <button
                  v-if="previewUrl"
                  @click.stop="
                    previewUrl = null;
                    reset();
                    coverPath = null;
                  "
                  class="absolute top-2 right-2 z-10 rounded-full bg-base-100/80 p-1 shadow-sm transition-colors hover:bg-error hover:text-error-content"
                  title="移除图片"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p class="mt-1 text-[10px] opacity-50">建议尺寸 16:9，小于 5MB</p>
            </fieldset>
            <fieldset>
              <legend class="fieldset-legend text-sm">文章摘要</legend>
              <textarea
                type="text"
                class="validator input h-32 w-full wrap-break-word whitespace-pre-wrap"
                v-model="summary"
                placeholder="summary"
                required
                maxlength="100"
              />
              <div class="flex justify-between">
                <p class="mt-1 text-[10px] opacity-50">100字以内</p>
                <p class="mt-1 text-[10px] opacity-50">{{ summary.length }}/100</p>
              </div>
            </fieldset>
            <div class="mt-4 flex w-full justify-between">
              <button type="button" class="btn btn-neutral" @click="dropdownOpen = false">
                取消发布
              </button>
              <button type="submit" class="btn btn-primary" @click.prevent="submitArticle">
                确认发布
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <MdEditor
      class="editor flex-1"
      v-model="text"
      :theme="isDark ? 'dark' : 'default'"
      @onSave="onSave"
      @onUploadImg="onUploadImg"
    />
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
