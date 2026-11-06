import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono, Figtree } from "next/font/google";
import "./globals.css";

const plexSans  = IBM_Plex_Sans({  variable: "--font-plex-sans",  subsets: ["latin"], weight: ["400","500","600"] });
const plexSerif = IBM_Plex_Serif({ variable: "--font-plex-serif", subsets: ["latin"], weight: ["400","600"] });
const plexMono  = IBM_Plex_Mono({  variable: "--font-plex-mono",  subsets: ["latin"], weight: ["400","500","600"] });
const figtree   = Figtree({        variable: "--font-figtree",    subsets: ["latin"], weight: "variable", display: "block" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://proofline.app"),
  title: {
    default: "Proofline — Convert marketing drafts into clear, verified claims",
    template: "%s · Proofline",
  },
  description:
    "From draft copy to auditable fact verdicts, powered by Proofline. Check every claim against the owner-approved, versioned fact register.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} ${figtree.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
