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
