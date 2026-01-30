"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  CreditCard,
  FileText,
} from "lucide-react";
import { Project, Client } from "@/app/lib/agency-types";

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);

  // In a real app, you'd fetch the project here using params.id

  return (
    <div className="fade-in space-y-16">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-(--brand)">
            {project?.status.replace("_", " ") || "Active Project"}
          </span>
          <h1 className="text-5xl md:text-7xl font-heading tracking-tighter">
            {project?.title || "System Architecture"}
          </h1>
        </div>

        <div className="flex gap-4">
          <div className="px-6 py-4 bg-(--subtle) rounded-2xl border border-(--border-color)">
            <p className="text-[10px] uppercase font-bold text-(--text-subtle) mb-1">
              Total Budget
            </p>
            <p className="text-xl font-heading">
              ${project?.totalPrice || "0.00"}
            </p>
          </div>
          <div className="px-6 py-4 bg-(--subtle) rounded-2xl border border-(--border-color)">
            <p className="text-[10px] uppercase font-bold text-(--text-subtle) mb-1">
              Payment Model
            </p>
            <p className="text-xl font-heading capitalize">
              {project?.paymentModel || "Advance"}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Project Roadmap */}
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-(--text-main) flex items-center gap-3">
              <Clock size={16} /> Roadmap & Milestones
            </h3>

            <div className="space-y-1 ml-2">
              {project?.milestones.map((milestone, idx) => (
                <div key={idx} className="relative flex gap-6 pb-10 last:pb-0">
                  {/* Vertical Line Connector */}
                  {idx !== project.milestones.length - 1 && (
                    <div className="absolute left-2.75 top-8 w-1px h-full bg-(--border-color)" />
                  )}

                  <div className="relative z-10 pt-1">
                    {milestone.completed ? (
                      <CheckCircle2
                        size={22}
                        className="text-(--text-main) bg-(--surface)"
                      />
                    ) : (
                      <Circle
                        size={22}
                        className="text-(--border-color) bg-(--surface)"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <p
                      className={`text-lg font-medium ${milestone.completed ? "text-(--text-main)" : "text-(--text-muted)"}`}
                    >
                      {milestone.label}
                    </p>
                    {milestone.completedAt && (
                      <p className="text-[10px] uppercase font-bold text-(--text-subtle)">
                        Completed{" "}
                        {new Date(milestone.completedAt).toLocaleDateString()}
                      </p>
                    )}
                    {milestone.price && (
                      <p className="text-xs font-mono text-(--text-subtle)">
                        Value: ${milestone.price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Technical Notes & Files */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 border border-(--border-color) rounded-3xl space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <FileText size={16} /> Engineering Notes
            </h4>
            <p className="text-sm leading-relaxed text-(--text-muted) font-light italic">
              {project?.notes ||
                "No technical notes have been added to this phase yet. Check back after the next architectural review."}
            </p>
          </div>

          <div className="p-8 bg-(--text-main) text-(--surface) rounded-3xl space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-60">
              Next Action
            </h4>
            <p className="text-xl font-heading">
              {project?.progress === 100
                ? "Project Delivered"
                : "Awaiting Security Handshake"}
            </p>
            <button className="w-full py-3 bg-(--surface) text-(--text-main) rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
              Contact Engineer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
