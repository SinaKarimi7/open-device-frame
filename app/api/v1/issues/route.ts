import { apiError } from "@/lib/api/response";
import { getDevice, resolveDevice } from "@/lib/catalog/catalog";

const validTypes = new Set([
  "device-request",
  "incorrect-image",
  "incorrect-metadata",
]);
const value = (input: unknown, maximum: number) =>
  typeof input === "string" && input.trim().length <= maximum
    ? input.trim()
    : "";
export async function POST(request: Request) {
  const input: unknown = await request.json().catch(() => undefined);
  if (!input || typeof input !== "object")
    return apiError("INVALID_REQUEST", "Request body must be JSON.", 400);
  const body = input as Record<string, unknown>;
  const type = value(body.type, 40);
  const details = value(body.details, 2000);
  const referenceUrl = value(body.referenceUrl, 500);
  if (!validTypes.has(type) || !details)
    return apiError(
      "INVALID_REQUEST",
      "A valid report type and details are required.",
      400,
    );
  if (referenceUrl)
    try {
      new URL(referenceUrl);
    } catch {
      return apiError("INVALID_REQUEST", "Reference URL must be valid.", 400);
    }
  const brand = value(body.brand, 80);
  const model = value(body.model, 120);
  const deviceId = value(body.deviceId, 120);
  if (type === "device-request" && (!brand || !model))
    return apiError("INVALID_REQUEST", "Brand and model are required.", 400);
  if (type === "device-request" && (await resolveDevice(`${brand} ${model}`)))
    return apiError(
      "INVALID_REQUEST",
      "This device already exists in the catalog.",
      409,
    );
  const device = deviceId ? await getDevice(deviceId) : undefined;
  if (type !== "device-request" && !device)
    return apiError(
      "DEVICE_NOT_FOUND",
      "The device report target was not found.",
      404,
      deviceId,
    );
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  if (!token || !repository)
    return apiError(
      "INTERNAL_ERROR",
      "Issue submission is not configured yet. Please open an issue directly on GitHub.",
      503,
    );
  const title =
    type === "device-request"
      ? `Device request: ${brand} ${model}`
      : `${type === "incorrect-image" ? "Incorrect image" : "Incorrect metadata"}: ${device?.brand} ${device?.model}`;
  const issueBody = [
    `## ${type}`,
    `Device ID: ${device?.id ?? "N/A"}`,
    `Brand: ${brand || device?.brand || "N/A"}`,
    `Model: ${model || device?.model || "N/A"}`,
    `Image: ${device?.images.frontOff ?? "N/A"}`,
    `Reference: ${referenceUrl || "N/A"}`,
    "",
    "### Details",
    details,
  ].join("\n");
  const response = await fetch(
    `https://api.github.com/repos/${repository}/issues`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ title, body: issueBody, labels: [type] }),
    },
  );
  if (!response.ok)
    return apiError(
      "INTERNAL_ERROR",
      "GitHub could not create the issue.",
      502,
    );
  const created = (await response.json()) as { html_url: string };
  return Response.json({ url: created.html_url }, { status: 201 });
}
