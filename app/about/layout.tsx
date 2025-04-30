import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about my experience as a Frontend Developer, my skills in React, Next.js, and TypeScript, and my professional journey.",
  openGraph: {
    title: "About | Rami Cheikh Rouhou",
    description:
      "Learn more about my experience as a Frontend Developer, my skills in React, Next.js, and TypeScript, and my professional journey.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
