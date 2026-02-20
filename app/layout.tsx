import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coding Progress + AI Mentor",
  description: "Track coding progress and get AI mentorship hints.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
