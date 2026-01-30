"use client";

import { useState } from "react";
import { Project, ProjectStatus } from "@/app/lib/agency-types";
import {
  Save,
  RefreshCcw,
  ShieldAlert,
  CheckCircle2,
  Circle,
} from "lucide-react";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import Select from "@/app/components/Select";

const statusOptions = [
  { value: "new_inquiry", label: "New Inquiry" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

export default function AdminProjectManager({
  params,
}: {
  params: { id: string };
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  // Logic to toggle milestones locally before saving
  const toggleMilestone = (index: number) => {
    if (!project) return;
    const newMilestones = [...project.milestones];
    newMilestones[index].completed = !newMilestones[index].completed;
    newMilestones[index].completedAt = newMilestones[index].completed
      ? new Date().toISOString()
      : undefined;

    // Calculate new progress percentage
    const completedCount = newMilestones.filter((m) => m.completed).length;
    const newProgress = Math.round(
      (completedCount / newMilestones.length) * 100,
    );

    setProject({
      ...project,
      milestones: newMilestones,
      progress: newProgress,
    });
  };

  const handleUpdate = async () => {
    setSaving(true);
    // Call your /api/admin/update route here
    setSaving(false);
  };

  return (
    <div className="fade-in space-y-12 pb-20">
      {/* 1. Admin Header & Status Controller */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-(--border-color) pb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading tracking-tight">
            {project?.title || "Project Management"}
          </h1>
          <p className="text-[10px] uppercase tracking-widest font-bold text-(--text-subtle)">
            Client ID: {project?.clientId}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <Select
            label="Project Status"
            options={statusOptions}
            value={project?.status}
            onChange={(val: ProjectStatus) =>
              setProject((prev) => (prev ? { ...prev, status: val } : null))
            }
          />
          <Button
            variant="primary"
            onClick={handleUpdate}
            loading={saving}
            icon={<Save size={18} />}
          >
            Sync Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* 2. Milestone Manager */}
        <div className="lg:col-span-7 space-y-8">
          <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <RefreshCcw size={16} /> Milestone Control
          </h3>

          <div className="space-y-4">
            {project?.milestones.map((m, idx) => (
              <div
                key={idx}
                onClick={() => toggleMilestone(idx)}
                className={`flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition-all ${
                  m.completed
                    ? "bg-(--subtle) border-(--text-main)/20 opacity-100"
                    : "bg-transparent border-(--border-color) opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-4">
                  {m.completed ? (
                    <CheckCircle2 className="text-(--text-main)" />
                  ) : (
                    <Circle />
                  )}
                  <span
                    className={`font-medium ${m.completed ? "line-through text-(--text-subtle)" : ""}`}
                  >
                    {m.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase opacity-50">
                  Step {idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Financials & Rapid Notes */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 border border-(--border-color) rounded-3xl space-y-6 bg-(--subtle)/30">
            <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              Financial Overview
            </h4>
            <div className="space-y-4">
              <Input
                label="Total Price ($)"
                type="number"
                value={project?.totalPrice}
                onChange={(e: any) =>
                  setProject((prev) =>
                    prev
                      ? { ...prev, tottalPrice: parseFloat(e.target.value) }
                      : null,
                  )
                }
              />
              <div className="flex gap-4">
                <Input
                  label="Advance %"
                  type="number"
                  value={project?.advancePercentage || 0}
                />
                <div className="w-full h-16 flex flex-col justify-center border-b border-(--border-color)">
                  <span className="text-[10px] uppercase font-bold text-(--text-subtle)">
                    Model
                  </span>
                  <span className="text-sm uppercase font-bold">
                    {project?.paymentModel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert size={16} /> Internal Log
            </h4>
            <textarea
              className="w-full bg-(--subtle) border border-(--border-color) rounded-2xl p-6 outline-none focus:border-(--text-main) h-40 text-sm font-light leading-relaxed"
              placeholder="Add technical notes for the client..."
              value={project?.notes || ""}
              onChange={(e) =>
                setProject((prev) =>
                  prev ? { ...prev, notes: e.target.value } : null,
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
