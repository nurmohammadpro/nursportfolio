"use client";

import { ArrowRight, Code2, ShieldCheck, Zap } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="w-full bg-(--surface) py-24 md:py-40">
      <div className="layout-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left: The Power Statement */}
          <div className="lg:col-span-7">
            <h2 className="text-5xl md:text-7xl lg:text-8xl leading-tight tracking-tight mb-8">
              Building <br />
              <span className="italic text-(--text-muted)">Reliable</span> Web{" "}
              <br />
              Applications.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-(--text-main)">
                  <ShieldCheck size={20} />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold">
                    Security First
                  </span>
                </div>
                <p className="text-sm text-(--text-muted) font-light leading-relaxed">
                  Keeping your applications safe from threats, with secure
                  data handling and protection.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-(--text-main)">
                  <Zap size={20} />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold">
                    Smart Automation
                  </span>
                </div>
                <p className="text-sm text-(--text-muted) font-light leading-relaxed">
                  Saving time by automating repetitive tasks and workflows so
                  you can focus on what matters.
                </p>
              </div>
            </div>
          </div>

          {/* Right: The Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-between pt-4">
            <div className="space-y-8">
              <p className="text-xl md:text-2xl text-(--text-main) font-light leading-relaxed">
                I'm{" "}
                <span className="font-medium underline underline-offset-8 decoration-(--border-color)">
                  Nur Mohammad
                </span>
                . I build web applications that work well, look great, and help
                businesses run smoother.
              </p>
              <p className="text-(--text-muted) leading-relaxed font-light">
                I've worked with companies like AREI Group and Duncun
                Immigration to create applications that handle real business
                needs. I focus on writing clean code and making sure everything
                works fast and reliably.
              </p>
            </div>

            <div className="mt-12 lg:mt-0 pt-12 border-t border-(--border-color)">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-(--text-subtle) mb-4">
                Technologies I Work With
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
