import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeviceImage } from "@/components/device-image";
import { getDevice } from "@/lib/catalog/catalog";
import { siteName } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const device = await getDevice((await params).id);
  if (!device) return { title: "Device not found", robots: { index: false } };
  const name = `${device.brand} ${device.model}`;
  const description = `Transparent ${name} front device-frame asset from ${siteName}.`;
  return {
    title: `${name} device frame`,
    description,
    alternates: { canonical: `/devices/${device.id}` },
    openGraph: {
      title: `${name} device frame`,
      description,
      images: [
        { url: device.images.frontOff!, alt: `${name} front device frame` },
      ],
    },
  };
}

export default async function DevicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const device = await getDevice((await params).id);
  if (!device) notFound();
  return (
    <article className="device-detail">
      <div className="device-detail-image">
        <DeviceImage
          alt={`${device.brand} ${device.model} front view`}
          sizes="(max-width: 650px) 100vw, 40vw"
          src={device.images.frontOff!}
          thumbhash={device.images.thumbhash!}
        />
      </div>
      <div>
        <p className="eyebrow">{device.brand}</p>
        <h1>{device.model}</h1>
        <p className="muted">
          Canonical ID: <code>{device.id}</code>
        </p>
        <dl>
          <dt>Aliases</dt>
          <dd>{device.aliases.join(", ") || "—"}</dd>
          <dt>Model numbers</dt>
          <dd>{device.modelNumbers.join(", ") || "—"}</dd>
          {device.releaseYear && (
            <>
              <dt>Release year</dt>
              <dd>{device.releaseYear}</dd>
            </>
          )}
        </dl>
        <h2>Use this image</h2>
        <pre>
          <code>{device.images.frontOff}</code>
        </pre>
        <div className="actions">
          <a className="button secondary" href={`/api/v1/devices/${device.id}`}>
            API response
          </a>
          <a
            className="button secondary"
            href={`/report/incorrect-image?device=${device.id}`}
          >
            Report image
          </a>
          <a
            className="button secondary"
            href={`/report/incorrect-metadata?device=${device.id}`}
          >
            Report metadata
          </a>
        </div>
      </div>
    </article>
  );
}
