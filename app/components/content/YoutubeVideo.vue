<script setup lang="ts">
import { onMounted } from 'vue'

const props = defineProps<{
  videoId: string
}>()

onMounted(async () => {
  await import('@justinribeiro/lite-youtube')
})
</script>

<template>
  <ClientOnly>
    <lite-youtube :videoid="props.videoId" />
  </ClientOnly>
</template>
