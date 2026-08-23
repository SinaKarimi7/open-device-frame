import type { Metadata } from "next";
import "./globals.css";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: siteName, template: `%s | ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "device frames",
    "phone frames",
    "smartphone mockups",
    "transparent phone WebP",
    "device image API",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header>
          <a href="/">Open Device Frame</a>
          <nav>
            <a href="/devices">Catalog</a>
            <a href="/api-docs">API docs</a>
            <a href="/request-device">Request a device</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>Open device-frame illustrations. Coverage is growing.</footer>
      </body>
    </html>
  );
}
