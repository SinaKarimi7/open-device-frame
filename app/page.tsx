import { allPublishedDevices, brands } from "@/lib/catalog/catalog";

export default async function HomePage() {
  const [devices, brandList] = await Promise.all([
    allPublishedDevices(),
    brands(),
  ]);
  return (
    <section className="hero">
      <p className="eyebrow">OPEN DEVICE FRAME</p>
      <h1>Transparent device frames for your interface.</h1>
      <p>
        Open, standardized phone-frame assets and a public API, committed
        directly to the repository.
      </p>
      <div className="actions">
        <a className="button" href="/devices">
          Browse {devices.length} devices
        </a>
        <a className="button secondary" href="/api-docs">
          Use the API
        </a>
      </div>
      <p className="muted">Currently covering {brandList.join(", ")}.</p>
    </section>
  );
}
