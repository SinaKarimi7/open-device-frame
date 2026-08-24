"use client";
import { useState } from "react";

function SubmitButton({
  pending,
  requestType,
}: {
  pending: boolean;
  requestType: string;
}) {
  return (
    <button className="button" disabled={pending}>
      {pending
        ? "Submitting…"
        : requestType === "device-request"
          ? "Submit device request"
          : "Submit report"}
    </button>
  );
}

type SubmissionState =
  | { status: "idle" }
  | { status: "success"; url: string }
  | { status: "error"; message: string };

export function DeviceRequestForm({ initialModel }: { initialModel: string }) {
  return <IssueForm type="device-request" initial={{ model: initialModel }} />;
}
export function ReportForm({
  kind,
  deviceId,
}: {
  kind: "incorrect-image" | "incorrect-metadata";
  deviceId: string;
}) {
  return <IssueForm type={kind} initial={{ deviceId }} />;
}

function IssueForm({
  type,
  initial,
}: {
  type: string;
  initial: Record<string, string>;
}) {
  const [pending, setPending] = useState(false);
  const [submission, setSubmission] = useState<SubmissionState>({
    status: "idle",
  });
  async function submit(formData: FormData) {
    setPending(true);
    setSubmission({ status: "idle" });
    try {
      const result = await fetch("/api/v1/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData)),
      });
      const body = (await result.json().catch(() => ({}))) as {
        error?: { message: string };
        url?: string;
      };
      if (result.ok && body.url) {
        setSubmission({ status: "success", url: body.url });
      } else {
        setSubmission({
          status: "error",
          message: body.error?.message ?? "Unable to submit the report.",
        });
      }
    } catch {
      setSubmission({
        status: "error",
        message: "Could not reach the server. Please try again.",
      });
    } finally {
      setPending(false);
    }
  }
  return (
    <form className="form" action={submit}>
      <input type="hidden" name="type" value={type} />
      {type === "device-request" && (
        <>
          <label>
            Brand
            <input name="brand" required maxLength={80} />
          </label>
          <label>
            Model
            <input
              name="model"
              defaultValue={initial.model}
              required
              maxLength={120}
            />
          </label>
          <label>
            Known model number (optional)
            <input name="modelNumber" maxLength={80} />
          </label>
          <label>
            Suggested device image URL (optional)
            <input
              name="imageUrl"
              type="url"
              maxLength={500}
              aria-describedby="image-url-help"
            />
            <span className="field-help" id="image-url-help">
              Link to a clear, front-facing image that can guide the frame
              illustration.
            </span>
          </label>
        </>
      )}{" "}
      {type !== "device-request" && (
        <>
          <input type="hidden" name="deviceId" value={initial.deviceId} />
          <label>
            Problem category
            <select name="category">
              {(type === "incorrect-image"
                ? [
                    "Wrong phone model",
                    "Incorrect camera/sensor placement",
                    "Incorrect proportions",
                    "Incorrect image quality",
                    "Other",
                  ]
                : [
                    "Wrong alias",
                    "Wrong model number",
                    "Wrong brand or model name",
                    "Other",
                  ]
              ).map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
        </>
      )}
      <label>
        Reference URL (optional)
        <input name="referenceUrl" type="url" maxLength={500} />
      </label>
      <label>
        Details
        <textarea name="details" required maxLength={2000} />
      </label>
      <SubmitButton pending={pending} requestType={type} />
      {submission.status === "success" && (
        <div className="submission-success" role="status">
          <strong>Request submitted</strong>
          <p>Your GitHub issue was created successfully.</p>
          <a
            className="button"
            href={submission.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View GitHub issue →
          </a>
        </div>
      )}
      {submission.status === "error" && (
        <p className="submission-error" role="alert">
          {submission.message}
        </p>
      )}
    </form>
  );
}
