import { access } from "node:fs/promises";
import path from "node:path";
import { errorsFor, readDevices, root } from "./shared.mjs";

const devices = await readDevices(),
  errors = errorsFor(devices);
for (const d of devices)
  if (d.status === "published")
    try {
      await access(path.join(root, "public", d.images.frontOff));
    } catch {
      errors.push(`${d.id}: image missing`);
    }
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else console.log(`Catalog validation passed for ${devices.length} devices.`);
