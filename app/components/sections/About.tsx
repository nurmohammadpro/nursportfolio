"use client";

import { ArrowRight, Code2, ShieldCheck, Zap } from "lucide-react";

const About = () => {
  return (
    <section
      id="about"
      className="w-full bg-(--surface) py-16 md:py-24 lg:py-40"
    >
      <div className="layout-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-24">
          {/* Left: The Power Statement */}
          <div className="lg:col-span-7">
            <h2 className="text-4xl md:text-5xl lg:text-7xl leading-tight tracking-tight mb-6 md:mb-8">
              Building <br />
              <span className=" text-(--text-muted)">Reliable</span> Web <br />
              Applications.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-8 md:mt-12 lg:mt-16">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-(--text-main)">
                  <ShieldCheck size={20} />
                  <span className="text-xs uppercase tracking-[0.2em] font-bold">
                    Security First
                  </span>
                </div>
                <p className="text-sm text-(--text-muted) font-light leading-relaxed">
                  Keeping your applications safe from threats, with secure data
                  handling and protection.
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
          <div className="lg:col-span-5 flex flex-col justify-between pt-0 lg:pt-4">
            <div className="space-y-6 md:space-y-8">
              <p className="text-lg md:text-xl lg:text-2xl text-(--text-main) font-light leading-relaxed">
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
                Services I Offer
              </p>
              <p className="text-sm font-medium tracking-tight text-(--text-main)">
                Web Apps • WordPress Design • WordPress Security • Automation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
