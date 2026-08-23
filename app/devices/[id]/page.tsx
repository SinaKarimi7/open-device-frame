import { notFound } from "next/navigation";
import { getDevice } from "@/lib/catalog/catalog";

export default async function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const device = await getDevice((await params).id);
  if (!device) notFound();
  return <article className="device-detail"><img src={device.images.frontOff} alt={`${device.brand} ${device.model} front view`} /><div><p className="eyebrow">{device.brand}</p><h1>{device.model}</h1><p className="muted">Canonical ID: <code>{device.id}</code></p><dl><dt>Aliases</dt><dd>{device.aliases.join(", ") || "—"}</dd><dt>Model numbers</dt><dd>{device.modelNumbers.join(", ") || "—"}</dd>{device.releaseYear && <><dt>Release year</dt><dd>{device.releaseYear}</dd></>}</dl><h2>Use this image</h2><pre><code>{device.images.frontOff}</code></pre><div className="actions"><a className="button secondary" href={`/api/v1/devices/${device.id}`}>API response</a><a className="button secondary" href={`/report/incorrect-image?device=${device.id}`}>Report image</a><a className="button secondary" href={`/report/incorrect-metadata?device=${device.id}`}>Report metadata</a></div></div></article>;
}
