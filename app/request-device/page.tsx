import type { Metadata } from "next";
import { DeviceRequestForm } from "@/components/issue-form";

export const metadata: Metadata = {
  title: "Request a device frame",
  robots: { index: false, follow: true },
};
export default async function RequestDevicePage({
  searchParams,
}: {
  searchParams: Promise<{ model?: string }>;
}) {
  return (
    <>
      <p className="eyebrow">COMMUNITY REQUEST</p>
      <h1>Request a missing device</h1>
      <p>
        We’ll first check the catalog, then create a structured GitHub Issue
        when configured.
      </p>
      <DeviceRequestForm initialModel={(await searchParams).model ?? ""} />
    </>
  );
}
