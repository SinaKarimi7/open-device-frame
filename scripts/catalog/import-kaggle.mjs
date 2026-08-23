import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalize, root } from "./shared.mjs";

const args = process.argv.slice(2);
const input = args[args.indexOf("--input") + 1];
const write = args.includes("--write");
if (!input)
  throw new Error(
    "Usage: pnpm catalog:import -- --input <phones.json> [--write]",
  );
const rows = JSON.parse(await readFile(path.resolve(input), "utf8"));
if (!Array.isArray(rows)) throw new Error("Expected the Kaggle JSON array.");
const slug = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const stripStorage = (model) =>
  model
    .replace(
      /\s*\((?:\d+(?:\.\d+)?\s*(?:GB|TB)|\d+GB\s*\/\s*\d+GB)[^)]*\)\s*$/i,
      "",
    )
    .trim();
const records = new Map();
for (const row of rows) {
  if (row.device_type !== "Smartphone" || !row.brand || !row.model) continue;
  const model = stripStorage(row.model);
  const id = `${slug(row.brand)}-${slug(model)}`;
  const year = Number.parseInt(
    String(row.release_date ?? "").match(/\b(19|20)\d{2}\b/)?.[0] ?? "",
    10,
  );
  const existing = records.get(id) ?? {
    id,
    brand: row.brand.trim(),
    model,
    aliases: [],
    modelNumbers: [],
    images: {},
    status: "draft",
    notes:
      "Imported metadata only; requires maintainer review and a final approved asset before publication.",
    provenance: [
      {
        source: "Kaggle: Global Smartphone Database 2025",
        url: "https://www.kaggle.com/datasets/rajibdab/global-smartphone-database-2025",
        license: "Apache-2.0",
        retrievedAt: "2026-08-23",
      },
    ],
  };
  if (row.model !== model && !existing.aliases.includes(row.model))
    existing.aliases.push(row.model);
  if (Number.isInteger(year) && !existing.releaseYear)
    existing.releaseYear = year;
  records.set(id, existing);
}
const output = [...records.values()].sort((a, b) => a.id.localeCompare(b.id));
console.log(
  `Prepared ${output.length} unique draft records from ${rows.length} source rows.`,
);
if (write)
  for (const record of output) {
    const directory = path.join(root, "catalog", "devices", slug(record.brand));
    await mkdir(directory, { recursive: true });
    try {
      await writeFile(
        path.join(directory, `${record.id}.json`),
        `${JSON.stringify(record, null, 2)}\n`,
        { flag: "wx" },
      );
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
  }
