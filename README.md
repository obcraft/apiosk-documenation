# Apiosk Gateway Docs

Separate Mintlify docs project for the Apiosk gateway public surface.

This project documents only the public integration contract:

- discovery routes
- public API detail routes
- MCP-style `/metadata`
- uniform `/execute`
- x402 payment proofs at the public boundary
- community API publishing and management

It intentionally excludes internal implementation details such as:

- platform wallet or settlement internals
- facilitator wiring details
- replay and anti-abuse internals
- managed wallet session internals
- operator-only control endpoints

## Stack

- `docs.json` for Mintlify site configuration
- `.mdx` pages for guides and overview content
- `openapi/public-gateway.json` as the sanitized source for generated API reference pages

## Local usage

```bash
npm run dev
```

Validate the OpenAPI contract:

```bash
npm run check:openapi
```

## Netlify deploy

Mintlify docs are hosted by the Mintlify client, not by this repo directly. For `docs.apiosk.com` on Netlify, this project builds a small deployable wrapper that:

- proxies all traffic to a Mintlify deployment origin
- shows a clear config page instead of a Netlify 404 when the target origin is missing

Run docs validation separately before deploy:

```bash
npm run validate
```

Required Netlify environment variable:

```bash
APIO_DOCS_PROXY_TARGET=https://your-docs-site.mintlify.app
```

Recommended:

- point `MINTLIFY_SITE_URL` at the live Mintlify deployment origin
- keep `docs.apiosk.com` as the public domain on Netlify if you want Netlify in front

Build output:

- build command: `npm run build`
- publish directory: `dist`

If `APIO_DOCS_PROXY_TARGET` is not set, the deploy will still succeed, but the site will render a configuration page telling you exactly what is missing.
