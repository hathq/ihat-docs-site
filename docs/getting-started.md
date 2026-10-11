# Using @hathq/ihat-docs-site

Explain HAT, Fitting and Hatter specifications and safe usage.

## Before you start

The documentation site does not install roles, authenticate an account or connect MCP services. The declared `@nuxtjp/localized-site@0.1.0` dependency is obtained from the official npm registry using the frozen lockfile. No deployment is performed by these instructions.

## First steps

Install the exact published dependency versions from the official npm registry using the frozen lockfile. No local package archives are required.

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
