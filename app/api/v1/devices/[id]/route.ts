import { getDevice } from "@/lib/catalog/catalog";
import { apiError, apiJson } from "@/lib/api/response";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { const id = (await params).id; const device = await getDevice(id); return device ? apiJson(device) : apiError("DEVICE_NOT_FOUND", "No matching device was found.", 404, id); }
