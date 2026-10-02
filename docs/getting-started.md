# Using @hathq/ihat-docs-site

Explain HAT, Fitting and Hatter specifications and safe usage.

## Before you start

The documentation site does not install roles, authenticate an account or connect MCP services. The required localized-site package is referenced as an excluded local archive; a fresh clone cannot install it until an approved distribution path is available. No deployment is performed by these instructions.

## First steps

Make the exact declared dependency artifacts available before installation. Local archives are excluded from Git; registry publication remains pending.

Run from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm validate:content
pnpm typecheck
pnpm test
pnpm build
```

## How to assess the result

- Maintain reviewed overview and getting-started content.
- Validate Japanese/English content and preview the configured site.

A passing source-level check establishes only what that check observes. Keep missing configuration, unavailable services and unverified deployment paths visible.

## Continue reading

[Repository overview](../README.md)
