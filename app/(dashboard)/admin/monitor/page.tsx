"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  DollarSign,
  Loader2,
  Activity,
  AlertCircle,
} from "lucide-react";
import { showNotify } from "@/app/lib/toast";
import { toast } from "sonner";

export default function AdminMonitor() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // 1. Fetch data from MongoDB via API
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      toast.error("Database connection lost");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. Handle Milestone Completion in MongoDB
  const handleMilestoneUpdate = async (
    projectId: string,
    index: number,
    label: string,
  ) => {
    setUpdatingId(`${projectId}-${index}`);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/milestone`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, label }),
      });

      if (res.ok) {
        showNotify("Update Synced", `Milestone: ${label}`);
        await fetchProjects(); // Refresh UI state
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast.error("System Override Failed");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-(--brand)" size={40} />
        <p className="p-heading-sm">Initializing Oversight...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 fade-in dashboard-engine max-w-7xl mx-auto">
      {/* Engine Header */}
      <div className="flex justify-between items-end border-b border-(--border-color) pb-8">
        <div className="space-y-1">
          <p className="p-engine-sm uppercase tracking-[0.4em]">
            System Oversight
          </p>
          <p className="p-engine-xl">
            Admin{" "}
            <span className="font-semibold text-(--text-main) italic">
              Dashboard.
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 bg-(--subtle)/50 px-4 py-2 rounded-full border border-(--border-color)">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-(--text-muted)">
            Live Node: MongoDB Atlas
          </p>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 gap-8">
        {projects.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-(--border-color) rounded-3xl">
            <AlertCircle
              className="mx-auto mb-4 text-(--text-subtle)"
              size={32}
            />
            <p className="p-heading-sm">No Active Deployments Found</p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="border border-(--border-color) rounded-3xl bg-(--surface) overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Project Banner */}
              <div className="p-8 border-b border-(--border-color) flex justify-between items-center bg-(--subtle)/20">
                <div className="space-y-2">
                  <p className="text-2xl font-heading tracking-tighter italic">
                    {project.title}
                    <span className="not-italic text-(--text-subtle)">.</span>
                  </p>
                  <p className="p-engine-sm flex items-center gap-2">
                    <Activity size={12} className="text-(--brand)" />
                    {project.serviceType} • Allocation: ${project.totalPrice}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase px-4 py-1.5 bg-(--text-main) text-(--surface) rounded-full">
                    {project.status?.replace("_", " ")}
                  </p>
                </div>
              </div>

              {/* Milestones Section */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {project.milestones?.map((m: any, idx: number) => {
                  const isUpdating = updatingId === `${project._id}-${idx}`;

                  return (
                    <div
                      key={idx}
                      className="p-5 border border-(--border-color) rounded-2xl space-y-4 group transition-all hover:border-(--brand) relative bg-(--primary)/30"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={
                            m.completed
                              ? "text-green-500"
                              : "text-(--text-subtle)"
                          }
                        >
                          <CheckCircle2
                            size={18}
                            strokeWidth={m.completed ? 3 : 2}
                          />
                        </div>
                        {m.completed && (
                          <span className="text-[9px] font-black text-green-500 uppercase tracking-tighter">
                            Verified
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-[13px] tracking-tight ${m.completed ? "font-bold text-(--text-main)" : "font-medium text-(--text-muted)"}`}
                      >
                        {m.label}
                      </p>

                      {!m.completed && (
                        <button
                          onClick={() =>
                            handleMilestoneUpdate(project._id, idx, m.label)
                          }
                          disabled={!!updatingId}
                          className="w-full flex items-center justify-center gap-2 bg-(--text-main) text-(--surface) py-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          {isUpdating ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <>
                              <DollarSign size={14} />
                              <p className="text-[10px] font-black uppercase tracking-widest">
                                Execute & Bill
                              </p>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
