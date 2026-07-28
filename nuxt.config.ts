// https://nuxt.com/docs/api/configuration/nuxt-config
const assetsBaseUrl = process.env.NUXT_PUBLIC_ASSETS_BASE_URL ?? ''

const assetsDomain = assetsBaseUrl.replace(/^https?:\/\//, '')

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'motion-v/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'lite-youtube'
    }
  },

  runtimeConfig: {
    public: {
      assetsBaseUrl
    }
  },

  devServer: {
    port: 9000
  },

  features: {
    inlineStyles: true
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      failOnError: false,
      ignore: ['/blog/undefined']
    }
  },

  vite: {
    optimizeDeps: {
      include: ['@justinribeiro/lite-youtube']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    clientBundle: {
      scan: true,
      icons: ['lucide:sun', 'lucide:moon']
    }
  },

  image: {
    domains: [assetsDomain],
    alias: {
      r2: assetsBaseUrl
    }
  }
})
