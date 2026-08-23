import { apiError, apiJson } from "@/lib/api/response";
import { devicesByBrand } from "@/lib/catalog/catalog";
export async function GET(
  _: Request,
  { params }: { params: Promise<{ brand: string }> },
) {
  const brand = (await params).brand;
  const devices = await devicesByBrand(brand);
  return devices.length
    ? apiJson({ brand, devices })
    : apiError(
        "DEVICE_NOT_FOUND",
        "No devices were found for this brand.",
        404,
        brand,
      );
}
