import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub Activity",
  description:
    "Explore my GitHub contributions and coding activity. View my open-source work, project contributions, and development patterns over time.",
  openGraph: {
    title: "GitHub Activity | Rami Cheikh Rouhou",
    description:
      "View my GitHub contributions calendar and explore my coding activity, open-source projects, and development patterns.",
  },
};

export default function GitHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
