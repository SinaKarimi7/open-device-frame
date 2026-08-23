import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { DeviceRecord } from "@/lib/catalog/types";

const deviceRoot = path.join(process.cwd(), "catalog", "devices");

async function filesIn(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(target) : entry.name.endsWith(".json") ? [target] : [];
  }));
  return nested.flat();
}

export async function readSourceDevices(): Promise<DeviceRecord[]> {
  const files = await filesIn(deviceRoot);
  const devices = await Promise.all(files.map(async (file) => JSON.parse(await readFile(file, "utf8")) as DeviceRecord));
  return devices.sort((left, right) => left.id.localeCompare(right.id));
}
