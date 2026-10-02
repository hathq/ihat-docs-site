# iHAT Online site content

## Site content

- Audience: Japan. Japanese is served at `/`; English is served at `/en/`.
- Publication boundary: HAT, Fitting, and Hatter specifications and safe-use guidance only; no installation, authentication, MCP connection, or external action.

## Local verification

```bash
pnpm install --offline --frozen-lockfile
pnpm validate:content
pnpm typecheck
pnpm test
pnpm build
```

Run `pnpm dev` only as a foreground loopback preview and stop it with Ctrl+C.
