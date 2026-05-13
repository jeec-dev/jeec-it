import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

const siteUrl = "https://www.jeec.it";

export const metadata: Metadata = {
<<<<<<< Updated upstream
  metadataBase: new URL("https://www.jeec.it"),
=======
  metadataBase: new URL(siteUrl),
>>>>>>> Stashed changes
  title: {
    default: "JeeC — Official Website",
    template: "%s | JeeC",
  },
  description:
<<<<<<< Updated upstream
    "Sito ufficiale di JeeC: musica, eventi, Diario di Jay, media kit e universo NEW.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
=======
    "Sito ufficiale di JeeC: musica, eventi live, Diario di Jay, media kit, contatti e universo NEW.",
  applicationName: "JeeC",
  authors: [{ name: "JeeC", url: siteUrl }],
  creator: "JeeC",
  publisher: "JeeC",
  category: "music",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName: "JeeC",
    title: "JeeC — Official Website",
    description:
      "Sito ufficiale di JeeC: musica, eventi live, Diario di Jay, media kit, contatti e universo NEW.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "JeeC — Official Website",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JeeC — Official Website",
    description:
      "Sito ufficiale di JeeC: musica, eventi live, Diario di Jay, media kit, contatti e universo NEW.",
    images: ["/opengraph-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
>>>>>>> Stashed changes
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>
        <SiteHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
