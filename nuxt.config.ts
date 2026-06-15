// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    'nuxt-content-twoslash',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
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
      assetsBaseUrl: process.env.NUXT_PUBLIC_ASSETS_BASE_URL ?? ''
    }
  },

  devServer: {
    port: 9000
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      failOnError: false,
      ignore: [
        '/about',
        '/speaking',
        '/blog/undefined'
      ]
    },
    rollupConfig: {
      external: [
        '@nuxtjs/mdc/config',
        '@nuxtjs/mdc',
        'typescript',
        'twoslash',
        '@shikijs/twoslash'
      ]
    }
  },

  vite: {
    optimizeDeps: {
      include: ['@justinribeiro/lite-youtube']
    },
    build: {
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        external: [
          'typescript',
          '@shikijs/twoslash',
          'twoslash'
        ],
        output: {
          manualChunks: undefined
        }
      }
    },

    ssr: {
      external: [
        'typescript',
        'twoslash',
        '@shikijs/twoslash'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
