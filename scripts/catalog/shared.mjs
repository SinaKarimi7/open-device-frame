import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
export const root = process.cwd();
async function filesIn(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory()
          ? filesIn(path.join(dir, e.name))
          : e.name.endsWith(".json")
            ? [path.join(dir, e.name)]
            : [],
      ),
    )
  ).flat();
}
export async function readDevices() {
  return (
    await Promise.all(
      (
        await filesIn(path.join(root, "catalog", "devices"))
      ).map(async (f) => JSON.parse(await readFile(f, "utf8"))),
    )
  ).sort((a, b) => a.id.localeCompare(b.id));
}
export const normalize = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
export function errorsFor(devices) {
  const errors = [];
  const claims = new Map();
  for (const d of devices) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.id || ""))
      errors.push(`${d.id || "unknown"}: invalid id`);
    if (!d.brand || !d.model)
      errors.push(`${d.id || "unknown"}: brand and model are required`);
    if (!Array.isArray(d.aliases) || !Array.isArray(d.modelNumbers))
      errors.push(
        `${d.id || "unknown"}: aliases and modelNumbers must be arrays`,
      );
    if (
      d.images?.frontOff !== undefined &&
      !/^\/devices\/[a-z0-9-]+\/[a-z0-9-]+\.(?:png|svg)$/.test(
        d.images.frontOff,
      )
    )
      errors.push(`${d.id || "unknown"}: invalid frontOff image path`);
    if (d.status === "published" && !d.images?.frontOff)
      errors.push(
        `${d.id || "unknown"}: published records require frontOff image`,
      );
    if (!["published", "draft", "deprecated"].includes(d.status))
      errors.push(`${d.id || "unknown"}: invalid status`);
    const lookupClaims =
      d.status === "published"
        ? [d.id, d.model, ...(d.aliases || []), ...(d.modelNumbers || [])]
        : [];
    for (const claim of lookupClaims) {
      const key = normalize(claim || "");
      const owner = claims.get(key);
      if (owner && owner !== d.id)
        errors.push(
          `conflicting lookup value '${claim}' between ${owner} and ${d.id}`,
        );
      claims.set(key, d.id);
    }
  }
  return errors;
}
