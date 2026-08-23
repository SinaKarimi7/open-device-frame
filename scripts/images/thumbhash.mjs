import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { rgbaToThumbHash } from "thumbhash";
import { readDevices, root } from "../catalog/shared.mjs";

const published = (await readDevices()).filter(
  (device) => device.status === "published",
);

await Promise.all(
  published.map(async (device) => {
    const imagePath = path.join(root, "public", device.images.frontOff);
    const image = await sharp(imagePath)
      .ensureAlpha()
      .resize({
        width: 100,
        height: 100,
        fit: "inside",
        withoutEnlargement: true,
      })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const thumbhash = Buffer.from(
      rgbaToThumbHash(image.info.width, image.info.height, image.data),
    ).toString("base64");
    const recordPath = path.join(
      root,
      "catalog",
      "devices",
      device.id.split("-")[0],
      `${device.id}.json`,
    );
    const record = JSON.parse(await readFile(recordPath, "utf8"));
    record.images.thumbhash = thumbhash;
    await writeFile(recordPath, `${JSON.stringify(record, null, 2)}\n`);
  }),
);

console.log(`Generated ThumbHashes for ${published.length} device frames.`);
