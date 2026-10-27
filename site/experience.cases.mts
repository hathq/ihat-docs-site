import documentContent from './content.mjs'
import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { validateExperience } from './experience.mts'
import type { Experience } from './experience-types'
import type { Locale, SiteContent } from './types'

const data = documentContent
const experiences = JSON.parse(readFileSync(new URL('./experience.json', import.meta.url), 'utf8')) as Record<Locale, Experience>
for (const locale of ['ja', 'en'] as const) {
  const experience = experiences[locale]
  const content = data.locales[locale] as SiteContent
  test(`${locale}: every visitor action has a published destination`, () => validateExperience(experience, content))
  test(`${locale}: missing destination is rejected before publication`, () => {
    const changed = structuredClone(experience)
    changed.primary.href = '/missing-visitor-destination'
    assert.throws(() => validateExperience(changed, content), /unavailable journey/)
  })
  test(`${locale}: duplicate and misleading homepage exits are refused`, () => {
    const changed = structuredClone(experience)
    changed.paths[1]!.href = changed.paths[0]!.href
    assert.throws(() => validateExperience(changed, content), /distinct/)
    changed.paths[1]!.href = '/'
    assert.throws(() => validateExperience(changed, content), /beyond the homepage/)
  })
}
test('language changes preserve task and product identity', () => {
  assert.equal(experiences.ja.primary.href, experiences.en.primary.href)
  assert.equal(experiences.ja.secondary.href, experiences.en.secondary.href)
  assert.equal(experiences.ja.preview.kind, experiences.en.preview.kind)
  assert.deepEqual(experiences.ja.paths.map(item => item.href), experiences.en.paths.map(item => item.href))
})

if (data.siteId === 'ihat-docs') test('the discoverable HAT directory links the same eight versioned public releases in both languages', () => {
  const ja = data.locales.ja.resources as { href: string }[]
  const en = data.locales.en.resources as { href: string }[]
  assert.equal(ja.length, 8)
  assert.equal(new Set(ja.map(item => item.href)).size, 8)
  assert.deepEqual(ja.map(item => item.href), en.map(item => item.href))
  for (const item of ja) assert.match(item.href, /^https:\/\/github\.com\/(hathq|neo-erp)\/hat-[a-z-]+\/releases\/tag\/hat\/v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/)
})
