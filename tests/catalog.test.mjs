import assert from "node:assert/strict";
import test from "node:test";
import {
  errorsFor,
  normalize,
  readDevices,
} from "../scripts/catalog/shared.mjs";

const devices = await readDevices();
test("catalog records satisfy validation", () =>
  assert.deepEqual(errorsFor(devices), []));
test("normalization handles aliases", () =>
  assert.equal(normalize("Google Pixel 9 Pro"), "googlepixel9pro"));
test("published devices use real PNG or WebP frame assets", () => {
  const published = devices.filter((device) => device.status === "published");
  assert.equal(published.length, 50);
  assert.ok(
    published.every((device) => /\.(?:png|webp)$/.test(device.images.frontOff)),
  );
});
