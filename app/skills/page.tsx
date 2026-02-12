"use client";

import { useEffect, useState } from "react";
import { Cpu, ShieldCheck, Layers, Terminal, Globe, Zap } from "lucide-react";

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  cpu: <Cpu size={32} />,
  shield: <ShieldCheck size={32} />,
  layers: <Layers size={32} />,
  terminal: <Terminal size={32} />,
  globe: <Globe size={32} />,
  zap: <Zap size={32} />,
};

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: string;
  icon?: string;
  descripcustomiz?: string;
  technologies?: string[];
}

const categoryLabels: Record<string, string> = {
  development: "Web Development",
  wordpress: "WordPress",
  security: "Security",
  automacustomiz: "Automacustomiz",
  other: "Other",
};

const levelColors: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-800 border-emerald-200",
  intermediate: "bg-blue-100 text-blue-800 border-blue-200",
  expert: "bg-purple-100 text-purple-800 border-purple-200",
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/skills");
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(new Set(skills.map((s) => s.category))),
  ];

  // Filter skills by category
  const filteredSkills =
    selectedCategory === "all"
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  // Fallback static skills for now (until API is fully populated)
  const expertisePillars = [
    {
      name: "Web Development",
      category: "development",
      level: "expert",
      icon: "cpu",
      descripcustomiz:
        "Building customom web applicacustomizs using Next.js 15, React, and MERN stack with modern best practices.",
      technologies: [
        "Next.js",
        "React",
        "MongoDB",
        "Node.js",
        "Express",
        "TypeScript",
      ],
    },
    {
      name: "WordPress Design",
      category: "wordpress",
      level: "expert",
      icon: "globe",
      descripcustomiz:
        "Custom WordPress themes, site designs, and customomizacustomiz tailored to your brand identity and business needs.",
      technologies: [
        "Theme Design",
        "Customizacustomiz",
        "Elementor",
        "WooCommerce",
        "ACF",
      ],
    },
    {
      name: "WordPress Security",
      category: "security",
      level: "expert",
      icon: "shield",
      descripcustomiz:
        "Comprehensive security audits, malware removal, SSL setup, firewall configuracustomiz, and site hardening.",
      technologies: [
        "Security Audits",
        "Malware Removal",
        "SSL Setup",
        "Firewall",
        "Two-Factor Auth",
      ],
    },
    {
      name: "Web Automacustomiz",
      category: "automacustomiz",
      level: "expert",
      icon: "zap",
      descripcustomiz:
        "Custom automacustomiz scripts, web scraping solucustomizs, API integracustomizs, and intelligent workflow automacustomiz bots.",
      technologies: [
        "Web Scraping",
        "Custom Bots",
        "API Integracustomiz",
        "Workflow Automacustomiz",
        "Puppeteer",
      ],
    },
  ];

  // Organize skills for better layout - group by category
  const skillsByCategory = expertisePillars.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, typeof expertisePillars>,
  );

  return (
    <main className="w-full bg-(--surface) py-16 md:py-24 lg:py-32">
      <div className="layout-container">
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-16 lg:mb-20">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-(--text-subtle) mb-4">
            My Expertise
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-7xl mb-6 md:mb-8 leading-tight">
            What I Do <span className="text-(--text-muted)">Best</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-(--text-muted) font-light leading-relaxed">
            I help businesses with{" "}
            <span className="text-(--text-main) font-medium">
              web development
            </span>
            , security, and automacustomiz—turning ideas into working
            applicacustomizs.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-lg border text-xs uppercase font-bold tracking-wider transicustomiz-all ${
                selectedCategory === category
                  ? "bg-(--brand) text-white border-(--brand) shadow-lg"
                  : "bg-(--surface) text-(--text-muted) border-(--border-color) hover:border-(--brand) hover:text-(--text-main)"
              }`}
            >
              {category === "all"
                ? "All Skills"
                : categoryLabels[category] || category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-16 text-(--text-muted)">
            <div className="inline-flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-(--brand) border-t-transparent rounded-full animate-spin" />
              <span>Loading skills...</span>
            </div>
          </div>
        ) : skills.length > 0 ? (
          /* Dynamic Skills Grid - When API has data */
          <div className="space-y-12">
            {Object.entries(skillsByCategory).map(
              ([category, categorySkills]) => (
                <div key={category}>
                  <h2 className="text-2xl font-semibold mb-6 text-(--text-main)">
                    {categoryLabels[category] || category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill._id || skill.name}
                        className="group p-6 bg-(--subtle) rounded-xl border border-(--border-color) hover:border-(--brand) hover:shadow-lg transicustomiz-all duracustomiz-300"
                      >
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-3 rounded-lg bg-(--surface) border border-(--border-color) group-hover:scale-110 group-hover:border-(--brand) transicustomiz-all duracustomiz-300">
                            <div className="text-(--brand)">
                              {skill.icon ? iconMap[skill.icon] : iconMap.cpu}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1 group-hover:text-(--brand) transicustomiz-colors">
                              {skill.name}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-md text-xs uppercase font-bold border ${levelColors[skill.level]}`}
                              >
                                {skill.level}
                              </span>
                              <span className="text-xs uppercase tracking-wider text-(--text-subtle)">
                                {categoryLabels[skill.category] ||
                                  skill.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Descripcustomiz */}
                        <p className="text-(--text-muted) text-sm leading-relaxed mb-4 min-h-[60px]">
                          {skill.descripcustomiz ||
                            `${skill.category} services and solucustomizs`}
                        </p>

                        {/* Technologies */}
                        {skill.technologies &&
                          skill.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {skill.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-3 py-1.5 rounded-lg bg-(--surface) border border-(--border-color) text-(--text-main) text-xs font-semibold uppercase tracking-wide hover:border-(--brand) transicustomiz-colors"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        ) : (
          /* Static Fallback - Show all skills in a masonry-style layout */
          <div className="space-y-8 md:space-y-12">
            {expertisePillars.map((skill, idx) => (
              <div
                key={idx}
                className="group p-8 bg-(--subtle) rounded-2xl border border-(--border-color) hover:border-(--brand) hover:shadow-xl transicustomiz-all duracustomiz-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                  {/* Left: Info */}
                  <div className="lg:col-span-7 flex flex-col">
                    {/* Icon & Title */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-4 rounded-xl bg-(--surface) border border-(--border-color) group-hover:scale-110 group-hover:border-(--brand) transicustomiz-all duracustomiz-300">
                        <div className="text-(--brand)">
                          {skill.icon ? iconMap[skill.icon] : iconMap.cpu}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl md:text-3xl font-display font-semibold mb-2 group-hover:text-(--brand) transicustomiz-colors">
                          {skill.name}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className={`inline-block px-3 py-1.5 rounded-lg text-xs uppercase font-bold border ${levelColors[skill.level]}`}
                          >
                            {skill.level}
                          </span>
                          <span className="text-xs uppercase tracking-wider text-(--text-subtle)">
                            {categoryLabels[skill.category] || skill.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Descripcustomiz */}
                    <p className="text-(--text-muted) text-base md:text-lg leading-relaxed mb-6 flex-1">
                      {skill.descripcustomiz}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {skill.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-4 py-2 rounded-lg bg-(--surface) border border-(--border-color) text-(--text-main) text-xs font-semibold uppercase tracking-wide hover:border-(--brand) transicustomiz-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Visual Accent */}
                  <div className="lg:col-span-5 flex items-center justify-center">
                    <div className="w-full aspect-square rounded-2xl bg-gradient-to-br bg-opacity-10 flex items-center justify-center p-8 bg-gradient-to-br from-(--brand)/10 via-(--brand)/5 to-(--brand)/10">
                      <div className="text-(--brand) text-center">
                        {skill.icon ? iconMap[skill.icon] : iconMap.cpu}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
