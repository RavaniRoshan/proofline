import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexSans  = IBM_Plex_Sans({  variable: "--font-plex-sans",  subsets: ["latin"], weight: ["400","500","600"] });
const plexSerif = IBM_Plex_Serif({ variable: "--font-plex-serif", subsets: ["latin"], weight: ["400","600"] });
const plexMono  = IBM_Plex_Mono({  variable: "--font-plex-mono",  subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://proofline.app"),
  title: {
    default: "Proofline — check marketing claims against approved facts",
    template: "%s · Proofline",
  },
  description:
    "Paste a draft; get every claim checked against the owner-approved, versioned fact register — with the source document, span, version and validity dates behind each finding.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
