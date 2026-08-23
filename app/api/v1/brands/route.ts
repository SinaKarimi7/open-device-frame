import { brands } from "@/lib/catalog/catalog";
import { apiJson } from "@/lib/api/response";
export async function GET() { return apiJson({ brands: await brands() }); }
