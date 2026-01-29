"use client";

import { Cpu, ShieldCheck, Layers, Terminal, Globe, Zap } from "lucide-react";

const expertisePillars = [
  {
    title: "The Core Engine",
    description:
      "Architecting high-performance web applications with a focus on reactivity and speed.",
    tools: ["Next.js 15", "TypeScript", "React", "Node.js"],
    icon: <Cpu size={28} />,
    gridSpan: "md:col-span-2",
  },
  {
    title: "Security & Defense",
    description:
      "Hardening digital assets against vulnerabilities and malware.",
    tools: ["Wordpress Security Audits", "Malware Removal", "SSL/Auth"],
    icon: <ShieldCheck size={28} />,
    gridSpan: "md:col-span-1",
  },
  {
    title: "Cloud Infrastructure",
    description:
      "Scalable global deployment and real-time data synchronization.",
    tools: ["Cloudflare", "Workers", "Firebase", "MongoDB"],
    icon: <Globe size={28} />,
    gridSpan: "md:col-span-1",
  },
  {
    title: "Strategic Automation",
    description:
      "Transforming manual business processes into automated, efficient workflows.",
    tools: ["Web Automation", "API Integration", "SaaS Logic"],
    icon: <Zap size={28} />,
    gridSpan: "md:col-span-2",
  },
];

const Skills = () => {
  return (
    <section
      id="skills"
      className="w-full bg-(--surface) py-24 md:py-32 border-t border-(--border-color)"
    >
      <div className="layout-container">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <h2 className="text-5xl md:text-7xl mb-8 leading-tight">
            Expertise &{" "}
            <span className="italic text-(--text-muted)">Tooling</span>
          </h2>
          <p className="text-xl text-(--text-muted) font-light leading-relaxed">
            I specialize in the full lifecycle of digital product development,
            bridging the gap between{" "}
            <span className="text-(--text-main) font-medium">
              complex engineering
            </span>{" "}
            and intuitive business solutions.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {expertisePillars.map((pillar, idx) => (
            <div
              key={idx}
              className={`card-premium group flex flex-col justify-between ${pillar.gridSpan}`}
            >
              <div>
                <div className="mb-8 text-(--text-main) opacity-80 group-hover:opacity-100 transition-opacity">
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-display mb-4">{pillar.title}</h3>
                <p className="text-(--text-muted) mb-8 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Tool Tags */}
              <div className="flex flex-wrap gap-2 pt-6 border-t border-(--border-color)">
                {pillar.tools.map((tool, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1 rounded-full bg-(--subtle) text-(--text-main) text-[10px] uppercase tracking-wider font-bold"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
