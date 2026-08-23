import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { readSourceDevices } from "../../lib/catalog/source";
import { normalizeDeviceQuery, slugifyBrand } from "../../lib/catalog/normalize";

const output = path.join(process.cwd(), "catalog", "generated");
const devices = await readSourceDevices();
const published = devices.filter((device) => device.status === "published");
const aliases = Object.fromEntries(published.flatMap((device) => [device.model, ...device.aliases, ...device.modelNumbers].map((value) => [normalizeDeviceQuery(value), device.id])));
const brands = Object.fromEntries([...new Set(published.map((device) => device.brand))].sort().map((brand) => [slugifyBrand(brand), published.filter((device) => device.brand === brand).map((device) => device.id)]));
await mkdir(output, { recursive: true });
await Promise.all([
  writeFile(path.join(output, "devices.json"), `${JSON.stringify(published, null, 2)}\n`),
  writeFile(path.join(output, "aliases.json"), `${JSON.stringify(aliases, null, 2)}\n`),
  writeFile(path.join(output, "brands.json"), `${JSON.stringify(brands, null, 2)}\n`),
]);
console.log(`Built catalog indexes for ${published.length} devices.`);
