import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Open Device Frame: open device frames and a public image API.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const imagePath = join(process.cwd(), "public", "open-device-frame-og.png");

export default async function OpenGraphImage() {
  const image = await readFile(imagePath);

  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": contentType },
  });
}
