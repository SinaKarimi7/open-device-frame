"use client";
import { useState } from "react";

function SubmitButton({ pending }: { pending: boolean }) { return <button className="button" disabled={pending}>{pending ? "Submitting…" : "Submit report"}</button>; }

export function DeviceRequestForm({ initialModel }: { initialModel: string }) { return <IssueForm type="device-request" initial={{ model: initialModel }} />; }
export function ReportForm({ kind, deviceId }: { kind: "incorrect-image" | "incorrect-metadata"; deviceId: string }) { return <IssueForm type={kind} initial={{ deviceId }} />; }

function IssueForm({ type, initial }: { type: string; initial: Record<string, string> }) {
  const [pending, setPending] = useState(false); const [message, setMessage] = useState("");
  async function submit(formData: FormData) { setPending(true); setMessage(""); const result = await fetch("/api/v1/issues", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData)) }); const body = await result.json() as { error?: { message: string }; url?: string }; setMessage(result.ok ? `Submitted: ${body.url ?? "issue created"}` : body.error?.message ?? "Unable to submit."); setPending(false); }
  return <form className="form" action={submit}><input type="hidden" name="type" value={type}/>{type === "device-request" && <><label>Brand<input name="brand" required maxLength={80}/></label><label>Model<input name="model" defaultValue={initial.model} required maxLength={120}/></label><label>Known model number<input name="modelNumber" maxLength={80}/></label></>} {type !== "device-request" && <><input type="hidden" name="deviceId" value={initial.deviceId}/><label>Problem category<select name="category"><option>Wrong phone model</option><option>Incorrect camera/sensor placement</option><option>Incorrect proportions</option><option>Incorrect image quality</option><option>Wrong alias</option><option>Wrong model number</option><option>Other</option></select></label></>}<label>Reference URL (optional)<input name="referenceUrl" type="url" maxLength={500}/></label><label>Details<textarea name="details" required maxLength={2000}/></label><SubmitButton pending={pending}/>{message && <p role="status">{message}</p>}</form>;
}
