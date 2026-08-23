import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Device frame API documentation",
  description:
    "Use the Open Device Frame API to resolve, search, and retrieve transparent device-frame assets.",
  alternates: { canonical: "/api-docs" },
};

const example = `const response = await fetch(
  "/api/v1/resolve?model=Apple%20iPhone%2016%20Pro",
);
const { match } = await response.json();

// A repository-relative PNG or WebP path.
const imageUrl = match.images.frontOff;`;

const errorExample = `{
  "error": {
    "code": "DEVICE_NOT_FOUND",
    "message": "No matching device was found.",
    "query": "Pixel 99 Ultra"
  }
}`;

export default function ApiDocsPage() {
  return (
    <article>
      <p className="eyebrow">API V1</p>
      <h1>Repository-backed device frames.</h1>
      <p>
        The API serves the published catalog committed to this repository. It
        has no database or runtime upstream dependency. Every image path is a
        repository-relative PNG or WebP URL.
      </p>
      <h2>Endpoints</h2>
      <ul>
        <li>
          <code>GET /api/v1/devices/:id</code> — one canonical published record.
        </li>
        <li>
          <code>GET /api/v1/resolve?model=Apple%20iPhone%2016%20Pro</code> —
          exact, normalized, alias, or hardware-identifier lookup.
        </li>
        <li>
          <code>GET /api/v1/search?q=iphone</code> — partial search across IDs,
          brands, models, aliases, and model numbers.
        </li>
        <li>
          <code>GET /api/v1/brands</code> — available published brands.
        </li>
        <li>
          <code>GET /api/v1/brands/apple/devices</code> — published devices for
          a brand slug.
        </li>
        <li>
          <code>GET /api/v1/catalog</code> — catalog version, device count, and
          brand count.
        </li>
      </ul>
      <h2>Device response</h2>
      <p>
        A device record includes its stable ID, brand, model, family, release
        year, aliases, known model numbers, and image variants. The initial
        visual variant is <code>images.frontOff</code>.
      </p>
      <pre>
        <code>{example}</code>
      </pre>
      <h2>Image URLs</h2>
      <p>
        <code>images.frontOff</code> is a relative path such as{" "}
        <code>/devices/apple/iphone-16-pro.webp</code>. Frames are
        community-maintained black device-frame illustrations with transparent
        backgrounds and display openings—not official manufacturer photography.
      </p>
      <h2>Errors and caching</h2>
      <p>
        Successful read responses are cacheable. Invalid or missing queries use
        a stable JSON error envelope and are not cached.
      </p>
      <pre>
        <code>{errorExample}</code>
      </pre>
      <p>
        Read endpoints return <code>INVALID_QUERY</code> for missing query
        parameters and <code>DEVICE_NOT_FOUND</code> when no published device
        matches. Coverage is intentionally incomplete; request a missing device
        from the catalog rather than assuming a close match.
      </p>
    </article>
  );
}
