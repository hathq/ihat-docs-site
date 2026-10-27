import contactConfig from './contact-form.config.json'
import consentConfig from './consent.config.json'
import type { ModuleOptions as ContactOptions } from '@nuxtjp/contact-form'
import sitePages from './site/module'
import siteBranding from './branding'
import { fileURLToPath } from 'node:url'
const enableContact = !process.env.SITE_ID || process.env.SITE_ID === 'ihat-docs'
export default defineNuxtConfig({
  css: [fileURLToPath(new URL('./assets/site-theme.css', import.meta.url))],
  devtools: { enabled: false },
  contactForm: enableContact ? contactConfig as ContactOptions : undefined, modules: [...(enableContact ? [['@nuxtjp/localized-site/consent', { ...consentConfig, defaultLocale: 'ja' }] as [string, Record<string, unknown>], '@nuxtjp/contact-form'] : []),['@nuxtjp/localized-site', { contentRoot: '.', maintenance: false }], siteBranding, sitePages]
})
