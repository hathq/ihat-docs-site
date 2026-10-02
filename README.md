# @hathq/ihat-docs-site

Explain HAT, Fitting and Hatter specifications and safe usage.

## What you can do

- Maintain reviewed overview and getting-started content.
- Validate Japanese/English content and preview the configured site.

## Current scope

The documentation site does not install roles, authenticate an account or connect MCP services. The required localized-site package is referenced as an excluded local archive; a fresh clone cannot install it until an approved distribution path is available. No deployment is performed by these instructions.

## Getting started

The manifest currently requires locally supplied package archives: `@nuxtjp/localized-site`. These archives are excluded from Git. Obtain the exact approved dependency artifacts before installing; a fresh clone alone is not sufficient. Registry distribution remains pending.

Use `pnpm@10.29.3` and the Node.js version declared in `engines` in `package.json`. Run from this repository:

```sh
pnpm install --frozen-lockfile
pnpm validate:content
pnpm typecheck
pnpm test
pnpm build
```

## Documentation and source

[Usage guide](docs/getting-started.md)

[Verification cases](test) · [Contributing](CONTRIBUTING.md) · [Security reporting](SECURITY.md) · [License](LICENSE) · [Attribution notices](NOTICE)
