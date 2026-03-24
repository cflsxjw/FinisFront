<script setup>
var props = defineProps({
  articleId: {
    type: Number,
  }
})

import { isDark } from '../main.js';
import { ref, nextTick, computed } from 'vue';
import { createParser } from 'eventsource-parser';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';

const inputText = ref('');
const messages = ref([]);
const isSending = ref(false);
const scrollRef = ref(null);
const ragEnabled = ref(false);

const scrollToBottom = async () => {
  await nextTick();
  if (scrollRef.value) {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
  }
};
const MAX_HISTORY_LENGTH = 5;
const chatHistory = computed(() => {
  const history = messages.value
    .filter((msg) => msg.content && msg.content.trim() !== '')
    .map(({ role, content }) => ({ role, content }))
    .slice(-(MAX_HISTORY_LENGTH * 2 + 1)); // 新问题不算历史记录
  return history;
});

const getChatAnswerStream = async () => {
  if (!inputText.value.trim() || isSending.value) return;

  const userMessage = inputText.value;
  messages.value.push({ role: 'user', content: userMessage });
  inputText.value = '';
  isSending.value = true;
  const aiMessageIndex = messages.value.push({ role: 'assistant', content: '' }) - 1;
  await scrollToBottom();

  try {
    let response;
    console.log(props.articleId);
    if (props.articleId > 0) {
      response = await fetch('/api/largeModel/chat_with_article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [...chatHistory.value],
        enableRag: ragEnabled.value,
        articleId: props.articleId
        }),
      });
    }
    else {
      response = await fetch('/api/largeModel/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [...chatHistory.value],
        enableRag: ragEnabled.value,
        }),
      });
    }
    if (!response.ok) throw new Error('API 请求失败');
    const decoder = new TextDecoder('utf-8');
    const reader = response.body.getReader();
    const parser = createParser({
      onEvent: (event) => {
        try {
          const json = JSON.parse(event.data);
          const content = json.output?.choices[0]?.message?.content[0]?.text;
          if (content) {
            messages.value[aiMessageIndex].content += content;
            scrollToBottom();
          }
        } catch (e) {
          console.error('JSON 解析失败', e);
        }
      },
    });

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      parser.feed(decoder.decode(value, { stream: true }));
    }
  } catch {
    messages.value[aiMessageIndex].content = '发生错误，请检查 API 连接。';
  } finally {
    isSending.value = false;
  }
};
</script>

<template>
  <div
    class="relative mx-auto flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-xl"
  >
    <div class="toolkit-board absolute z-10 flex w-full gap-3 bg-base-300 p-2">
      <button class="btn btn-ghost btn-outline" @click="messages = []">clear history</button>
      <label class="label text-sm" v-if="!(props.articleId > 0)">
        <input type="checkbox" checked="checked" class="toggle toggle-primary" v-model="ragEnabled" />
        启用 RAG
      </label>
    </div>
    <div ref="scrollRef" class="mt-14 flex-1 space-y-4 overflow-y-auto bg-base-200/50 px-4 pb-4 pt-2">
      <div
        v-if="messages.length === 0"
        class="flex h-full flex-col items-center justify-center opacity-40"
      >
        <div class="mb-2 text-6xl"></div>
        <p>有什么我可以帮你的吗？</p>
      </div>

      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['chat', msg.role === 'user' ? 'chat-end' : 'chat-start']"
      >
        <div class="avatar chat-image">
          <div
            class="flex w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10"
          >
            <span class="text-xs font-bold">{{ msg.role === 'user' ? 'ME' : 'AI' }}</span>
          </div>
        </div>
        <div class="chat-header mb-1 opacity-50">
          {{ msg.role === 'user' ? '你' : 'Assistant Humphrey' }}
        </div>
        <div
          :class="[
            'chat-bubble max-w-[90%] shadow-sm',
            msg.role === 'user'
              ? 'chat-bubble-primary'
              : 'border border-base-300 bg-base-100 text-base-content',
          ]"
          v-show="msg.content"
        >
          <MdPreview
            :theme="isDark ? 'dark' : 'default'"
            :modelValue="msg.content"
            style="background: transparent; padding: 0"
          />
        </div>
        <div
          v-if="
            isSending &&
            !messages[messages.length - 1].content &&
            msg.role === 'assistant' &&
            index === messages.length - 1
          "
          class="chat-start chat"
        >
          <div class="chat-bubble flex gap-1 border border-base-300 bg-base-100">
            <span class="loading loading-sm loading-dots"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-base-300 bg-base-100 p-4">
      <form @submit.prevent="getChatAnswerStream" class="flex items-end gap-2">
        <textarea
          v-model="inputText"
          placeholder="输入消息，Shift + Enter 换行"
          class="textarea-bordered textarea max-h-48 min-h-12 flex-1 leading-relaxed focus:outline-primary"
          @keydown.enter.prevent="(e) => (e.shiftKey ? (inputText += '\n') : getChatAnswerStream())"
          required
        />
        <button class="btn btn-square btn-ghost" :disabled="isSending">
          <span v-if="isSending" class="loading loading-spinner"></span>
          <span v-else>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 12L22 2L15 22L11 13L2 12Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11 13L22 2"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </button>
      </form>
      <div class="mt-2 text-center text-[10px] opacity-30">Powered by Qwen3.5-Plus</div>
    </div>
  </div>
</template>

<style scoped>
:deep(.md-editor-preview) {
  font-size: 14px !important;
}
:deep(.md-editor-preview-wrapper) {
  padding: 0 !important;
}
</style>
