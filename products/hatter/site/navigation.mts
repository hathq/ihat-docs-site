import assert from 'node:assert/strict'

type Link = { href: string }
type Section = { links?: Link[] }
export type Content = { navigation: Link[]; pages: { path: string; sections: Section[] }[] }
export const requiredPaths = ["/docs/getting-started", "/download"]

export function validateNavigation(content: Content) {
  const pages = new Map(content.pages.map(page => [page.path, page]))
  const links = (path: string) => pages.get(path)!.sections.flatMap(section => section.links ?? [])
  const reached = new Set<string>()
  const pending = ['/', ...content.navigation.map(link => link.href)]
  while (pending.length) {
    const path = pending.pop()!
    if (path === '/sitemap' || reached.has(path)) continue
    const page = pages.get(path)
    if (!page) continue
    reached.add(path)
    pending.push(...links(path).map(link => link.href))
  }
  for (const path of requiredPaths) assert.ok(reached.has(path), `unreachable without sitemap: ${path}`)
  assert.ok(links('/download').every(link => !link.href.startsWith('/')), 'purpose: download must end at distribution resources rather than repeat the overview')
  assert.ok(links('/download').some(link => link.href === 'https://github.com/hathq/hatter-releases/releases/latest/download/hatter-linux-x86_64.tar.gz'), 'purpose: download must lead to the actual product archive, not a verifier SDK')
  assert.ok(links('/docs/getting-started').some(link => link.href === '/download') && !links('/docs/getting-started').some(link => link.href === '/features'), 'purpose: setup needs distribution status rather than feature repetition')
}
