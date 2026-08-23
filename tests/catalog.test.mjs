import assert from "node:assert/strict";
import test from "node:test";
import { readDevices, errorsFor, normalize } from "../scripts/catalog/shared.mjs";
const devices=await readDevices();
test("canonical fixtures satisfy catalog validation",()=>assert.deepEqual(errorsFor(devices),[]));
test("normalization handles aliases",()=>assert.equal(normalize("Google Pixel 9 Pro"),"googlepixel9pro"));
test("Samsung hardware identifiers remain on one canonical device",()=>assert.equal(devices.find(d=>d.modelNumbers.includes("SM-S928B"))?.id,"samsung-galaxy-s24-ultra"));
