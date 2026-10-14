import { fileURLToPath } from 'node:url'
export default defineNuxtConfig({
  css: [fileURLToPath(new URL('./assets/site-theme.css', import.meta.url))],
  devtools: { enabled: false },
  modules: [['@nuxtjp/localized-site', { contentRoot: '.', maintenance: false }]]
})
