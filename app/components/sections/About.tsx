"use client";

import { ArrowRight, Code2, ShieldCheck, Zap } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="w-full bg-(--surface) py-24 md:py-40">
      <div className="layout-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left: The Power Statement */}
          <div className="lg:col-span-7">
            <h2 className="text-5xl md:text-7xl lg:text-8xl leading-[1] tracking-tighter mb-8">
              Engineering <br />
              <span className="italic text-(--text-muted)">Stability</span> in a{" "}
              <br />
              Digital World.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-(--text-main)">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                    Security First
                  </span>
                </div>
                <p className="text-sm text-(--text-muted) font-light leading-relaxed">
                  Architecture designed to withstand vulnerabilities, from
                  malware removal to encrypted SaaS logic.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-(--text-main)">
                  <Zap size={20} />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                    Automation Focus
                  </span>
                </div>
                <p className="text-sm text-(--text-muted) font-light leading-relaxed">
                  Eliminating manual bottlenecks through strategic web
                  automation and custom-built bot logic.
                </p>
              </div>
            </div>
          </div>

          {/* Right: The Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-between pt-4">
            <div className="space-y-8">
              <p className="text-xl md:text-2xl text-(--text-main) font-light leading-relaxed">
                My name is{" "}
                <span className="font-medium underline underline-offset-8 decoration-(--border-color)">
                  Nur Mohammad
                </span>
                . I specialize in building high-performance web applications
                that don&apos;t just look good, but function as robust business
                assets.
              </p>
              <p className="text-(--text-muted) leading-relaxed font-light">
                With a deep background in Full-Stack development and Web
                Security, I help companies like the **AREI Group** and **Duncun
                Immigration** implement systems that scale. My approach is
                rooted in clean code, serverless architecture, and an obsession
                with user-centric performance.
              </p>
            </div>

            <div className="mt-12 lg:mt-0 pt-12 border-t border-(--border-color)">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-(--text-subtle) mb-4">
                Current Stack Focus
              </p>
              <p className="text-sm font-medium tracking-tight text-(--text-main)">
                Next.js 15 • Cloudflare Edge • React • Firebase • MongoDB
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
