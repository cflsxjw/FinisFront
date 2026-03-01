<script setup>

</script>

<template>
  <div class="card card-side bg-base-100 shadow-sm hover:shadow-md transition-all border border-base-200 overflow-hidden max-w-4xl group">
    <div class="card-body p-6 w-full md:w-2/3">
      <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
        <span>深度解读</span>
        <span class="text-base-content/20">|</span>
        <span class="text-base-content/50 normal-case font-normal">5 分钟阅读</span>
      </div>

      <h2 class="card-title text-2xl font-bold leading-tight group-hover:text-primary transition-colors cursor-pointer">
        2026 年前端开发趋势：从原子化 CSS 到 AI 驱动的组件生成
      </h2>

      <p class="text-base-content/70 mt-3 line-clamp-2 md:line-clamp-3">
        随着大语言模型的进化，前端工程化正迎来前所未有的变革。本文将分析 Tailwind 生态如何适配 AI 辅助编程，以及开发者应如何调整技术栈以应对未来的自动化挑战...
      </p>

      <div class="card-actions justify-between items-center mt-6 border-t border-base-200 pt-4">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <div class="w-9 rounded-full">
              <img src="https://api.dicebear.com/7.x/shapes/svg?seed=Tech" />
            </div>
          </div>
          <div>
            <div class="text-sm font-bold">科技周刊</div>
            <div class="text-[10px] opacity-60">发布于 2 小时前</div>
          </div>
        </div>

        <div class="flex gap-2">
          <button class="btn btn-ghost btn-sm btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
          </button>
          <button class="btn btn-primary btn-sm px-4 rounded-lg">阅读全文</button>
        </div>
      </div>
    </div>
    <!-- TODO: 显示 figure -->
    <figure class="w-1/3 min-w-[240px] hidden md:block overflow-hidden disabled">
      <img
          src="https://images.unsplash.com/photo-1504711432869-5d593f5f2031?auto=format&fit=crop&w=600&q=80"
          alt="News"
          class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </figure>
  </div>
</template>

<style scoped>

</style>