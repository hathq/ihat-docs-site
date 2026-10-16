import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { validateNavigation, requiredPaths, type Content } from './navigation.mts'
const data = JSON.parse(readFileSync(new URL('./content.json', import.meta.url), 'utf8')) as { locales: { ja: Content; en: Content } }
for (const locale of ['ja', 'en'] as const) {
  const original = data.locales[locale]
  test(`${locale}: ordinary entries have useful destinations`, () => validateNavigation(original))
  test(`${locale}: sitemap-only entries are rejected`, () => {
    const content = structuredClone(original)
    content.navigation = content.navigation.filter(link => link.href !== requiredPaths[0])
    for (const page of content.pages) {
      if (page.path === '/sitemap') continue
      for (const section of page.sections) section.links = section.links?.filter(link => link.href !== requiredPaths[0])
    }
    assert.throws(() => validateNavigation(content), /unreachable/)
  })
  for (const [target, href] of [["/products/hatter", "/docs"], ["/registry", "https://registry.ihat.online"]] as const) {
    test(`${locale}: wrong destination for ${target} is rejected`, () => {
      const content = structuredClone(original)
      content.pages.find(page => page.path === target)!.sections = [{ links: [{ href }] }]
      assert.throws(() => validateNavigation(content), assert.AssertionError)
    })
  }
}
