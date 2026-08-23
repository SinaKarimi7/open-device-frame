import { allPublishedDevices, brands, catalogVersion } from "@/lib/catalog/catalog";
import { apiJson } from "@/lib/api/response";
export async function GET() { const [devices, brandList, version] = await Promise.all([allPublishedDevices(), brands(), catalogVersion()]); return apiJson({ version, deviceCount: devices.length, brandCount: brandList.length }); }
