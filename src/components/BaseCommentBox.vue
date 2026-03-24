<script setup>
import { computed, ref } from 'vue';
import axiosServer from '../utils/axios';
/**
 * @typedef CommentData
 * @property authorId
 * @property replyToUserId
 * @property articleId
 * @property rootCommentId?
 * @property subComments
 */
const emit = defineEmits(['commentSubmitted']);
const props = defineProps({
  isChild: Boolean,
  /** @type {CommentData} */
  commentData: {
    type: Object,
    required: true,
  },
});
const authorInfo = ref({
  name: '',
});
const replyToUserInfo = ref({
  name: '',
});
axiosServer.get(`/user/info/${props.commentData.authorId}`).then((res) => {
  authorInfo.value = res.data['data'];
});
if (props.commentData.replyToUserId > 0) {
  axiosServer.get(`/user/info/${props.commentData.replyToUserId}`).then((res) => {
    replyToUserInfo.value = res.data['data'];
  });
}

const statusPool = ref({
  replyExpanded: false,
});
const hasChild = ref(props.commentData.subComments);
const isExpanded = ref(false);

const avatarUrl = computed(() => `/api/resource/avatar/${props.commentData.authorId}`);
console.log(props.commentData.subComments);
const commentText = ref('');
const formRef = ref(null);
const postComment = () => {
  const form = formRef.value;
  const commentArea = document.querySelector('#comment-textarea');
  if (form.checkValidity()) {
    let data;
    data = {
      content: commentText.value,
      articleId: props.commentData.articleId,
      rootCommentId: props.commentData.rootCommentId
        ? props.commentData.rootCommentId
        : props.commentData.id,
    };
    if (props.commentData.rootCommentId) {
      data.replyToUserId = props.commentData.authorId;
    }
    axiosServer.post('/article/comment/post', data).then((res) => {
      if (res.data['isSuccess'] === true) {
        emit('commentSubmitted');
      }
    });
  } else {
    commentArea.setCustomValidity('required');
  }
};
</script>

<template>
  <div
    class="flex max-w-120 flex-col bg-base-200"
    :class="[props.isChild === true ? 'border-l-12 border-primary/30' : '']"
  >
    <div class="flex w-full items-center gap-3 bg-base-300 p-2">
      <div class="avatar h-8 w-8 rounded-full">
        <img class="rounded-full" :src="avatarUrl" alt="头像" />
      </div>
      <div>
        {{
          commentData.replyToUserId > 0
            ? authorInfo.name + ' 回复 ' + replyToUserInfo.name
            : authorInfo.name
        }}
      </div>
    </div>
    <div class="fle flex-col p-3">
      <p :class="['text-content', isExpanded ? '' : 'line-clamp-3']">
        {{ props.commentData.content }}
      </p>
      <div class="flex items-center">
        <button @click="isExpanded = !isExpanded" class="mt-1 text-sm text-primary">
          {{ isExpanded ? '收起' : '展开全文' }}
        </button>
        <!-- 按钮区 -->
        <div class="ml-auto flex items-center gap-3">
          <!-- like 按钮 -->
          <button class="btn h-8 w-8 rounded-full p-0 btn-ghost">
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
          <!-- 评论按钮 -->
          <!-- TODO: 楼中楼评论 -->
          <button
            @click="statusPool.replyExpanded = !statusPool.replyExpanded"
            class="btn h-8 w-8 rounded-full p-0 btn-ghost"
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
        </div>
      </div>
      <div v-show="statusPool.replyExpanded" class="mt-2 flex flex-col">
        <form id="comment-post-form" ref="formRef" novalidate @submit.prevent="postComment">
          <textarea
            v-model="commentText"
            id="comment-textarea"
            class="validator textarea flex h-full w-full transition-all textarea-primary"
            required
          ></textarea>
          <div class="validator-hint text-[10px]">请输入内容</div>
          <button class="btn h-8 w-16 btn-primary">发送</button>
        </form>
      </div>
    </div>
  </div>
  <div v-if="!props.isChild && hasChild">
    <BaseCommentBox
      v-for="value in props.commentData.subComments"
      :key="value"
      :is-child="true"
      :comment-data="value"
      @comment-submitted="emit('commentSubmitted')"
    >
    </BaseCommentBox>
  </div>
</template>

<style scoped></style>
