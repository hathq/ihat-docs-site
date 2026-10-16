import assert from 'node:assert/strict'

type Link = { href: string }
type Section = { links?: Link[] }
export type Content = { navigation: Link[]; pages: { path: string; sections: Section[] }[] }
export const requiredPaths = ["/products/hatter", "/registry", "/hat/registry"]

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
  assert.ok(links('/products/hatter').some(link => link.href.startsWith('https://hatter.ihat.online/')) && links('/products/hatter').some(link => link.href.endsWith('/download')), 'purpose: Hatter needs product and availability destinations')
  assert.ok(links('/registry').some(link => link.href === '/hat/registry') && !links('/registry').some(link => link.href.startsWith('https://registry.ihat.online')), 'purpose: unpublished registry needs available public references')
}
