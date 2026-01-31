"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { completeMilestoneAndRequestPayment } from "@/app/lib/milestone-logic";
import { Activity, CheckCircle2, DollarSign, Clock } from "lucide-react";

export default function AdminMonitor() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "projects"), orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-12 fade-in dashboard-engine">
      {/* Engine Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="p-engine-sm">System Oversight</p>
          <p className="p-engine-xl">
            Admin{" "}
            <span className="font-semibold text-(--text-main)">Dashboard</span>
          </p>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-(--border-color) rounded-2xl bg-(--surface) overflow-hidden shadow-sm"
          >
            {/* Project Banner */}
            <div className="p-6 border-b border-(--border-color) flex justify-between items-center bg-(--subtle)/10">
              <div className="space-y-1">
                <p className="text-lg font-bold tracking-tight">
                  {project.title}
                </p>
                <p className="p-engine-sm text-[9px]">
                  {project.serviceType} • Total Allocation: $
                  {project.totalPrice}
                </p>
              </div>
              <p className="text-[10px] font-black uppercase px-3 py-1 bg-(--surface) border border-(--border-color) rounded">
                {project.status.replace("_", " ")}
              </p>
            </div>

            {/* Production-Grade Milestone Linkage */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {project.milestones?.map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 border border-(--border-color) rounded-xl space-y-3 group transition-all hover:border-(--text-main)"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={
                        m.completed ? "text-green-600" : "text-(--text-subtle)"
                      }
                    >
                      <CheckCircle2 size={16} />
                    </div>
                    {m.completed && (
                      <p className="text-[8px] font-bold text-green-600 uppercase">
                        Logged
                      </p>
                    )}
                  </div>
                  <p
                    className={`text-xs ${m.completed ? "font-black" : "font-medium text-(--text-muted)"}`}
                  >
                    {m.label}
                  </p>

                  {!m.completed && (
                    <button
                      onClick={() =>
                        completeMilestoneAndRequestPayment(
                          project.id,
                          idx,
                          m.label,
                        )
                      }
                      className="w-full flex items-center justify-center gap-2 bg-(--text-main) text-(--surface) py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <DollarSign size={12} />
                      <p className="text-[9px] font-black uppercase tracking-widest">
                        Complete & Bill
                      </p>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
