import { readFile } from "node:fs/promises";
import path from "node:path";
import { normalizeDeviceQuery, slugifyBrand } from "@/lib/catalog/normalize";
import { readSourceDevices } from "@/lib/catalog/source";
import type { DeviceRecord } from "@/lib/catalog/types";

let devicesPromise: Promise<DeviceRecord[]> | undefined;
async function devices(): Promise<DeviceRecord[]> {
  devicesPromise ??= readSourceDevices();
  return devicesPromise;
}

export async function allPublishedDevices(): Promise<DeviceRecord[]> {
  return (await devices()).filter((device) => device.status === "published");
}

export async function getDevice(id: string): Promise<DeviceRecord | undefined> {
  return (await allPublishedDevices()).find((device) => device.id === id);
}

export async function resolveDevice(
  query: string,
): Promise<DeviceRecord | undefined> {
  const source = await allPublishedDevices();
  const normalized = normalizeDeviceQuery(query);
  const exact = (values: (device: DeviceRecord) => string[]) =>
    source.find((device) => values(device).includes(query));
  return (
    exact((device) => [device.id]) ??
    exact((device) => [device.model]) ??
    source.find(
      (device) => normalizeDeviceQuery(device.model) === normalized,
    ) ??
    exact((device) => device.aliases) ??
    source.find((device) =>
      device.aliases.some(
        (alias) => normalizeDeviceQuery(alias) === normalized,
      ),
    ) ??
    exact((device) => device.modelNumbers)
  );
}

export async function searchDevices(query: string): Promise<DeviceRecord[]> {
  const normalized = normalizeDeviceQuery(query);
  if (!normalized) return [];
  return (await allPublishedDevices()).filter((device) =>
    [
      device.id,
      device.brand,
      device.model,
      ...device.aliases,
      ...device.modelNumbers,
    ].some((value) => normalizeDeviceQuery(value).includes(normalized)),
  );
}

export async function brands(): Promise<string[]> {
  return [
    ...new Set((await allPublishedDevices()).map((device) => device.brand)),
  ].sort();
}

export async function devicesByBrand(brand: string): Promise<DeviceRecord[]> {
  return (await allPublishedDevices()).filter(
    (device) => slugifyBrand(device.brand) === brand,
  );
}

export async function catalogVersion(): Promise<string> {
  try {
    const packageJson = JSON.parse(
      await readFile(path.join(process.cwd(), "package.json"), "utf8"),
    ) as { version: string };
    return packageJson.version;
  } catch {
    return "development";
  }
}
