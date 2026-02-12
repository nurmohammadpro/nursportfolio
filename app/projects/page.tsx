"use client";

import { useState } from "react";
import { Metadata } from "next";
import {
  ArrowUpRight,
  X,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import Button from "@/app/components/Button";

interface Project {
  id: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  caseStudy: string;
  challenges: string[];
  technologies: string[];
  duration?: string;
  year?: string;
}

// NDA-compliant project data - no company names, no photos, no URLs
const projects: Project[] = [
  {
    id: "realtime-sync-platform",
    title: "Real-Time Data Synchronization Platform",
    category: "Web Application / Real-time Sync",
    problem:
      "Client needed a connected system where mobile apps and web platform stay in sync with complex data flows and high-frequency updates.",
    solution:
      "Built a real-time synchronization system using Next.js 15, Cloudflare Workers for edge processing, and WebSocket-based communication for instant data propagation.",
    caseStudy:
      "Implemented a WebSocket-based real-time sync system that handles job postings, donations, and internal messaging. The system processes thousands of data points per minute while maintaining consistency across all client devices. Added intelligent conflict resolution and offline queuing.",
    challenges: [
      "Keeping data in sync across all devices in real-time",
      "Handling high-frequency data updates reliably",
      "Building an internal messaging system with delivery guarantees",
      "Implementing offline-first architecture with conflict resolution",
    ],
    technologies: ["Next.js 15", "Cloudflare Workers", "WebSocket"],
    duration: "3 months",
    year: "2024",
  },
  {
    id: "legal-practice-management",
    title: "Legal Practice Management System",
    category: "Legal / Document Management",
    problem:
      "Law firm needed a secure system to track visa applications, manage sensitive client documents, and maintain audit trails.",
    solution:
      "Developed a comprehensive management platform with React frontend, Node.js backend, and MongoDB for encrypted document storage. Implemented role-based access control and automatic audit logging.",
    caseStudy:
      "Created a document management system with AES-256 encryption for sensitive legal documents. The system features automatic visa status tracking via government API integration, comprehensive audit logging for regulatory compliance, and granular permission system for different staff roles.",
    challenges: [
      "Keeping legal documents safe with end-to-end encryption",
      "Tracking visa status automatically through external APIs",
      "Implementing granular access control for different staff roles",
      "Maintaining comprehensive audit trails for compliance",
    ],
    technologies: ["React", "Node.js", "MongoDB", "Encryption"],
    duration: "4 months",
    year: "2024",
  },
];

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const closeDrawer = () => setSelectedProject(null);

  return (
    <main className="w-full bg-(--surface) py-16 md:py-24 lg:py-32">
      <div className="layout-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 lg:mb-24 gap-4 md:gap-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-(--text-subtle) mb-4">
              Portfolio
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-7xl mb-4 md:mb-6">
              Recent <span className="text-(--text-muted)">Projects</span>
            </h1>
            <p className="text-base md:text-lg text-(--text-muted) font-light">
              Real applications built to solve real problems.
            </p>
          </div>
        </div>

        {/* NDA Notice */}
        <div className="p-6 bg-(--subtle) border border-(--border-color) rounded-xl mb-12">
          <p className="text-sm text-(--text-muted) font-light">
            <span className="font-semibold text-(--text-main)">NDA Notice:</span>{" "}
            Due to non-disclosure agreements, project details are presented as anonymous
            technical case studies focusing on problems solved and solutions delivered. Specific company
            names and live URLs are not disclosed.
          </p>
        </div>

        {/* Project List */}
        <div className="space-y-16 md:space-y-24 lg:space-y-32">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start border-t border-(--border-color) pt-8 md:pt-12"
            >
              {/* Problem & Solution */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-[0.3em] font-bold text-(--text-subtle)">
                    {project.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl mt-3 mb-4">
                    {project.title}
                  </h2>
                  <p className="text-(--text-muted) text-base md:text-lg leading-relaxed font-light">
                    {project.problem}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-(--text-muted) mb-3">
                    The Solution
                  </h3>
                  <p className="text-(--text-main) text-base md:text-lg leading-relaxed font-light">
                    {project.solution}
                  </p>
                </div>

                {/* Expand Case Study Button */}
                <button
                  onClick={() =>
                    setExpandedId(expandedId === project.id ? null : project.id)
                  }
                  className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-(--brand) hover:underline"
                >
                  {expandedId === project.id ? "Hide Case Study" : "View Case Study"}
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>

            {/* Expandable Case Study */}
            {expandedId === project.id && (
              <div className="lg:col-span-12 lg:col-span-5 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-(--text-muted)">
                    Case Study Details
                  </h3>
                  <p className="text-(--text-main) text-base md:text-lg leading-relaxed font-light">
                    {project.caseStudy}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-(--text-muted)">
                    Key Challenges
                  </h3>
                  <ul className="space-y-4">
                    {project.challenges.map((challenge) => (
                      <li key={challenge} className="flex items-start gap-4 text-(--text-main)">
                        <CheckCircle2 size={20} className="shrink-0 text-(--brand) mt-0.5" />
                        <span className="font-light text-sm">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-(--text-muted)">
                        Technologies Used
                    </h3>
                  </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 rounded-full bg-(--subtle) text-(--text-main) text-xs uppercase font-semibold border border-(--border-color)"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-(--text-subtle)">
                    {project.duration && `${project.duration} • `}
                    {project.year && `Completed in ${project.year}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
