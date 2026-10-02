import assert from 'node:assert/strict'
import { test } from 'node:test'
import { localizedHead, siteRoutes } from '@nuxtjp/localized-site/core'
import { loadSiteConfig } from '@nuxtjp/localized-site/validator'

const config = loadSiteConfig(process.cwd())

test('publishes complete locale routes and metadata without actions', () => {
  assert.equal(config.externalActions, false)
  assert.equal(config.defaultLocale, config.audienceScope === 'japan' ? 'ja' : 'en')
  assert.equal(siteRoutes(config).length, 8)
  const head = localizedHead('/', config)
  assert.equal(head.htmlAttrs.lang, config.defaultLocale)
  assert.equal(head.link.filter(item => item.rel === 'alternate').length, 3)
  assert.ok(head.link.some(item => item.rel === 'canonical'))
})
