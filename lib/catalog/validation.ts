import type { DeviceRecord } from "@/lib/catalog/types";

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const imagePattern = /^\/devices\/[a-z0-9-]+\/[a-z0-9-]+\.png$/;
const statuses = new Set(["published", "draft", "deprecated"]);

export function validateRecord(value: unknown): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return ["must be an object"];
  const device = value as Partial<DeviceRecord>;
  const errors: string[] = [];
  if (typeof device.id !== "string" || !idPattern.test(device.id))
    errors.push("id must be a lowercase hyphenated slug");
  for (const key of ["brand", "model"] as const)
    if (typeof device[key] !== "string" || !device[key].trim())
      errors.push(`${key} is required`);
  for (const key of ["aliases", "modelNumbers"] as const) {
    if (
      !Array.isArray(device[key]) ||
      device[key].some((item) => typeof item !== "string" || !item.trim())
    )
      errors.push(`${key} must be an array of non-empty strings`);
  }
  if (!device.images || typeof device.images !== "object")
    errors.push("images is required");
  if (
    device.images?.frontOff !== undefined &&
    (typeof device.images.frontOff !== "string" ||
      !imagePattern.test(device.images.frontOff))
  )
    errors.push("images.frontOff must be a /devices/<brand>/<file>.png path");
  if (device.status === "published" && !device.images?.frontOff)
    errors.push("published records require images.frontOff");
  if (!statuses.has(device.status ?? ""))
    errors.push("status must be published, draft, or deprecated");
  if (
    device.releaseYear !== undefined &&
    (!Number.isInteger(device.releaseYear) ||
      device.releaseYear < 1980 ||
      device.releaseYear > 2100)
  )
    errors.push("releaseYear must be a valid year");
  return errors;
}

export function validateCatalog(devices: DeviceRecord[]): string[] {
  const errors = devices.flatMap((device) =>
    validateRecord(device).map(
      (error) => `${device.id || "unknown"}: ${error}`,
    ),
  );
  const claims = new Map<string, string>();
  for (const device of devices) {
    for (const claim of [
      device.id,
      device.model,
      ...device.aliases,
      ...device.modelNumbers,
    ]) {
      const normalized = claim.toLowerCase().replace(/[^a-z0-9]/g, "");
      const owner = claims.get(normalized);
      if (owner && owner !== device.id)
        errors.push(
          `conflicting lookup value '${claim}' between ${owner} and ${device.id}`,
        );
      claims.set(normalized, device.id);
    }
  }
  return errors;
}
