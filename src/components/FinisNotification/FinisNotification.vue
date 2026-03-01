<script setup>
import {computed} from "vue";

const props = defineProps({
  title: String,
  message: String,
  type: {
    type: String,
    default: 'Info',
    validator(value) {
      return ['Error', 'Warning', 'Info', 'Success'].includes(value)
    }
  }
});
const notificationConfig = {
  Success: {
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    alertBorder: "border-success",
    iconStroke: "stroke-success",
  },
  Error: {
    icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    alertBorder: "border-error",
    iconStroke: "stroke-error"
  },
  Warning: {
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    alertBorder: "border-warning",
    iconStroke: "stroke-warning"
  },
  Info: {
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    alertBorder: "border-info",
    iconStroke: "stroke-info"
  }
};

// 根据当前的 type，计算出对应的所有配置
const currentConfig = computed(() => {
  return notificationConfig[props.type] || notificationConfig.Info;
});
</script>

<template>
  <div role="alert" class="alert alert-vertical sm:alert-horizontal fixed top-1 right-1 bg-base-100 w-xs min-h-12" :class="currentConfig.alertBorder">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0" :class="currentConfig.iconStroke">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="currentConfig.icon"></path>
    </svg>
    <div>
      <h3 class="font-bold text-base-content/75">{{ title }}</h3>
      <div class="text-base">{{ message }}</div>
    </div>
  </div>
</template>

<style scoped>

</style>