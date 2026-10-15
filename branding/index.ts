import { fileURLToPath } from 'node:url'
import type { NuxtModule } from 'nuxt/schema'

const siteBranding: NuxtModule = (_options, nuxt) => {
  nuxt.options.css.push(fileURLToPath(new URL('./theme.css', import.meta.url)))
  nuxt.options.app.head.link ??= []
  nuxt.options.app.head.link.push(
    { rel: 'icon', type: 'image/png', href: '/brand/icon.png' },
    { rel: 'apple-touch-icon', href: '/brand/icon.png' }
  )
  nuxt.options.app.head.meta ??= []
  nuxt.options.app.head.meta.push({ name: 'theme-color', content: '#0868a5' })
}

export default siteBranding
