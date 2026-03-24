<script setup>
import { isDark } from '../../main.js';
import axiosServer from '../../utils/axios.js';
import { computed, ref } from 'vue';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../utils/pinia-stores/user.js';
import RootCommentBox from '../../components/RootCommentBox.vue';
import AiChatBox from '../../components/AiChatBox.vue';
const router = useRouter();
const props = defineProps(['id']);
const list = ref([]);
const pageLoading = ref(true);
const commentData = ref([]);
const commentText = ref('');
const pageData = ref({
  title: '',
  content: '',
  authorId: '',
  createdOn: '',
  lastModifiedOn: '',
  categoryDisplay: '',
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  bookmarkCount: 0,
  authorName: '',
  isLiked: false,
  isBookmarked: false,
});
const getCommentsData = () => {
  axiosServer.get(`/article/comment/list/${props.id}`).then((res) => {
    const data = res.data['data'];
    commentData.value = data;
  });
};

const fullAvatarUrl = computed(() => {
  if (!pageData.value.authorId) return;
  return `/api/Resource/avatar/${pageData.value.authorId}`;
});

const getCatalog = (l) => {
  list.value = l;
};
const mdHeadingId = ({ index }) => `heading-${index}`;
const scrollTo = (index) => {
  index = index + 1;
  const element = document.getElementById(`heading-${index}`);
  console.log(`scroll to: heading-${index}`);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      top: 80,
    });
  }
};
const scrollToTop = () => {
  document.querySelector('#top').scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};
const goComment = () => {
  document.getElementById('comment-drawer').checked = true;
};
const userStore = useUserStore();
const userAvatarUrl = computed(() => {
  return `/api/Resource/avatar/${userStore.userid}`;
});
const submitComment = () => {
  const form = document.querySelector('#comment-form');
  const textArea = document.querySelector('.comment-area');
  if (form.checkValidity()) {
    const data = {
      articleId: props.id,
      content: commentText.value,
    };
    axiosServer.post('/article/comment/post', data).then((res) => {
      if (res.status == 200 && res.data['isSuccess'] === true) {
        getCommentsData();
      } else {
        console.log(res.data['isSuccess']);
      }
    });
  } else {
    textArea.setCustomValidity(commentText.value === '' ? 'required' : '');
    console.log('Required');
  }
};
const onLikeArticle = () => {
  axiosServer.post(`/article/like/${props.id}`);
  pageData.value.likeCount += pageData.value.isLiked ? -1 : 1;
  pageData.value.isLiked = !pageData.value.isLiked;
};

// 以下是执行部分

axiosServer
  .get(`/article/fetch/${props.id}`)
  .then((res) => {
    const data = res.data['data'];
    pageData.value = {
      ...pageData.value,
      ...res.data['data'],
      createdOn: dayjs(data['createdOn']).format('YYYY-MM-DD'),
      lastModifiedOn: dayjs(data['lastModifiedOn']).format('YYYY-MM-DD'),
    };
    document.title = pageData.value.title;
    axiosServer.get(`/user/info/${pageData.value.authorId}`).then((res) => {
      const data = res.data['data'];
      pageData.value.authorName = data['name'];
      pageLoading.value = false;
    });
  })
  .catch((err) => {
    if (err.response.status === 404) {
      router.push('/notfound');
    }
  });
getCommentsData();
</script>
<template>
  <!-- 评论侧栏 -->
  <div class="drawer drawer-end">
    <input id="comment-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-side">
      <label for="comment-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="h-screen w-lg overflow-y-auto border-l-4 border-neutral/25 bg-base-300 px-6 py-4">
        <div class="mb-3 text-lg font-bold">评论</div>
        <div class="flex gap-3">
          <div class="avatar flex">
            <img
              class="h-14 w-14 shrink-0 rounded-full border-2 border-primary/40"
              :src="userAvatarUrl"
              alt="Avatar"
            />
          </div>
          <!-- 评论输入区域 -->
          <form
            id="comment-form"
            class="flex w-full flex-col"
            novalidate
            @submit.prevent="submitComment"
          >
            <textarea
              class="comment-area validator textarea w-96 textarea-primary"
              v-model="commentText"
              required
            >
            </textarea>
            <p class="validator-hint text-sm">请输入内容</p>
            <button class="btn mt-2 ml-auto flex btn-sm btn-primary">发布</button>
          </form>
        </div>
        <div class="divider"></div>
        <RootCommentBox
          v-for="value in commentData"
          :key="value"
          :comment-data="value"
          @comment-submitted="getCommentsData"
        ></RootCommentBox>
      </div>
    </div>
  </div>
  <!-- 内容区 -->
  <div
    id="top"
    class="min-h-screen bg-base-100 font-sans selection:bg-primary/20"
    v-if="!pageLoading"
  >
    <main class="mx-auto grid max-w-325 min-w-275 grid-cols-[70px_1fr_300px] gap-6 px-6 py-10">
      <aside class="flex flex-col items-center z-10">
        <div
          class="sticky top-20 flex flex-col gap-5 rounded-full border border-base-300/50 bg-base-200 p-3 shadow-sm"
        >
          <div class="flex flex-col justify-center">
            <button
              class="tooltip btn tooltip-right btn-circle opacity-70 btn-ghost transition btn-sm hover:opacity-100"
              :class="pageData.isLiked ? 'text-error' : ''"
              data-tip="点赞"
              @click="onLikeArticle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <div class="text-center text-sm text-base-content/60">{{ pageData.likeCount }}</div>
          </div>
          <div class="flex flex-col justify-center">
            <button
              class="tooltip btn tooltip-right btn-circle text-primary opacity-70 btn-ghost transition btn-sm hover:opacity-100"
              data-tip="评论"
              @click="goComment"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </button>
            <div class="text-center text-sm text-base-content/60">{{ pageData.commentCount }}</div>
          </div>
          <div class="flex flex-col justify-center">
            <button
              class="tooltip btn tooltip-right btn-circle opacity-70 btn-ghost transition btn-sm hover:opacity-100"
              :class="pageData.isBookmarked ? 'text-warning' : ''"
              data-tip="收藏"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
            <div class="text-center text-sm text-base-content/60">{{ pageData.commentCount }}</div>
          </div>
          <div class="divider my-0"></div>
          <div class="dropdown  dropdown-right">
            <button
              class="tooltip btn tooltip-right btn-circle text-accent/40 btn-ghost btn-sm"
              data-tip="AI"
            >
              AI
            </button>
            <div
              tabindex="0"
              class="dropdown-content w-lg rounded-box bg-base-100 p-2 shadow-sm ml-5 -translate-y-70 border-2 border-neutral"
            >
             <AiChatBox class="" :article-id="props.id"></AiChatBox>
            </div>
          </div>
          <button
            class="tooltip btn tooltip-right btn-circle text-error/40 btn-ghost btn-sm hover:text-error"
            data-tip="举报"
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </button>
        </div>
      </aside>
      <div class="space-y-6">
        <section class="overflow-hidden border border-base-300/30 bg-base-200 shadow-sm">
          <div class="p-10">
            <h1 class="mb-2 text-4xl leading-snug font-extrabold tracking-tight text-base-content">
              {{ pageData.title }}
            </h1>
            <div class="badge badge-outline badge-primary"># {{ pageData.categoryDisplay }}</div>
            <div
              class="m-4 flex items-center gap-4 border border-base-200 bg-base-100 p-4 shadow-lg"
            >
              <div class="avatar">
                <div class="w-12 rounded-full">
                  <img :src="fullAvatarUrl" alt="头像" />
                </div>
              </div>
              <div class="flex-1">
                <div class="text-lg font-bold text-base-content" v-text="pageData.authorName"></div>
                <div class="text-xs tracking-widest text-base-content/50 uppercase">
                  发布于 {{ pageData.createdOn }} · 修改于 {{ pageData.lastModifiedOn }} · 12
                  分钟阅读
                </div>
              </div>
              <button class="btn px-6 btn-outline btn-sm btn-primary">关注作者</button>
            </div>
            <!-- 正文显示组件 -->
            <MdPreview
              class="z-0"
              id="article-view"
              :modelValue="pageData.content"
              :theme="isDark ? 'dark' : 'default'"
              @onGetCatalog="getCatalog"
              :mdHeadingId="mdHeadingId"
            ></MdPreview>
            <div class="divider"></div>
          </div>
        </section>
      </div>
      <aside class="space-y-6">
        <div class="sticky top-20 w-xs border border-base-100/30 bg-base-200 shadow-sm">
          <h2 class="items-center p-4 text-sm font-black tracking-wider uppercase">目录</h2>
          <div class="max-h-64 overflow-y-auto">
            <ul class="menu w-full space-y-1 menu-sm p-2">
              <li
                v-for="(item, index) in list"
                :key="item"
                class="w-full"
                :class="{
                  'pl-0': item.level === 1,
                  'pl-2': item.level === 2,
                  'pl-4': item.level === 3,
                  'pl-6': item.level === 4,
                  'pl-8': item.level === 5,
                  'pl-10': item.level === 6,
                }"
              >
                <a class="block w-full truncate" @click="scrollTo(index)">
                  {{ item.text }}
                </a>
              </li>
            </ul>
          </div>
          <div class="divider my-1"></div>
          <button
            class="btn mx-auto mb-2 btn-block text-base-content/50 btn-ghost btn-sm"
            @click="scrollToTop"
          >
            返回顶部
          </button>
        </div>
      </aside>
    </main>
  </div>
</template>

<style scoped></style>
