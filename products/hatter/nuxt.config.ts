import contactConfig from './contact-form.config.json'
import consentConfig from './consent.config.json'
import type { ModuleOptions as ContactOptions } from '@nuxtjp/contact-form'
import { fileURLToPath } from 'node:url'
import sitePages from './site/module'
const enableContact = !process.env.SITE_ID || process.env.SITE_ID === 'hatter'
export default defineNuxtConfig({ devtools: { enabled: false }, contactForm: enableContact ? contactConfig as ContactOptions : undefined, modules: [...(enableContact ? [['@nuxtjp/localized-site/consent', { ...consentConfig, defaultLocale: 'ja' }] as [string, Record<string, unknown>], '@nuxtjp/contact-form'] : []),['@nuxtjp/localized-site', { contentRoot: fileURLToPath(new URL('./content', import.meta.url)), presentation: { theme: 'hathq', scope: 'product' }, maintenance: false }], sitePages], app: { head: { link: [{ rel: 'icon', type: 'image/png', href: '/brand/icon.png' }] } }, nitro: { prerender: { failOnError: true } } })
