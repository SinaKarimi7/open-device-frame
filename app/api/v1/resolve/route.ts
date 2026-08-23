import { apiError, apiJson } from "@/lib/api/response";
import { resolveDevice } from "@/lib/catalog/catalog";
export async function GET(request: Request) {
  const model = new URL(request.url).searchParams.get("model")?.trim();
  if (!model)
    return apiError(
      "INVALID_QUERY",
      "The model query parameter is required.",
      400,
    );
  const device = await resolveDevice(model);
  return device
    ? apiJson({ query: model, match: device })
    : apiError("DEVICE_NOT_FOUND", "No matching device was found.", 404, model);
}
