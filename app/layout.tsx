import type React from "react";
import type { Metadata } from "next";
import { Inter, Caveat } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import { ErrorBoundary } from "@/components/common";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/footer";
import CursorLight from "@/components/cursor-light";
import { PageTracker } from "@/components/page-tracker";

const inter = Inter({ subsets: ["latin"] });
const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rami-cheikhrouhou.vercel.app"),
  title: {
    default: "Rami Cheikh Rouhou | Frontend Developer",
    template: "%s | Rami Cheikh Rouhou",
  },
  description:
    "Frontend Developer with expertise in React, Next.js, and TypeScript. Explore my portfolio featuring modern web applications, responsive designs, and innovative solutions.",
  keywords: [
    "Frontend Developer",
    "React Developer",
    "Next.js Expert",
    "TypeScript",
    "Web Development",
    "Portfolio",
    "JavaScript",
    "UI/UX Design",
    "Responsive Design",
    "Modern Web Applications",
    "Frontend Architecture",
    "Performance Optimization",
  ],
  authors: [
    { name: "Rami Cheikh Rouhou", url: "https://rami-cheikhrouhou.vercel.app" },
  ],
  creator: "Rami Cheikh Rouhou",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://rami-cheikhrouhou.vercel.app",
    title: "Rami Cheikh Rouhou | Frontend Developer",
    description:
      "Frontend Developer crafting exceptional web experiences with React, Next.js, and TypeScript. View my portfolio showcasing innovative projects and technical expertise.",
    siteName: "Rami Cheikh Rouhou - Professional Portfolio",
    images: [
      {
        url: "/rami.png",
        width: 1200,
        height: 630,
        alt: "Rami Cheikh Rouhou - Frontend Developer Portfolio",
        type: "image/png",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/rami.png", type: "image/png" },
      { url: "/rami.png", type: "image/png", sizes: "16x16" },
      { url: "/rami.png", type: "image/png", sizes: "32x32" },
      { url: "/rami.png", type: "image/png", sizes: "192x192" },
      { url: "/rami.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/rami.png",
    apple: [{ url: "/rami.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/rami.png",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    languages: {
      "en-US": "https://rami-cheikhrouhou.vercel.app",
      "de-DE": "https://rami-cheikhrouhou.vercel.app/de",
      "fr-FR": "https://rami-cheikhrouhou.vercel.app/fr",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const colorTheme = localStorage.getItem('color-theme') || 'blue';
                  const theme = localStorage.getItem('theme') || 'system';
                  document.documentElement.setAttribute('data-theme', colorTheme);
                  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Rami Cheikh Rouhou",
              jobTitle: "Frontend Developer",
              url: "https://rami-cheikhrouhou.vercel.app",
              sameAs: [
                "https://github.com/ramiichr",
                "https://www.linkedin.com/in/rami-cheikh-rouhou/",
              ],
              knowsAbout: [
                "Frontend Development",
                "React",
                "Next.js",
                "TypeScript",
                "JavaScript",
                "Web Development",
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} ${caveat.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <div data-language>
              <ErrorBoundary>
                <PageTracker />
                <div className="flex min-h-screen flex-col">
                  <CursorLight />
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
                <Analytics />
              </ErrorBoundary>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
