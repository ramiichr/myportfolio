"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactCTASectionProps {
  translations: any;
}

export function ContactCTASection({ translations }: ContactCTASectionProps) {
  return (
    <section className="py-16 bg-accent/50">
      <div className="container px-4 md:px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            {translations.contact.title}
          </h2>
          <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mb-8">
            {translations.contact.cta}
          </p>
          <Button size="lg" asChild>
            <a href="/contact">
              {translations.contact.title}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
