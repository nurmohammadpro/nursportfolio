"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Github,
  X,
  CheckCircle2,
  Globe,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import Button from "../Button";
import Image from "next/image";

// Project Data with your local images
const projects = [
  {
    id: "arei-group",
    title: "AREI Group Ecosystem",
    category: "Full-Stack SaaS / Real-time Sync",
    image: "/arei.png",
    description:
      "Architected a multi-platform ecosystem where native iOS and Android apps sync in real-time with a core Web App. This system manages complex business operations including a job portal, donation panel, and a custom mail client.",
    challenges: [
      "Real-time cross-platform data synchronization",
      "High-concurrency webhook management",
      "Custom internal mail client architecture",
    ],
    tags: ["Next.js 15", "Cloudflare Workers", "Firebase", "Webhooks"],
    link: "https://areigrp.com",
    github: "#",
  },
  {
    id: "duncun-law",
    title: "Duncun Immigration Law",
    category: "Enterprise Legal Platform",
    image: "/duncun.png",
    description:
      "A specialized management system for an immigration law firm. It automates visa query tracking and provides a secure, encrypted portal for sensitive client documentation.",
    challenges: [
      "End-to-end encryption for legal documents",
      "Automated visa status tracking logic",
      "Role-based access control (RBAC)",
    ],
    tags: ["React", "Node.js", "MongoDB", "Auth Logic"],
    link: "https://duncun-immigration-law.vercel.app/",
    github: "#",
  },
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);

  const closeDrawer = () => setSelectedProject(null);

  return (
    <section
      id="projects"
      className="w-full bg-(--surface) py-24 md:py-32 border-t border-(--border-color)"
    >
      <div className="layout-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl mb-6">
              Selected <span className="italic text-(--text-muted)">Work</span>
            </h2>
            <p className="text-xl text-(--text-muted) font-light">
              High-performance applications built to solve critical business
              challenges.
            </p>
          </div>
          <Button
            variant="outlined"
            size="md"
            icon={<ArrowUpRight />}
            iconPosition="right"
          >
            View Archive
          </Button>
        </div>

        {/* Project List */}
        <div className="space-y-20 md:space-y-32">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start border-t border-(--border-color) pt-12"
            >
              {/* Text Info */}
              <div className="lg:col-span-5 space-y-6">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-(--text-subtle)">
                  {project.category}
                </span>
                <h3 className="text-4xl md:text-5xl transition-all duration-500">
                  {project.title}
                </h3>
                <p className="text-(--text-muted) text-lg leading-relaxed font-light">
                  {project.description.substring(0, 140)}...
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase font-bold text-(--text-subtle)"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visual Presentation Column */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full lg:items-end gap-8">
                <div
                  className="relative w-full aspect-video rounded-md overflow-hidden border border-(--border-color) bg-(--subtle) group/img cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* The Actual Project Screenshot */}
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover grayscale opacity-90 group-hover/img:grayscale-0 group-hover/img:scale-105 transition-all duration-700 ease-in-out"
                  />

                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-(--surface)/80 backdrop-blur-md rounded-full border border-(--border-color) opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-(--text-main)">
                      Live System
                    </span>
                  </div>

                  {/* Hover Action Center */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-500">
                    <div className="bg-(--text-main) text-(--surface) px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl translate-y-4 group-hover/img:translate-y-0 transition-transform">
                      Deep Dive
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedProject(project)}
                  >
                    View Case Study
                  </Button>
                  <Button
                    variant="outlined"
                    size="sm"
                    icon={<Github />}
                    onClick={() => window.open(project.github)}
                  >
                    Source
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CASE STUDY DRAWER */}
      {selectedProject && (
        <div className="fixed inset-0 z-100 flex justify-end">
          <div
            className="absolute inset-0 bg-(--text-main)/20 backdrop-blur-sm transition-opacity"
            onClick={closeDrawer}
          />

          <div className="relative w-full max-w-xl bg-(--surface) h-full shadow-2xl p-8 md:p-12 flex flex-col overflow-y-auto animate-slide-up">
            <button
              onClick={closeDrawer}
              className="absolute top-8 right-8 text-(--text-subtle) hover:text-(--text-main) transition-colors"
            >
              <X size={28} />
            </button>

            <span className="text-[10px] uppercase tracking-widest font-bold text-(--text-subtle) mb-4">
              Technical Architecture
            </span>
            <h2 className="text-4xl md:text-5xl mb-8 leading-tight">
              {selectedProject.title}
            </h2>

            {/* Drawer Image Preview */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10 border border-(--border-color)">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-10 flex-1">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-(--text-muted)">
                  Project Overview
                </h4>
                <p className="text-(--text-muted) text-lg leading-relaxed font-light">
                  {selectedProject.description}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-(--text-muted)">
                  Technical Challenges
                </h4>
                <ul className="space-y-4">
                  {selectedProject.challenges.map((challenge) => (
                    <li
                      key={challenge}
                      className="flex items-start gap-4 text-(--text-main)"
                    >
                      <CheckCircle2
                        size={20}
                        className="shrink-0 text-(--text-main) mt-1"
                      />
                      <span className="font-light">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-(--subtle) rounded-xl">
                  <Cpu size={20} className="mb-2" />
                  <p className="text-[10px] uppercase font-bold text-(--text-subtle)">
                    Backend
                  </p>
                  <p className="text-sm font-medium">Node / Edge</p>
                </div>
                <div className="p-4 bg-(--subtle) rounded-xl">
                  <ShieldCheck size={20} className="mb-2" />
                  <p className="text-[10px] uppercase font-bold text-(--text-subtle)">
                    Security
                  </p>
                  <p className="text-sm font-medium">Encrypted Storage</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-(--border-color)">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                icon={<Globe />}
                onClick={() => window.open(selectedProject.link, "_blank")}
              >
                Launch Live Site
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
