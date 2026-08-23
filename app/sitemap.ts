import type { MetadataRoute } from "next";
import { allPublishedDevices } from "@/lib/catalog/catalog";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const devices = await allPublishedDevices();
  return [
    { url: siteUrl.toString(), changeFrequency: "weekly", priority: 1 },
    {
      url: new URL("/devices", siteUrl).toString(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: new URL("/api-docs", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...devices.map((device) => ({
      url: new URL(`/devices/${device.id}`, siteUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
