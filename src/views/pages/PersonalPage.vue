<script setup>
import axiosServer from '../../utils/axios.js';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../utils/pinia-stores/user.js';
const userStore = useUserStore();
const props = defineProps(['id']);
const router = useRouter();
const pageLoading = ref(true);
const pageData = ref({
  name: '',
  description: '',
  viewCount: 0,
  likeCount: 0,
  articleCount: 0,
});
axiosServer
  .get(`/user/info/${props.id}`)
  .then((res) => {
    pageLoading.value = false;
    pageData.value = res.data['data'];
    document.title = `${pageData.value.name} 的个人主页`
  })
  .catch((err) => {
    if (err.response.status === 404) {
      router.push('/notfound');
    }
  });
const avatarUrl = computed(() => `/api/resource/avatar/${props.id}`);
const isOwner = computed(() => props.id === userStore.userid);
const toModifyPersonalData = () => {
  router.push('/setting');
};
</script>

<template>
  <div class="h-full bg-base-100 px-4 py-8" v-if="!pageLoading">
    <div class="mx-auto max-w-6xl space-y-6">
      <div class="card overflow-visible bg-base-200 shadow-lg">
        <div class="card-body rounded-lg border-2 border-primary/40">
          <div class="flex items-center gap-6">
            <div class="group avatar relative h-32 w-32 rounded-full">
              <img :src="avatarUrl" class="rounded-full" alt="头像" />
            </div>
            <div class="flex-1 pb-2">
              <h1 class="text-3xl font-bold text-base-content">{{ pageData.name }}</h1>
              <p class="mt-1 text-base-content/70">{{ pageData.description || '' }}</p>
            </div>
            <button class="btn btn-primary" v-if="isOwner" @click="toModifyPersonalData">
              修改资料
            </button>
            <div class="flex gap-2 pb-2" v-if="!isOwner">
              <button class="btn btn-sm btn-primary">关注</button>
              <button class="btn btn-outline btn-sm">私信</button>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-4 space-y-6">
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body rounded-lg border-2 border-dashed border-primary/40">
              <div class="stats mt-2 stats-vertical shadow-none">
                <div class="stat px-0">
                  <div class="stat-title">文章</div>
                  <div class="stat-value text-2xl text-primary">{{ pageData.articleCount }}</div>
                </div>
                <div class="stat px-0">
                  <div class="stat-title">文章被阅读</div>
                  <div class="stat-value text-2xl text-primary">{{ pageData.viewCount }}</div>
                </div>
                <div class="stat px-0">
                  <div class="stat-title">获赞</div>
                  <div class="stat-value text-2xl text-primary">{{ pageData.likeCount }}</div>
                </div>
                <div class="stat px-0">
                  <div class="stat-title">被收藏</div>
                  <div class="stat-value text-2xl text-primary">{{ pageData.viewCount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-span-8">
          <div class="card h-full rounded-lg border-2 border-primary/40 bg-base-200 shadow-xl">
            <div class="tabs-lifted tabs p-6 pb-0">
              <a class="tab-active tab">发布的文章</a>
              <a class="tab">收藏夹</a>
              <a class="tab">关于我</a>
            </div>
            <div class="card-body pt-4">
              <div class="space-y-4">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="cursor-pointer rounded-lg border border-base-100 p-4 transition-colors hover:bg-base-200/50"
                >
                  <div class="mb-2 h-4 w-1/3 rounded bg-base-100"></div>
                  <div class="h-3 w-full rounded bg-base-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
