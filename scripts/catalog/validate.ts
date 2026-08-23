import { access } from "node:fs/promises";
import path from "node:path";
import { readSourceDevices } from "../../lib/catalog/source";
import { validateCatalog } from "../../lib/catalog/validation";

const devices = await readSourceDevices();
const errors = validateCatalog(devices);
for (const device of devices) {
  try { await access(path.join(process.cwd(), "public", device.images.frontOff)); }
  catch { errors.push(`${device.id}: referenced image does not exist (${device.images.frontOff})`); }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else console.log(`Catalog validation passed for ${devices.length} devices.`);
