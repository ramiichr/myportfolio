import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub Activity",
  description:
    "Explore my GitHub contributions and coding activity. View my open-source work, project contributions, and development patterns over time.",
  keywords: [
    "GitHub",
    "coding",
    "contributions",
    "repositories",
    "developer",
    "portfolio",
    "activity",
    "open source",
  ],
  openGraph: {
    title: "GitHub Activity | Rami Cheikh Rouhou",
    description:
      "View my GitHub contributions calendar and explore my coding activity, open-source projects, and development patterns.",
    type: "website",
    siteName: "Rami Cheikh Rouhou Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Activity | Rami Cheikh Rouhou",
    description:
      "View my GitHub contributions calendar and explore my coding activity, open-source projects, and development patterns.",
  },
  alternates: {
    canonical: "/github",
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
};
