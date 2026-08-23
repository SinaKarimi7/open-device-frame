import { DeviceCatalog } from "@/components/device-catalog";
import { allPublishedDevices, brands } from "@/lib/catalog/catalog";

export default async function DevicesPage() {
  const [devices, brandList] = await Promise.all([
    allPublishedDevices(),
    brands(),
  ]);
  return (
    <>
      <section>
        <p className="eyebrow">CATALOG</p>
        <h1>All devices</h1>
        <p className="muted">
          Search by model, alias, or hardware model number.
        </p>
      </section>
      <DeviceCatalog devices={devices} brands={brandList} />
    </>
  );
}
