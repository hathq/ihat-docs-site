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
  assert.ok(!links('/download').some(link => ['/features', '/docs', '/'].includes(link.href)), 'purpose: installation must not return to an overview')
  assert.ok(links('/download').some(link => link.href === '/docs/getting-started') && links('/download').some(link => /^https:\/\/github.com\/hathq\/hatter-releases\/releases\/tag\/v/.test(link.href)), 'purpose: installation provides setup help and exact release details')
  assert.ok(links('/docs/getting-started').some(link => link.href === '/download') && !links('/docs/getting-started').some(link => link.href === '/features'), 'purpose: setup needs distribution status rather than feature repetition')
}
