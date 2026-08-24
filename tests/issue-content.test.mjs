import assert from "node:assert/strict";
import test from "node:test";
import { buildIssueBody } from "../lib/api/issue-content.ts";

test("device request issue includes every form field", () => {
  const body = buildIssueBody({
    type: "device-request",
    brand: "Samsung",
    model: "A55",
    modelNumber: "SM-A556B",
    imageUrl: "https://example.com/a55.png",
    referenceUrl: "https://example.com/a55",
    details: "Please add this device.",
  });

  assert.match(body, /\*\*Known model number:\*\* SM-A556B/);
  assert.match(
    body,
    /\*\*Suggested image:\*\* https:\/\/example\.com\/a55\.png/,
  );
  assert.match(body, /\*\*Reference:\*\* https:\/\/example\.com\/a55/);
  assert.match(body, /Please add this device\./);
});

test("correction issue includes category and current device context", () => {
  const body = buildIssueBody({
    type: "incorrect-image",
    deviceId: "samsung-a55",
    deviceBrand: "Samsung",
    deviceModel: "A55",
    category: "Incorrect proportions",
    currentImage: "/devices/samsung/a55.webp",
    details: "The frame is too wide.",
  });

  assert.match(body, /\*\*Device:\*\* Samsung A55/);
  assert.match(body, /\*\*Problem category:\*\* Incorrect proportions/);
  assert.match(body, /\*\*Current image:\*\* \/devices\/samsung\/a55\.webp/);
});
