import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anil Kumar — Senior Software Engineer",
  description:
    "Portfolio of Dasari Anil Kumar — Senior Software Engineer specializing in AEM Cloud, Java Backend, and Scalable Web Systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
