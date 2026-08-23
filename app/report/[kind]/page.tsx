import { notFound } from "next/navigation";
import { ReportForm } from "@/components/issue-form";
export default async function ReportPage({ params, searchParams }: { params: Promise<{ kind: string }>; searchParams: Promise<{ device?: string }> }) { const kind = (await params).kind; if (kind !== "incorrect-image" && kind !== "incorrect-metadata") notFound(); return <><p className="eyebrow">COMMUNITY REPORT</p><h1>Report {kind === "incorrect-image" ? "an incorrect image" : "a metadata problem"}</h1><ReportForm kind={kind} deviceId={(await searchParams).device ?? ""} /></>; }
