<script setup>
import {isDark, toggleDark} from '../main.js'
</script>

<template>
  <button
      @click="toggleDark()"
      class="btn btn-ghost btn-circle swap swap-rotate"
      aria-label="Toggle Theme"
  >
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="transition-all duration-500 ease-in-out transform"
        :class="isDark ? 'rotate-40' : 'rotate-0'"
    >
      <mask id="moon-mask">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <circle
            class="transition-all duration-500 ease-in-out"
            :cx="isDark ? '12' : '30'"
            :cy="isDark ? '4' : '0'"
            r="9"
            fill="black"
        />
      </mask>

      <circle
          cx="12"
          cy="12"
          :r="isDark ? '9' : '5'"
          fill="currentColor"
          mask="url(#moon-mask)"
          class="transition-all duration-500"
      />

      <g
          class="transition-all duration-300 stroke-current"
          :class="isDark ? 'opacity-0 scale-50' : 'opacity-100 scale-100'"
          style="transform-origin: center;"
      >
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  </button>
</template>

<style scoped>

</style>