<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})

useHead({
  htmlAttrs: {
    lang: 'es'
  }
})

useSeoMeta({
  title: `Error ${props.error.status} | ${props.error.message}`,
  description: 'La página que buscas no existe'
})
</script>

<template>
  <div>
    <LazyAppHeader
      :links="navLinks"
      hydrate-on-visible
    />

    <UMain>
      <LazyUContainer hydrate-on-visible>
        <UPage>
          <UError
            :error="props.error"
            :clear="{ label: 'Regresar al inicio', icon: 'i-lucide-arrow-left' }"
          />
        </UPage>
      </LazyUContainer>
    </UMain>

    <LazyAppFooter hydrate-on-visible />
    <UToaster />
  </div>
</template>
