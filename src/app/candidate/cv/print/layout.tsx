import type { Metadata } from "next";
import "./print.css";
import "./fonts.css";

// Force dynamic rendering for print pages
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Print CV",
  robots: "noindex, nofollow",
};

// Minimal layout with NO header, footer, or any global components
export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "white" }}>
        {children}
      </body>
    </html>
  );
}
