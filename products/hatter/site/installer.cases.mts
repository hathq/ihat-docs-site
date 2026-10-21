import assert from 'node:assert/strict'
import test from 'node:test'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { installationCommand, release } from './installer.mts'
test('copyable bootstrap pins source and checksum, with no fetch-and-execute pipeline', () => {
  const command = installationCommand()
  assert.ok(command.includes(`/hathq/hatter-releases/${release.installerSource}/install.sh`))
  assert.ok(command.includes(release.installerSha256))
  assert.match(command, /sha256sum --check --status\n  bash/)
  assert.doesNotMatch(command, /latest|curl.*\|.*(?:sh|bash)/)
  assert.equal(spawnSync('/bin/bash', ['-n'], { input: command }).status, 0)
})
for (const field of ['version', 'installerSource', 'installerSha256'] as const) {
  test(`refuses unsafe ${field} before producing shell code`, () => {
    assert.throws(() => installationCommand({ ...release, [field]: "'; echo unexpected; #" }), /Invalid immutable/)
  })
}
test('both languages provide installation context rather than archive buttons', () => {
  const data = JSON.parse(readFileSync(new URL('./content.json', import.meta.url), 'utf8'))
  for (const locale of ['ja', 'en']) {
    const page = data.locales[locale].pages.find((entry: { path: string }) => entry.path === '/download')
    assert.ok(page.sections.some((section: { links: { href: string }[] }) => section.links?.some(link => link.href === '/docs/getting-started')))
    assert.ok(!JSON.stringify(page.sections).includes('/releases/latest/download/'))
  }
})

test('displayed prerequisites and the pinned installer carry the patched Node floor', () => {
  assert.deepEqual(release.nodeMinimums, {'22':'22.23.4','24':'24.22.1'})
  const content=readFileSync(new URL('./content.json',import.meta.url),'utf8')
  const component=readFileSync(new URL('./components/InstallCommand.vue',import.meta.url),'utf8')
  for(const value of [content,component]){assert.match(value,/22\.23\.4/);assert.match(value,/24\.22\.1/)}
})
