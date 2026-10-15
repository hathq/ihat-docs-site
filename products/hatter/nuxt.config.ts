import { fileURLToPath } from 'node:url'
import sitePages from './site/module'
export default defineNuxtConfig({ devtools: { enabled: false }, modules: [['@nuxtjp/localized-site', { contentRoot: fileURLToPath(new URL('./content', import.meta.url)), presentation: { theme: 'hathq', scope: 'product' }, maintenance: false }], sitePages], app: { head: { link: [{ rel: 'icon', type: 'image/png', href: '/brand/icon.png' }] } }, nitro: { prerender: { failOnError: true } } })
