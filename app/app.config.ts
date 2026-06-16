export default defineAppConfig({
  global: {
    picturePath: {
      dark: '/r2/images/foto_portfolio.webp',
      light: '/r2/images/foto_portfolio.webp',
      alt: 'Imagen de portafolio web de Pedro Midueño'
    },
    blogAvatarImagePath: '/r2/images/foto_fondo_blanco.webp',
    meetingLink: 'mailto:pedromidueno.dev@gmail.com',
    email: 'pedromidueno.dev@gmail.com',
    available: true
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `pemid.dev • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [
      {
        'icon': 'i-simple-icons-youtube',
        'to': 'https://www.youtube.com/@pemid_dev?sub_confirmation=1',
        'target': '_blank',
        'aria-label': 'Canal de Youtube pemid - Desarrollo web y programación'
      },
      {
        'icon': 'i-simple-icons-linkedin',
        'to': 'https://www.linkedin.com/in/pedromidueno/',
        'target': '_blank',
        'aria-label': 'Perfil de LinkedIn de Pedro Midueño'
      },
      {
        'icon': 'i-simple-icons-github',
        'to': 'https://github.com/PedroMidueno',
        'target': '_blank',
        'aria-label': 'Perfil de Github de Pedro Midueño'
      },
      {
        'icon': 'i-simple-icons-x',
        'to': 'https://x.com/pemid_dev',
        'target': '_blank',
        'aria-label': 'Perfil de X (antes Twitter) de Pedro Midueño'
      }
    ]
  }
})
