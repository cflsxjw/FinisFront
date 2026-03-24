<script setup>

</script>

<template>
  <div class="bg-base-100 flex items-center justify-center p-6">
    <div class="max-w-md w-full text-center">

      <div class="flex justify-center mb-8 mt-16">
        <div class="relative">
          <div class="w-32 h-32 rounded-full bg-primary/10 animate-pulse absolute -inset-4"></div>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-primary relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </div>

      <h1 class="text-5xl font-black mb-4">404</h1>
      <h2 class="text-2xl font-bold mb-4 text-base-content">NOT FOUND</h2>


      <div class="grid grid-cols-2 gap-4">
        <a href="/" class="btn btn-primary btn-outline">
          返回首页
        </a>
        <button onclick="history.back()" class="btn btn-primary">
          返回上一页
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>