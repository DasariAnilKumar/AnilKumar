import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.anildasari.in"),
  title: "Dasari Anil Kumar — Senior Software Engineer",
  description:
    "Portfolio of Dasari Anil Kumar — Senior Software Engineer specializing in AEM Cloud, Java backend, and scalable web systems.",
  openGraph: {
    title: "Dasari Anil Kumar — Senior Software Engineer",
    description:
      "Adobe Certified AEM Developer. Enterprise AEM Cloud, Java backend, and multi-country digital experiences.",
    url: "/",
    siteName: "Dasari Anil Kumar",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Dasari Anil Kumar — Senior Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dasari Anil Kumar — Senior Software Engineer",
    description:
      "Adobe Certified AEM Developer. Enterprise AEM Cloud, Java backend, and multi-country digital experiences.",
    images: ["/og.png"],
  },
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
