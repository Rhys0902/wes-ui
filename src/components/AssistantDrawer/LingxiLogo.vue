<template>
  <div
    v-if="mark"
    class="lingxi-mark"
    :style="{ width: `${safeSize}px`, height: `${safeSize}px` }"
  >
    <svg :width="safeSize * 0.62" :height="safeSize * 0.62" viewBox="0 0 32 32" fill="none">
      <path d="M5 25 C 7 14, 12 8, 16 16" stroke="white" stroke-width="2.6" stroke-linecap="round" fill="none" />
      <path d="M27 25 C 25 14, 20 8, 16 16" stroke="white" stroke-width="2.6" stroke-linecap="round" fill="none" />
      <circle cx="16" cy="16" r="2.6" fill="white" />
      <path d="M16 4 L16 7.5 M12.5 6 L13.8 8.4 M19.5 6 L18.2 8.4" stroke="white" stroke-width="1.6" stroke-linecap="round" opacity="0.9" />
    </svg>
  </div>
  <svg v-else :width="safeSize" :height="safeSize" viewBox="0 0 32 32" fill="none">
    <defs>
      <linearGradient id="lingxi-stroke" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#67e8f9" />
        <stop offset="0.5" stop-color="#a78bfa" />
        <stop offset="1" stop-color="#f0abfc" />
      </linearGradient>
    </defs>
    <path d="M5 25 C 7 14, 12 8, 16 16" stroke="url(#lingxi-stroke)" stroke-width="2.4" stroke-linecap="round" fill="none" />
    <path d="M27 25 C 25 14, 20 8, 16 16" stroke="url(#lingxi-stroke)" stroke-width="2.4" stroke-linecap="round" fill="none" />
    <circle cx="16" cy="16" r="2.2" fill="white" />
    <path d="M16 4 L16 8 M12 6 L13.5 8.5 M20 6 L18.5 8.5" stroke="url(#lingxi-stroke)" stroke-width="1.6" stroke-linecap="round" />
  </svg>
</template>

<script setup>
const props = defineProps({
  size: {
    type: Number,
    default: 36
  },
  mark: {
    type: Boolean,
    default: false
  }
})

const safeSize = computed(() => props.size || 36)
</script>

<style scoped lang="scss">
.lingxi-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 16px;
  background: linear-gradient(135deg, #22d3ee 0%, #6366f1 52%, #7c3aed 100%);
  box-shadow: 0 10px 30px -10px rgba(124, 58, 237, 0.4);
}
</style>
