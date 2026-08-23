import assert from "node:assert/strict";
import test from "node:test";
import { resolveDevice, searchDevices } from "../lib/catalog/catalog";
import { validateRecord } from "../lib/catalog/validation";

test("resolves canonical names, aliases, and hardware identifiers", async () => {
  assert.equal((await resolveDevice("Pixel 9 Pro"))?.id, "google-pixel-9-pro");
  assert.equal((await resolveDevice("pixel9pro"))?.id, "google-pixel-9-pro");
  assert.equal((await resolveDevice("SM-S928B"))?.id, "samsung-galaxy-s24-ultra");
});
test("finds partial model queries", async () => assert.ok((await searchDevices("galaxy")).some((device) => device.id === "samsung-galaxy-s24-ultra")));
test("rejects malformed records", () => assert.ok(validateRecord({ id: "Bad ID" }).length > 0));
