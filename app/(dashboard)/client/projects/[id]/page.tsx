"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function ProjectDetails({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/client/projects/${params.id}`);
        const data = await res.json();

        if (res.ok) {
          setProject(data.project);
        } else {
          setError(data.error || "Failed to load project");
        }
      } catch (err) {
        setError("Failed to load project");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-(--text-subtle)" size={32} />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-(--text-subtle)">{error || "Project not found"}</p>
        <Link
          href="/client/dashboard"
          className="text-(--text-main) hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-12 md:space-y-16">
      {/* Back Button */}
      <Link
        href="/client/dashboard"
        className="inline-flex items-center gap-2 text-xs text-(--text-subtle) hover:text-(--text-main) transition-colors"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-(--brand)">
            {project.status?.replace(/_/g, " ") || "Active Project"}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-heading tracking-tighter">
            {project.title}
          </h1>
        </div>

        <div className="flex gap-3 md:gap-4">
          <div className="px-4 md:px-6 py-3 md:py-4 bg-(--subtle) rounded-2xl border border-(--border-color)">
            <p className="text-xs uppercase font-bold text-(--text-subtle) mb-1">
              Total Budget
            </p>
            <p className="text-lg md:text-xl font-heading">
              ${project.totalPrice?.toFixed(2) || "0.00"}
            </p>
          </div>
          <div className="px-4 md:px-6 py-3 md:py-4 bg-(--subtle) rounded-2xl border border-(--border-color)">
            <p className="text-xs uppercase font-bold text-(--text-subtle) mb-1">
              Payment Model
            </p>
            <p className="text-lg md:text-xl font-heading capitalize">
              {project.paymentModel || "Advance"}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-(--text-subtle)">Overall Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="h-2 bg-(--subtle) rounded-full overflow-hidden">
          <div
            className="h-full bg-(--text-main) transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* 2. Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Left: Project Roadmap */}
        <div className="lg:col-span-7 space-y-8 md:space-y-12">
          <div className="space-y-6 md:space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-(--text-main) flex items-center gap-3">
              <Clock size={16} /> Roadmap & Milestones
            </h3>

            {project.milestones && project.milestones.length > 0 ? (
              <div className="space-y-1 ml-2">
                {project.milestones.map((milestone: any, idx: number) => (
                  <div key={idx} className="relative flex gap-4 md:gap-6 pb-8 md:pb-10 last:pb-0">
                    {/* Vertical Line Connector */}
                    {idx !== project.milestones.length - 1 && (
                      <div className="absolute left-2.5 md:left-2.75 top-8 w-0.5 h-full bg-(--border-color)" />
                    )}

                    <div className="relative z-10 pt-1">
                      {milestone.completed ? (
                        <CheckCircle2
                          size={20}
                          className="text-(--text-main) bg-(--surface)"
                        />
                      ) : (
                        <Circle
                          size={20}
                          className="text-(--border-color) bg-(--surface)"
                        />
                      )}
                    </div>

                    <div className="space-y-1">
                      <p
                        className={`text-base md:text-lg font-medium ${milestone.completed ? "text-(--text-main)" : "text-(--text-muted)"}`}
                      >
                        {milestone.label}
                      </p>
                      {milestone.completedAt && (
                        <p className="text-xs uppercase font-bold text-(--text-subtle)">
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
            ) : (
              <p className="text-sm text-(--text-subtle)">
                No milestones defined yet.
              </p>
            )}
          </div>
        </div>

        {/* Right: Technical Notes */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8">
          <div className="p-6 md:p-8 border border-(--border-color) rounded-2xl md:rounded-3xl space-y-4 md:space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <FileText size={16} /> Project Description
            </h4>
            <p className="text-sm leading-relaxed text-(--text-muted)">
              {project.description || "No description available."}
            </p>
          </div>

          {project.notes && (
            <div className="p-6 md:p-8 border border-(--border-color) rounded-2xl md:rounded-3xl space-y-4 md:space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} /> Engineering Notes
              </h4>
              <p className="text-sm leading-relaxed text-(--text-muted) font-light">
                {project.notes}
              </p>
            </div>
          )}

          <div className="p-6 md:p-8 bg-(--text-main) text-(--surface) rounded-2xl md:rounded-3xl space-y-4">
            <h4 className="text-xs uppercase tracking-widest font-bold opacity-60">
              Service Type
            </h4>
            <p className="text-base md:text-xl font-heading capitalize">
              {project.serviceType?.replace(/-/g, " ") || "Web Development"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
