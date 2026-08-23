import { readFile } from "node:fs/promises";
import path from "node:path";
import { readDevices, root } from "../catalog/shared.mjs";

const errors = [];
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const riffSignature = Buffer.from("RIFF");
const webpSignature = Buffer.from("WEBP");
for (const d of await readDevices())
  if (d.status === "published")
    try {
      const image = await readFile(
        path.join(root, "public", d.images.frontOff),
      );
      const isPng = image.subarray(0, 8).compare(pngSignature) === 0;
      const isWebp =
        image.subarray(0, 4).compare(riffSignature) === 0 &&
        image.subarray(8, 12).compare(webpSignature) === 0;
      if (!isPng && !isWebp) errors.push(`${d.id}: invalid PNG or WebP`);
      if (image.length > 500000) errors.push(`${d.id}: image exceeds 500KB`);
    } catch {
      errors.push(`${d.id}: unreadable image`);
    }
for (const d of await readDevices())
  if (d.status === "published" && !d.images.thumbhash)
    errors.push(`${d.id}: missing ThumbHash placeholder`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else console.log("Image validation passed.");
