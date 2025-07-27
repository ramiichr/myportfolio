"use client";

import { motion } from "framer-motion";
import GitHubContributions from "@/components/github-contributions";
import type { Profile } from "@/types";

interface GitHubSectionProps {
  profile: Profile;
  translations: any;
}

export function GitHubSection({ profile, translations }: GitHubSectionProps) {
  // Extract GitHub username from profile URL
  const getGitHubUsername = (url: string) => {
    try {
      const match = url.match(/github\.com\/([^\/]+)/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const githubUsername = getGitHubUsername(profile.social.github);

  if (!githubUsername) {
    return null;
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {translations?.github?.title || "GitHub Activity"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {translations?.github?.description ||
              "A visual representation of my coding activity and contributions over the past year."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <GitHubContributions
            username={githubUsername}
            title={translations?.github?.contributionsTitle || "Contributions"}
            className="w-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
