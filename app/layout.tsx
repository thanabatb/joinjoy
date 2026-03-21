import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JoinJoy",
  description: "Claim what you had. Split with joy."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="app-body">{children}</body>
    </html>
  );
}
