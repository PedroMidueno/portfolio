<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { mapContentNavigation } from '@nuxt/ui/utils/content'
import { findPageBreadcrumb } from '@nuxt/content/utils'

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Página no encontrada',
    message: 'La página que buscas no existe',
    fatal: true
  })
}
const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
  queryCollectionItemSurroundings('blog', route.path, {
    fields: ['description']
  })
)
const { assetsBaseUrl } = useRuntimeConfig().public
const { blogAvatarImagePath } = useAppConfig().global

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation', ref([]))
const blogNavigation = computed(() => navigation.value.find(item => item.path === '/blog')?.children || [])

const breadcrumb = computed(() => mapContentNavigation(findPageBreadcrumb(blogNavigation?.value, page.value?.path)).map(({ icon, ...link }) => link))

if (page.value.imagePath) {
  defineOgImage({ url: assetsBaseUrl + page.value.imagePath })
} else {
  defineOgImageComponent('Blog', {
    headline: breadcrumb.value.map(item => item.label).join(' > ')
  }, {
    fonts: ['Geist:400', 'Geist:600']
  })
}

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  description,
  ogDescription: description,
  ogTitle: title
})

const requestUrl = useRequestURL()
const articleLink = computed(() => requestUrl.href)
const originUrl = computed(() => requestUrl.origin)
</script>

<template>
  <UMain class="mt-20 px-2">
    <UContainer class="relative min-h-screen">
      <UPage v-if="page">
        <ULink
          to="/blog"
          class="text-sm flex items-center gap-1"
        >
          <UIcon name="lucide:chevron-left" />
          Blog
        </ULink>
        <div class="flex flex-col gap-3 mt-8">
          <div class="flex text-xs text-muted items-center justify-center gap-2">
            <span v-if="page.date">
              {{ page.date }}
            </span>
            <span v-if="page.date && page.minRead">
              -
            </span>
            <span v-if="page.minRead">
              {{ page.minRead }} min de lectura
            </span>
          </div>
          <NuxtImg
            :src="assetsBaseUrl + page.imagePath"
            :alt="page.title"
            class="rounded-lg w-full h-75 object-cover object-center"
          />
          <h1 class="text-4xl text-center font-medium max-w-3xl mx-auto mt-4">
            {{ page.title }}
          </h1>
          <p class="text-muted text-center max-w-2xl mx-auto">
            {{ page.description }}
          </p>
          <div class="flex items-center justify-center gap-2 mt-2">
            <UUser
              name="Pedro Midueño"
              orientation="vertical"
              color="neutral"
              variant="outline"
              class="justify-center items-center text-center"
              :to="originUrl"
              :avatar="{
                src: assetsBaseUrl + blogAvatarImagePath,
                alt: 'Foto de de Pedro Midueño con fondo blanco'
              }"
            />
          </div>
        </div>
        <UPageBody class="max-w-3xl mx-auto">
          <ContentRenderer
            v-if="page.body"
            :value="page"
          />

          <div class="flex items-center justify-end gap-2 text-sm text-muted">
            <UButton
              size="sm"
              variant="link"
              color="neutral"
              label="Copiar enlace"
              class="cursor-pointer"
              @click="copyToClipboard(articleLink, 'Enlace del artículo copiado al portapapeles')"
            />
          </div>
          <UContentSurround
            v-if="surround && surround.some(item => item)"
            :surround
          />
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
