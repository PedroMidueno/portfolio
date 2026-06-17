<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => {
  return queryCollection('index').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Página no encontrada',
    message: 'La página que buscas no existe',
    fatal: true
  })
}

useSeoMeta({
  title: page.value?.seo.title || page.value?.title,
  ogTitle: page.value?.seo.title || page.value?.title,
  description: page.value?.seo.description || page.value?.description,
  ogDescription: page.value?.seo.description || page.value?.description
})
</script>

<template>
  <UPage v-if="page">
    <LandingHero :page />
    <UPageSection
      :ui="{
        container: 'pt-0!'
      }"
    >
      <LazyLandingAbout
        :page
        hydrate-on-visible
      />
      <LazyLandingWorkExperience
        :page
        hydrate-on-visible
      />
    </UPageSection>
    <LazyLandingBlog
      :page
      hydrate-on-visible
    />
  </UPage>
</template>
