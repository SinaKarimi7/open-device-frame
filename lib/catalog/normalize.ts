export function normalizeDeviceQuery(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function slugifyBrand(brand: string): string {
  return normalizeDeviceQuery(brand);
}
