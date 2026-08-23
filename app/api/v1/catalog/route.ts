import { apiJson } from "@/lib/api/response";
import {
  allPublishedDevices,
  brands,
  catalogVersion,
} from "@/lib/catalog/catalog";
export async function GET() {
  const [devices, brandList, version] = await Promise.all([
    allPublishedDevices(),
    brands(),
    catalogVersion(),
  ]);
  return apiJson({
    version,
    deviceCount: devices.length,
    brandCount: brandList.length,
  });
}
