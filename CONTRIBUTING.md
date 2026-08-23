# Contributing

Thank you for helping make the catalog more accurate. GitHub is the source of truth for code, metadata, images, discussion, and review.

## Add or update a device

1. Confirm the model is visually distinct; regional hardware identifiers normally share one canonical visual record.
2. Add or edit `catalog/devices/<brand>/<id>.json`. Canonical IDs are lowercase ASCII hyphenated slugs.
3. Add the final normalized SVG in `public/devices/<brand>/<file>.svg`.
4. Run `pnpm catalog:build` and `pnpm verify`.
5. Commit generated index changes and open a pull request explaining the source or correction.

Do not add raw sources, temporary generation candidates, manufacturer photos you lack rights to contribute, or private image-creation metadata. Final assets must be original or properly licensed for the project’s eventual asset terms.

## Metadata

Use aliases for common marketing-name variants and `modelNumbers` for regional hardware identifiers. Do not make a new visual device record only for a model number.

## Required checks

```bash
pnpm catalog:build
pnpm verify
```
