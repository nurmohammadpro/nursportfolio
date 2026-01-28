"use client";

import { TypeAnimation } from "react-type-animation";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import DownloadIcon from "@mui/icons-material/Download";

const Hero = () => {
  return (
    <section id="home" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--md-sys-color-primary-container)] rounded-full mb-2">
                <span className="text-sm font-semibold text-[var(--md-sys-color-on-primary-container)]">
                  👋 Hello, I'm
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
                <span className="block text-[var(--md-sys-color-on-surface)]">
                  Nur Mohammad
                </span>
                <span className="block mt-2 bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[#6366f1] bg-clip-text text-transparent">
                  Full-Stack Developer
                </span>
              </h1>

              <div className="h-12 md:h-14">
                <TypeAnimation
                  sequence={[
                    "React & Next.js Specialist",
                    2000,
                    "Firebase Expert",
                    2000,
                    "SaaS Development",
                    2000,
                    "Malware Removal",
                    2000,
                    "Web Automation",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="text-xl md:text-2xl text-[var(--md-sys-color-on-surface-variant)] font-medium"
                />
              </div>

              <p className="text-lg md:text-xl text-[var(--md-sys-color-secondary)] max-w-2xl leading-relaxed">
                I build high-performance web applications, scalable SaaS
                solutions, and provide expert malware removal services. Based in
                Bangladesh, delivering global solutions with a modern tech stack.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="#contact"
                className="btn-primary flex-1 group"
              >
                <EmailIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Start a Project
              </a>
              <a
                href="/resume.pdf"
                download
                className="btn-outline flex-1 group"
              >
                <DownloadIcon className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                Download Resume
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-[var(--md-sys-color-outline)]">
              {[
                { label: "Projects", value: "50+", color: "text-[var(--md-sys-color-primary)]" },
                { label: "Years Exp", value: "5+", color: "text-indigo-600 dark:text-indigo-400" },
                { label: "Satisfaction", value: "100%", color: "text-emerald-600 dark:text-emerald-400" },
              ].map((stat) => (
                <div key={stat.label} className="text-left">
                  <div className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-[var(--md-sys-color-secondary)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              <a
                href="https://github.com/nurmohammad"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--surface-2)] text-[var(--md-sys-color-on-surface)] rounded-lg hover:bg-[var(--md-sys-color-primary-container)] hover:text-[var(--md-sys-color-on-primary-container)] transition-all duration-300 font-semibold"
              >
                <GitHubIcon className="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/nurmohammad"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[var(--surface-2)] text-[var(--md-sys-color-on-surface)] rounded-lg hover:bg-[var(--md-sys-color-primary-container)] hover:text-[var(--md-sys-color-on-primary-container)] transition-all duration-300 font-semibold"
              >
                <LinkedInIcon className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative lg:ml-8">
            <div className="relative z-10 hover-lift">
              <div className="bg-gradient-to-br from-[var(--md-sys-color-primary)] to-indigo-600 rounded-[28px] p-1 shadow-2xl">
                <div className="bg-[var(--surface-1)] rounded-[26px] p-8">
                  <div className="space-y-8">
                    {/* Tech Stack */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">
                        Core Expertise
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {[
                          "React",
                          "Next.js",
                          "Firebase",
                          "Tailwind",
                          "TypeScript",
                          "Node.js",
                        ].map((tech) => (
                          <span
                            key={tech}
                            className="px-4 py-2 bg-[var(--surface-2)] text-[var(--md-sys-color-on-surface-variant)] font-semibold rounded-lg text-sm border border-[var(--md-sys-color-outline)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Services Quick View */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">
                        Specialized In
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { title: "SaaS Apps", icon: "🚀" },
                          { title: "Web Security", icon: "🛡️" },
                          { title: "Automation", icon: "⚙️" },
                          { title: "E-commerce", icon: "🛒" },
                        ].map((service) => (
                          <div
                            key={service.title}
                            className="p-4 bg-[var(--md-sys-color-surface-variant)] rounded-2xl border border-[var(--md-sys-color-outline)] hover:border-[var(--md-sys-color-primary)]/50 transition-colors group"
                          >
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{service.icon}</div>
                            <div className="font-bold text-sm">
                              {service.title}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Availability Badge */}
                    <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-bold text-lg">
                            Ready for Work
                          </div>
                          <div className="text-white/90 text-sm">
                            Available for new projects
                          </div>
                        </div>
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                          <ArrowDownwardIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[var(--md-sys-color-primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
