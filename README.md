# @hathq/ihat-docs-site

Explain HAT, Fitting and Hatter specifications and safe usage.

## What you can do

- Maintain reviewed overview and getting-started content.
- Validate Japanese/English content and preview the configured site.

## Current scope

The documentation site does not install roles, authenticate an account or connect MCP services. The declared `@nuxtjp/localized-site` dependency is obtained from the official npm registry using the frozen lockfile. No deployment is performed by these instructions.

## Getting started

Install the public-registry dependencies declared in this repository. Dependabot proposes manifest and lockfile updates through independently verified pull requests.

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

[OSS responsibility and source completion](docs/oss-source-contract.md) defines the supported package boundary and required acceptance. It does not declare unexecuted source, distribution or production checks complete.

Dependency updates: [repository policy](docs/dependency-updates.md).
