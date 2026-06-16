// https://nuxt.com/docs/api/configuration/nuxt-config
const assetsBaseUrl = process.env.NUXT_PUBLIC_ASSETS_BASE_URL ?? ''

const assetsDomain = assetsBaseUrl.replace(/^https?:\/\//, '')

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
      assetsBaseUrl
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
        ]
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
  },

  icon: {
    clientBundle: {
      scan: true,
      icons: ['lucide:sun', 'lucide:moon']
    }
  },

  image: {
    domains: [assetsDomain],
    provider: process.env.NODE_ENV === 'production' ? 'ipxStatic' : undefined,
    alias: {
      r2: assetsBaseUrl
    }
  }
})
