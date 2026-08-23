import { allPublishedDevices, brands } from "@/lib/catalog/catalog";

export default async function HomePage() {
  const [devices, brandList] = await Promise.all([
    allPublishedDevices(),
    brands(),
  ]);
  return (
    <section className="hero">
      <p className="eyebrow">OPEN DEVICE CATALOG</p>
      <h1>Phone images your interface can rely on.</h1>
      <p>
        Standardized, community-maintained device illustrations, committed
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
