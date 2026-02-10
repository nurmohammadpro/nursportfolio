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
    category: "Web Application / Real-time Sync",
    image: "/arei.png",
    description:
      "A connected system where mobile apps and the web platform stay in sync. Handles job postings, donations, and internal messaging—all working together smoothly.",
    challenges: [
      "Keeping data in sync across all devices in real-time",
      "Handling lots of incoming data reliably",
      "Building an internal messaging system",
    ],
    tags: ["Next.js 15", "Cloudflare Workers", "Firebase", "Webhooks"],
    link: "https://areigrp.com",
    github: "#",
  },
  {
    id: "duncun-law",
    title: "Duncun Immigration Law",
    category: "Legal Practice Platform",
    image: "/duncun.png",
    description:
      "A management tool for an immigration law firm that tracks visa applications and keeps sensitive documents secure and organized.",
    challenges: [
      "Keeping legal documents safe and encrypted",
      "Tracking visa status automatically",
      "Controlling who can access what information",
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
      className="w-full bg-(--surface) py-16 md:py-24 lg:py-32 border-t border-(--border-color)"
    >
      <div className="layout-container">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 lg:mb-24 gap-4 md:gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-7xl mb-4 md:mb-6">
              Recent <span className="italic text-(--text-muted)">Projects</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-(--text-muted) font-light">
              Real applications built to solve real problems.
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
        <div className="space-y-12 md:space-y-20 lg:space-y-32">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start border-t border-(--border-color) pt-8 md:pt-12"
            >
              {/* Text Info */}
              <div className="lg:col-span-5 space-y-4 md:space-y-6">
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-(--text-subtle)">
                  {project.category}
                </span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl transition-all duration-500 leading-tight">
                  {project.title}
                </h3>
                <p className="text-(--text-muted) text-sm md:text-base lg:text-lg leading-relaxed font-light">
                  {project.description.substring(0, 140)}...
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs uppercase font-bold text-(--text-subtle)"
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
                    <span className="text-xs font-bold uppercase tracking-widest text-(--text-main)">
                      Live System
                    </span>
                  </div>

                  {/* Hover Action Center */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-500">
                    <div className="bg-(--text-main) text-(--surface) px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl translate-y-4 group-hover/img:translate-y-0 transition-transform">
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

          <div className="relative w-full max-w-xl bg-(--surface) h-full shadow-2xl p-6 md:p-8 lg:p-12 flex flex-col overflow-y-auto animate-slide-up">
            <button
              onClick={closeDrawer}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-(--text-subtle) hover:text-(--text-main) transition-colors"
            >
              <X size={24} />
            </button>

            <span className="text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-3 md:mb-4">
              How It Was Built
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl mb-6 md:mb-8 leading-tight">
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
                <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-(--text-muted)">
                  About This Project
                </h4>
                <p className="text-(--text-muted) text-lg leading-relaxed font-light">
                  {selectedProject.description}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-(--text-muted)">
                  What Made It Interesting
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
                  <p className="text-xs uppercase font-bold text-(--text-subtle)">
                    Backend
                  </p>
                  <p className="text-sm font-medium">Node / Edge</p>
                </div>
                <div className="p-4 bg-(--subtle) rounded-xl">
                  <ShieldCheck size={20} className="mb-2" />
                  <p className="text-xs uppercase font-bold text-(--text-subtle)">
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
