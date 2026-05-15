<template>
  <div>
    <i-frame v-model:src="url"></i-frame>
  </div>
</template>

<script setup>
import iFrame from '@/components/iFrame'
import { ref } from 'vue'

const url = ref(window.global_config?.snailjob || import.meta.env.VITE_APP_SNAILJOB_ADMIN)
</script>
