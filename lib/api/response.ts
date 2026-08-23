import { NextResponse } from "next/server";

export function apiError(code: string, message: string, status: number, query?: string): NextResponse {
  return NextResponse.json({ error: { code, message, ...(query ? { query } : {}) } }, { status, headers: { "Cache-Control": "no-store" } });
}

export function apiJson(data: unknown): NextResponse {
  return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400" } });
}
