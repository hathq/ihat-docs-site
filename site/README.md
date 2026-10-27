# Site-owned multi-page template

This scaffold was adopted from `nuxtjp/site-builder/templates/service-site`.
This presentation uses the shared documents and declarative UI APIs from
localized-site 0.5.0. Package publication and production deployment are verified
separately from the source changes.

Edit `documents/{ja,en}/**/*.md` for reviewed page bodies and metadata.
Edit `site.json` for navigation, categories, resource facts and explicit `pageOrder`.
Both languages must contain the same unique paths. Keep navigation to five
visitor goals; place detailed pages under their parent section. Every internal
link must resolve. `module.ts` prerenders published pages and generates the XML
sitemap from that same manifest. `/sitemap` is the human-readable index.

Draft article prompts live in `content-drafts` outside this imported directory.
They have no public URL, navigation entry or bundled text. To publish an article,
add reviewed bilingual page entries with `kind: "article"`, a topic in `category`,
and `status: "published"`. Empty collections show a normal empty state. Never add
fake dates, customer names, testimonials, download links, prices or achievements.
Run the site build and local link/browser checks before merging. Site sources
are ready for a later deployment batch; merging does not create a release tag.

Each owner can change its presentation independently. Retain LICENSE/NOTICE and
asset attribution when adapting this Apache-2.0 scaffold. Brand assets retain
their existing site-specific rights. Public pages do not describe migration,
authoring placeholders or infrastructure approval procedures.

## Generated document outputs

`content.mjs` validates the current MDC source and parses the official MDC AST and renders Vue components,
`/raw/*.md` and `/llms.txt` from the same published selection. HTML links to
its Markdown alternate. Ignore `.generated-documents/`; edit the source MDC,
never the generated content snapshot. The removed authored `content.json` and
PageSections renderer have no compatibility fallback.


## Declarative presentation

The route adapter composes `NuxtJpServiceSite` with public document data, local
experience data and named slots. Shared components and CSS belong to localized-site
0.5.0. The Nuxt adapter validates that pages contain no style blocks, CSS imports
or inline style bindings. Product-specific components retain their own behavior
and scoped styles. Formal package adoption and production acceptance remain
separate from this source migration.
