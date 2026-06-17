import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [
  {
    label: 'Inicio',
    icon: 'i-lucide-home',
    to: '/'
  },
  {
    label: 'Proyectos',
    icon: 'i-lucide-folder',
    to: '/projects'
  },
  {
    label: 'Blog',
    icon: 'i-lucide-file-text',
    to: '/blog'
  }
]
