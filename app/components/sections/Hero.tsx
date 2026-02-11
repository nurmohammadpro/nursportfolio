"use client";

import { useState, useEffect } from "react";
import Button from "../Button";
import { Github, Linkedin, Mail, ArrowRight, Download } from "lucide-react";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const clients = [
    "The Believer's Path",
    "EZO Media",
    "BlacAds",
    "Dubali Vape Mart",
    "Tiger Vai",
    "Style House",
    "Tech Tweaks",
    "Harmony Heaven",
    "AREI Group",
    "Duncun Law",
  ];

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col bg-(--surface) overflow-hidden">
      {/* Main Content Area - Dropped down with pt-32 */}
      <div
        className={`
        layout-container relative z-10 flex-1 flex flex-col items-center text-center pt-16 md:pt-24 lg:pt-32 pb-20
        transition-all duration-1000 ${isLoaded ? "fade-in" : "opacity-0"}
      `}
      >
        {/* Availability Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-(--border-color) text-(--text-subtle) text-xs uppercase tracking-[0.2em] font-bold mb-10">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          Open for Collaboration
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-8xl leading-tight mb-6 md:mb-8 max-w-5xl">
          Building <span className="text-(--text-muted) ">Digital</span>{" "}
          Products That Work
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-(--text-muted) max-w-2xl mb-8 md:mb-12 font-light leading-relaxed">
          I'm{" "}
          <span className="text-(--text-main) font-medium underline underline-offset-8 decoration-(--text-subtle)/30">
            Nur Mohammad
          </span>
          , specializing in Web Development, WordPress Design & Security, and
          Automation.
        </p>

        {/* Updated Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-12 md:mb-20 w-full sm:w-auto">
          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight />}
            iconPosition="right"
            fullWidth
          >
            Explore Projects
          </Button>
          <Button variant="outlined" size="md" icon={<Download />} fullWidth>
            Download CV
          </Button>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-6 md:gap-8 text-(--text-subtle)">
          <a
            href="https://github.com/nurmohammadpro"
            className="hover:text-(--text-main) transition-all"
          >
            <Github size={22} />
          </a>
          <a
            href="https://www.linkedin.com/in/nur-mohammad-149515b4/"
            className="hover:text-(--text-main) transition-all"
          >
            <Linkedin size={22} />
          </a>
          <a
            href="info@nurmohammad.pro"
            className="hover:text-(--text-main) transition-all"
          >
            <Mail size={22} />
          </a>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="w-full border-t border-(--border-color) bg-(--surface) py-12 mt-auto">
        <div className="layout-container mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-(--text-subtle) font-bold text-center">
            Trusted by great companies
          </p>
        </div>

        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee flex whitespace-nowrap items-center gap-16 md:gap-32">
            {[...clients, ...clients].map((client, i) => (
              <span
                key={i}
                className="text-xl md:text-2xl lg:text-3xl font-display text-(--text-subtle)/40 hover:text-(--text-main) transition-colors cursor-default select-none grayscale"
              >
                {client}
              </span>
            ))}
          </div>
          {/* Edge Fades */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-(--surface) to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-(--surface) to-transparent z-10"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
