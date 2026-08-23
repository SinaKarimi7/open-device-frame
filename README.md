# Community Phone Device Image API

A free, repository-backed catalog of community-maintained phone illustrations. The catalog files and final assets in this repository are the canonical source of truth; the Next.js website and API are deterministic views over them.

## Quick start

```bash
pnpm install
pnpm catalog:build
pnpm verify
pnpm dev
```

## Catalog and assets

- Canonical devices: `catalog/devices/<brand>/<device>.json`
- Generated indexes: `catalog/generated/` (never edit these by hand)
- Assets: `public/devices/<brand>/<device>.svg`

Initial assets use SVG with a 360×720 portrait viewBox, transparent background, a straight-on full device, and powered-off black screen. Files must be under 100KB. This is deliberately an illustration contract, not manufacturer-authorized photography.

## API

- `GET /api/v1/devices/:id`
- `GET /api/v1/resolve?model=Pixel%209%20Pro`
- `GET /api/v1/search?q=pixel`
- `GET /api/v1/brands`
- `GET /api/v1/brands/:brand/devices`
- `GET /api/v1/catalog`

See `/api-docs` in the running application for examples and the error contract.

## GitHub issue forms

The browser form posts to GitHub only when both `GITHUB_TOKEN` (least-privileged Issues write token) and `GITHUB_REPOSITORY` (`owner/repo`) are configured on the server. Neither value may use a `NEXT_PUBLIC_` prefix.

Before public launch, configure GitHub labels: `device-request`, `incorrect-image`, `incorrect-metadata`, `duplicate`, `needs-reference`, `needs-triage`, `help-wanted`, and `good-first-issue`.

## Licensing

No license is selected yet. Code, catalog data, and image assets need separate licensing decisions before public contributions are accepted. This is a launch blocker, not a legal assertion.
