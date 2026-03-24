<script setup>
import { computed, reactive, ref } from 'vue';
import { useUserStore } from '../../utils/pinia-stores/user.js';
import { useFileDialog } from '@vueuse/core';
import FinisNotification from '../../components/FinisNotification/FinisNotification.js';
import axiosServer from '../../utils/axios.js';
const userStore = useUserStore();
const avatarUrl = computed(() => `/api/resource/avatar/${userStore.userid}`);
const changedAvatarUrl = computed(() => `/api/resource/image/${pageData.value.changedAvatar}`);
const pageLoading = ref(true);
const pageData = ref({
  changedAvatar: null,
  name: null,
  email: null,
  description: null,
});
const { open, reset, onCancel, onChange } = useFileDialog({
  multiple: false,
  accept: 'image/*',
  directory: false,
});
const previewAvatar = ref(null);
axiosServer.get(`/user/setting`).then((res) => {
  pageData.value = res.data['data'];
  pageLoading.value = false;
});
onChange(async (files) => {
  if (files?.[0]) {
    let clipped;
    try {
      clipped = await clipImageSquare(files[0], 360);
    } catch (error) {
      FinisNotification({
        title: 'Error',
        message: '头像转换失败',
        type: 'Error',
      });
      return;
    }
    const form = new FormData();
    form.append('file', clipped);
    try {
      const res = await axiosServer.post('/resource/upload/avatar', form);
      pageData.value.changedAvatar = res.data['data']['path'];
    } catch (error) {
      FinisNotification({
        title: 'Error',
        message: '头像上传失败',
        type: 'Error',
      });
      return;
    }
    if (previewAvatar.value) {
      URL.revokeObjectURL(previewAvatar.value);
    }
    previewAvatar.value = URL.createObjectURL(clipped);
  }
});
const clipImageSquare = (file, targetSize, fileName = 'image.jpg') => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const context = canvas.getContext('2d');
      const imgW = img.width;
      const imgH = img.height;
      let sx, sy, sWidth, sHeight;
      if (imgW > imgH) {
        sWidth = imgH;
        sHeight = imgH;
        sx = (imgW - imgH) / 2;
        sy = 0;
      } else {
        sWidth = imgW;
        sHeight = imgW;
        sx = 0;
        sy = (imgH - imgW) / 2;
      }
      context.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetSize, targetSize);
      canvas.toBlob(
        (blob) => {
          const file = new File([blob], fileName, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(file);
        },
        'image/jpeg',
        0.9,
      );
    };
    img.onerror = (e) => {
      FinisNotification({
        title: 'Error',
        message: '图片获取失败',
        type: 'Error',
      });
    };
  });
};
const submitChanges = () => {
  console.log(pageData.value.changedAvatar);
  axiosServer.post('/user/setting/update', {
    name: pageData.value.name,
    email: pageData.value.email,
    description: pageData.value.description ?? null,
    avatar: pageData.value.changedAvatar ?? null,
  });
  userStore.username = pageData.value.name;
};
const changePassword = () => {
  document.querySelector('#change_password_modal')?.showModal();
};
</script>

<template>
  <div class="card mx-auto mt-16 max-w-5xl bg-base-200" v-if="!pageLoading">
    <div class="mb-2 flex flex-row p-6">
      <div class="card-title w-full">修改资料</div>
      <button class="btn ml-auto btn-primary" @click="submitChanges">保存修改</button>
    </div>

    <div class="card-body gap-8 px-8 py-4">
      <div class="flex flex-row items-center">
        <h2 class="mr-4 w-16">头像</h2>
        <div class="group avatar relative cursor-pointer" @click="open">
          <img
            :src="pageData.changedAvatar ? previewAvatar : avatarUrl"
            class="w-12 rounded-full"
            alt="头像"
          />
          <div
            class="absolute top-0 left-0 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
              />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>
        </div>
      </div>
      <div class="flex flex-row items-center">
        <h2 class="mr-4 w-16">用户名</h2>
        <input class="input" v-model="pageData.name" />
      </div>
      <div class="flex flex-row items-center">
        <h2 class="mr-4 w-16">邮箱</h2>
        <input class="input" v-model="pageData.email" />
      </div>
      <div class="flex flex-row items-center">
        <h2 class="mr-4 w-16">个人签名</h2>
        <input class="input" placeholder="还没有个人签名" v-model="pageData.description" />
      </div>
      <div class="flex flex-row items-center">
        <h2 class="mr-4 w-16">密码</h2>
        <button class="btn btn-outline" @click="changePassword">修改密码</button>
        <dialog id="change_password_modal" class="modal">
          <div class="modal-box flex flex-col gap-4">
            <h3 class="mb-4 text-lg font-bold">修改密码</h3>
            <div class="flex flex-row items-center">
              <h2 class="mr-4 w-16">原密码</h2>
              <input class="input" />
            </div>
            <div class="flex flex-row items-center">
              <h2 class="mr-4 w-16">新密码</h2>
              <input class="input" />
            </div>
            <div class="flex flex-row items-center">
              <h2 class="mr-4 w-16">重复密码</h2>
              <input class="input" />
            </div>
            <div class="modal-action">
              <form method="dialog" class="flex gap-4">
                <button class="btn">取消</button>
                <button class="btn btn-primary">确认</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
