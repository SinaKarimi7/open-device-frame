import { buildIssueBody } from "@/lib/api/issue-content";
import {
  isHttpUrl,
  issueTitleExists,
  takeIssueRequestSlot,
} from "@/lib/api/issue-guard";
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
  const retryAfter = takeIssueRequestSlot(request);
  if (retryAfter !== undefined)
    return apiError(
      "RATE_LIMITED",
      "Too many issue submissions. Please try again later.",
      429,
    );
  const input: unknown = await request.json().catch(() => undefined);
  if (!input || typeof input !== "object")
    return apiError("INVALID_REQUEST", "Request body must be JSON.", 400);
  const body = input as Record<string, unknown>;
  const type = value(body.type, 40);
  const details = value(body.details, 2000);
  const referenceUrl = value(body.referenceUrl, 500);
  const imageUrl = value(body.imageUrl, 500);
  if (!validTypes.has(type) || !details)
    return apiError(
      "INVALID_REQUEST",
      "A valid report type and details are required.",
      400,
    );
  if (referenceUrl && !isHttpUrl(referenceUrl))
    return apiError(
      "INVALID_REQUEST",
      "Reference URL must use HTTP or HTTPS.",
      400,
    );
  if (imageUrl && !isHttpUrl(imageUrl))
    return apiError(
      "INVALID_REQUEST",
      "Image URL must use HTTP or HTTPS.",
      400,
    );
  const brand = value(body.brand, 80);
  const model = value(body.model, 120);
  const modelNumber = value(body.modelNumber, 80);
  const category = value(body.category, 120);
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
  if (type === "device-request") {
    const existingIssues = await fetch(
      `https://api.github.com/repos/${repository}/issues?state=open&labels=device-request&per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
    if (
      existingIssues.ok &&
      issueTitleExists(await existingIssues.json(), title)
    )
      return apiError(
        "INVALID_REQUEST",
        "An open request already exists for this device.",
        409,
      );
  }
  const issueBody = buildIssueBody({
    type: type as "device-request" | "incorrect-image" | "incorrect-metadata",
    details,
    brand,
    model,
    modelNumber,
    imageUrl,
    referenceUrl,
    category,
    deviceId: device?.id,
    deviceBrand: device?.brand,
    deviceModel: device?.model,
    currentImage: device?.images.frontOff,
  });
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
