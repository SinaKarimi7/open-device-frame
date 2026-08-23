"use client";
import { useMemo, useState } from "react";
import { DeviceImage } from "@/components/device-image";
import type { DeviceRecord } from "@/lib/catalog/types";

export function DeviceCatalog({
  devices,
  brands,
}: {
  devices: DeviceRecord[];
  brands: string[];
}) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const results = useMemo(
    () =>
      devices.filter(
        (device) =>
          (!brand || device.brand === brand) &&
          [
            device.brand,
            device.model,
            ...device.aliases,
            ...device.modelNumbers,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [brand, devices, query],
  );
  return (
    <section>
      <div className="filters">
        <input
          aria-label="Search devices"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search devices…"
        />
        <select
          aria-label="Filter by brand"
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
        >
          <option value="">All brands</option>
          {brands.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      {results.length ? (
        <div className="grid">
          {results.map((device) => (
            <a className="card" href={`/devices/${device.id}`} key={device.id}>
              <div className="card-image">
                <DeviceImage
                  alt=""
                  sizes="(max-width: 650px) 100vw, (max-width: 1120px) 50vw, 205px"
                  src={device.images.frontOff!}
                  thumbhash={device.images.thumbhash!}
                />
              </div>
              <span>{device.brand}</span>
              <strong>{device.model}</strong>
            </a>
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>We don’t have this device yet.</h2>
          <a
            className="button"
            href={`/request-device?model=${encodeURIComponent(query)}`}
          >
            Request this device
          </a>
        </div>
      )}
    </section>
  );
}
