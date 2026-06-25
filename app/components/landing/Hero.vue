<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const { footer, global } = useAppConfig()

defineProps<{
  page: IndexCollectionItem
}>()
</script>

<template>
  <UPageHero
    :ui="{
      container: 'lg:py-28 px-0',
      headline: 'flex items-center justify-center',
      title: 'text-shadow-md max-w-lg mx-auto',
      links: 'mt-4 flex-col justify-center items-center'
    }"
  >
    <template #headline>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        <UColorModeAvatar
          class="size-52 sm:size-60 ring ring-default ring-offset-3 ring-offset-bg p-2"
          :light="global.picturePath?.light!"
          :dark="global.picturePath?.dark!"
          :alt="global.picturePath?.alt!"
          loading="eager"
          fetchpriority="high"
          sizes="xs:208px sm:240px"
        />
      </Motion>
    </template>

    <template #title>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        {{ page.title }}
      </Motion>
    </template>

    <template #description>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.3
        }"
      >
        {{ page.description }}
      </Motion>
    </template>

    <template #links>
      <Motion
        class="w-full"
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.5
        }"
      >
        <div
          v-if="page.hero.links"
          class="flex flex-col items-center gap-4"
        >
          <UButton
            :color="global.available ? 'success' : 'error'"
            variant="ghost"
            class="gap-2 w-full sm:w-auto flex justify-center"
            :to="global.available ? global.meetingLink : ''"
          >
            <template #default>
              <p class="text-center">
                Disponible para nuevas oportunidades
              </p>
            </template>

            <template #leading>
              <span class="relative flex size-2">
                <span
                  class="absolute inline-flex size-full rounded-full opacity-75"
                  :class="global.available ? 'bg-success animate-ping' : 'bg-error'"
                />
                <span
                  class="relative inline-flex size-2 scale-90 rounded-full"
                  :class="global.available ? 'bg-success' : 'bg-error'"
                />
              </span>
            </template>
          </UButton>
          <UButton
            v-bind="page.hero.links[0]"
            @click="copyToClipboard('pedromidueno.dev@gmail.com', 'Email copiado al portapapeles')"
          />
        </div>
      </Motion>

      <div class="gap-x-4 inline-flex mt-4">
        <Motion
          v-for="(link, index) of footer?.links"
          :key="index"

          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: 0.5 + index * 0.1
          }"
        >
          <UButton
            v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }"
          />
        </Motion>
      </div>
    </template>
  </UPageHero>
</template>
