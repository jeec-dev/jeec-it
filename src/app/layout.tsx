import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jeec.it"),
  title: {
    default: "JeeC — Official Website",
    template: "%s | JeeC",
  },
  description:
    "Sito ufficiale di JeeC: musica, eventi, Diario di Jay, media kit e universo NEW.",
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
