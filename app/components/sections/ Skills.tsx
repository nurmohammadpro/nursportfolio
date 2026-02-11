"use client";

import { Cpu, ShieldCheck, Layers, Terminal, Globe, Zap } from "lucide-react";

const expertisePillars = [
  {
    title: "Web Development",
    description:
      "Building custom web applications using Next.js or MERN stack.",
    tools: ["Next.js 15", "React", "MongoDB", "Node.js", "Express"],
    icon: <Cpu size={28} />,
    gridSpan: "md:col-span-2",
  },
  {
    title: "WordPress Design",
    description: "Custom WordPress themes and designs tailored to your brand.",
    tools: ["Theme Design", "Customization", "Elementor", "WooCommerce"],
    icon: <Globe size={28} />,
    gridSpan: "md:col-span-1",
  },
  {
    title: "WordPress Security",
    description: "Security audits, malware removal, and hardening your site.",
    tools: ["Security Audits", "Malware Removal", "SSL Setup", "Firewall"],
    icon: <ShieldCheck size={28} />,
    gridSpan: "md:col-span-1",
  },
  {
    title: "Web Automation",
    description: "Custom automation scripts and bots for repetitive tasks.",
    tools: [
      "Web Scraping",
      "Custom Bots",
      "API Integration",
      "Workflow Automation",
    ],
    icon: <Zap size={28} />,
    gridSpan: "md:col-span-2",
  },
];

const Skills = () => {
  return (
    <section
      id="skills"
      className="w-full bg-(--surface) py-16 md:py-24 lg:py-32 border-t border-(--border-color)"
    >
      <div className="layout-container">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 md:mb-16 lg:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-7xl mb-6 md:mb-8 leading-tight">
            What I Do <span className=" text-(--text-muted)">Best</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-(--text-muted) font-light leading-relaxed">
            I help businesses with{" "}
            <span className="text-(--text-main) font-medium">
              web development
            </span>
            , security, and automation—turning ideas into working applications.
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
                <h3 className="text-xl md:text-2xl font-display mb-4">
                  {pillar.title}
                </h3>
                <p className="text-(--text-muted) mb-8 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {/* Tool Tags */}
              <div className="flex flex-wrap gap-2 pt-6 border-t border-(--border-color)">
                {pillar.tools.map((tool, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-3 py-1 rounded-full bg-(--subtle) text-(--text-main) text-xs uppercase tracking-wider font-bold"
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
