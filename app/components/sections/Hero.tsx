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
    "Style House",
    "Tech Tweaks",
    "AREI Group",
    "Duncun Law",
  ];

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col bg-(--surface) overflow-hidden">
      {/* Main Content Area - Dropped down with pt-32 */}
      <div
        className={`
        layout-container relative z-10 flex-1 flex flex-col items-center text-center pt-32 pb-20
        transition-all duration-1000 ${isLoaded ? "fade-in" : "opacity-0"}
      `}
      >
        {/* Availability Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-(--border-color) text-(--text-subtle) text-[10px] uppercase tracking-[0.2em] font-bold mb-10">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          Open for Collaboration
        </div>

        {/* Hero Heading */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl leading-[1] mb-8 max-w-5xl">
          Building <span className="text-(--text-muted) italic">Smarter</span>{" "}
          Digital Products
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-(--text-muted) max-w-2xl mb-12 font-light leading-relaxed">
          I am{" "}
          <span className="text-(--text-main) font-medium underline underline-offset-8 decoration-(--text-subtle)/30">
            Nur Mohammad
          </span>
          . A specialized Full-Stack Engineer focused on performance, security,
          and scalable automation.
        </p>

        {/* Updated Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight />}
            iconPosition="right"
          >
            Explore Projects
          </Button>
          <Button variant="outlined" size="lg" icon={<Download />}>
            Download CV
          </Button>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-8 text-(--text-subtle)">
          <a href="#" className="hover:text-(--text-main) transition-all">
            <Github size={22} />
          </a>
          <a href="#" className="hover:text-(--text-main) transition-all">
            <Linkedin size={22} />
          </a>
          <a href="#" className="hover:text-(--text-main) transition-all">
            <Mail size={22} />
          </a>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="w-full border-t border-(--border-color) bg-(--surface) py-12 mt-auto">
        <div className="layout-container mb-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-(--text-subtle) font-bold text-center">
            Trusted by forward-thinking companies
          </p>
        </div>

        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee flex whitespace-nowrap items-center gap-16 md:gap-32">
            {[...clients, ...clients].map((client, i) => (
              <span
                key={i}
                className="text-2xl md:text-3xl font-display text-(--text-subtle)/40 hover:text-(--text-main) transition-colors cursor-default select-none grayscale"
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
