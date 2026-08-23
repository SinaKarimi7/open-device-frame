import { readFile } from "node:fs/promises";
import path from "node:path";
import { readSourceDevices } from "../../lib/catalog/source";

const errors: string[] = [];
for (const device of await readSourceDevices()) {
  const filename = path.join(process.cwd(), "public", device.images.frontOff);
  try {
    const source = await readFile(filename, "utf8");
    if (!source.includes("<svg") || !source.includes("viewBox")) errors.push(`${device.id}: image is not a valid SVG asset`);
    if (Buffer.byteLength(source) > 100_000) errors.push(`${device.id}: image exceeds 100KB maximum`);
  } catch { errors.push(`${device.id}: image is unreadable`); }
}
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log("Image validation passed.");
