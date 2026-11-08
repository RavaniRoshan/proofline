import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const plexSans  = IBM_Plex_Sans({  variable: "--font-plex-sans",  subsets: ["latin"], weight: ["400","500","600"] });
const plexSerif = IBM_Plex_Serif({ variable: "--font-plex-serif", subsets: ["latin"], weight: ["400","600"] });
const plexMono  = IBM_Plex_Mono({  variable: "--font-plex-mono",  subsets: ["latin"], weight: ["400","500","600"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://proofline.app"),
  title: {
    default: "Proofline, Convert marketing drafts into clear, verified claims",
    template: "%s · Proofline",
  },
  description:
    "From draft copy to auditable fact verdicts, powered by Proofline. Check every claim against the owner-approved, versioned fact register.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('proofline-theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light';}else{document.documentElement.classList.add('dark');document.documentElement.classList.remove('light');document.documentElement.style.colorScheme='dark';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col font-sans bg-paper text-ink selection:bg-oxide selection:text-white transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
