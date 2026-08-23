import { apiJson } from "@/lib/api/response";
import { brands } from "@/lib/catalog/catalog";
export async function GET() {
  return apiJson({ brands: await brands() });
}
