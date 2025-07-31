"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ExternalLink } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  translations: any;
  index: number;
}

export default function ProjectCard({
  project,
  translations,
  index,
}: ProjectCardProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.article
      variants={item}
      className="group"
      itemScope
      itemType="http://schema.org/CreativeWork"
    >
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
        <div className="relative aspect-video overflow-hidden">
          <OptimizedImage
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            className="object-cover transition-transform group-hover:scale-105"
            fill
            priority={index < 3}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={85}
          />
        </div>
        <CardContent className="space-y-4 p-6">
          <div>
            <h3
              className="font-bold tracking-tight text-xl mb-2"
              itemProp="name"
            >
              {project.title}
            </h3>
            <p className="text-muted-foreground" itemProp="description">
              {project.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" itemProp="keywords">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            asChild
            aria-label={`View source code for ${project.title}`}
          >
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              itemProp="codeRepository"
            >
              <Github className="mr-2 h-4 w-4" />
              {translations.projects.viewCode}
            </Link>
          </Button>
          <Button
            size="sm"
            asChild
            aria-label={`View live demo of ${project.title}`}
          >
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              itemProp="url"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {translations.projects.viewProject}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.article>
  );
}
