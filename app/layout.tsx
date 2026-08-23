import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Community Phone Images",
  description:
    "Community-maintained standardized phone mockups and a public device API.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header>
          <a href="/">Community Phone Images</a>
          <nav>
            <a href="/devices">Catalog</a>
            <a href="/api-docs">API docs</a>
            <a href="/request-device">Request a device</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          Community-maintained device illustrations. Coverage is incomplete.
        </footer>
      </body>
    </html>
  );
}
