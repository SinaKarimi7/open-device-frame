const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const attempts = new Map<string, { count: number; expiresAt: number }>();

export function takeIssueRequestSlot(request: Request): number | undefined {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0];
  const client = forwarded?.trim().slice(0, 100) || "unknown";
  const now = Date.now();
  const current = attempts.get(client);

  if (!current || current.expiresAt <= now) {
    attempts.set(client, { count: 1, expiresAt: now + WINDOW_MS });
    return undefined;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW)
    return Math.ceil((current.expiresAt - now) / 1000);

  current.count += 1;
  return undefined;
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function issueTitleExists(
  issues: Array<{ title?: unknown }>,
  title: string,
): boolean {
  const normalized = title.trim().toLocaleLowerCase();
  return issues.some(
    (issue) =>
      typeof issue.title === "string" &&
      issue.title.trim().toLocaleLowerCase() === normalized,
  );
}
