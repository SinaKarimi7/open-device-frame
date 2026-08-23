import { apiError, apiJson } from "@/lib/api/response";
import { searchDevices } from "@/lib/catalog/catalog";
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim();
  if (!query)
    return apiError("INVALID_QUERY", "The q query parameter is required.", 400);
  return apiJson({ query, results: await searchDevices(query) });
}
