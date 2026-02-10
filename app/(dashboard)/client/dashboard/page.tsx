"use client";

import { useState, useEffect } from "react";
import { Box, MessageSquare, Clock, ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  const [loading, setLoading] = useState(true);
  const [projectSummary, setProjectSummary] = useState<any>(null);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [progressRes, messagesRes] = await Promise.all([
          fetch("/api/client/progress"),
          fetch("/api/client/messages"),
        ]);

        const progressData = await progressRes.json();
        const messagesData = await messagesRes.json();

        // Set recent messages
        if (messagesData.messages) {
          setRecentMessages(messagesData.messages);
        }

        // Set project summary
        if (progressData.projects && progressData.projects.length > 0) {
          const latestProject = progressData.projects[0];
          const nextMilestone = latestProject.milestones?.find((m: any) => !m.completed);

          setProjectSummary({
            status: latestProject.status?.replace(/_/g, " ").toUpperCase() || "IN PROGRESS",
            nextMilestone: nextMilestone?.label || "Project Setup",
            updateDate: new Date(latestProject.updatedAt).toLocaleDateString(),
            progress: latestProject.progress || 0,
          });
        } else {
          setProjectSummary({
            status: "No Active Project",
            nextMilestone: "Start a new service",
            updateDate: new Date().toLocaleDateString(),
            progress: 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-(--text-subtle)" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 fade-in">
      {/* 1. Welcome Header */}
      <div className="space-y-1">
        <p className="text-xs text-(--text-subtle)">Client Portal</p>
        <p className="text-xl md:text-2xl font-semibold">
          Project{" "}
          <span className="font-medium text-(--text-main)">Overview</span>
        </p>
      </div>

      {/* 2. Primary Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-(--border-color) border border-(--border-color)">
        <div className="bg-(--surface) p-4 md:p-6 space-y-2 md:space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${projectSummary?.progress > 0 ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
            <p className="text-xs font-medium uppercase tracking-wide">
              {projectSummary?.status}
            </p>
          </div>
          <p className="text-xl md:text-2xl font-semibold leading-tight">
            {projectSummary?.nextMilestone}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-(--text-subtle)">Progress</span>
              <span className="font-medium">{projectSummary?.progress}%</span>
            </div>
            <div className="h-1 bg-(--subtle) rounded-full overflow-hidden">
              <div
                className="h-full bg-(--text-main) transition-all duration-1000"
                style={{ width: `${projectSummary?.progress || 0}%` }}
              />
            </div>
          </div>
          <p className="text-xs md:text-sm text-(--text-subtle)">
            Last update: {projectSummary?.updateDate}
          </p>
        </div>

        <Link
          href="/client/services/new"
          className="bg-(--surface) p-4 md:p-6 flex flex-col justify-between group hover:bg-(--subtle) transition-colors"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-(--text-subtle)">
            Quick Action
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm md:text-base font-semibold">
              Request <br /> New Service
            </p>
            <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* 3. Bottom Grid - Recent Activity & Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-(--border-color) pb-3">
            <MessageSquare size={16} />
            <p className="text-sm font-medium">Recent Activity</p>
          </div>
          <div className="space-y-3">
            {recentMessages.length === 0 ? (
              <div className="p-4 border border-dashed border-(--border-color) rounded-lg text-center">
                <p className="text-sm text-(--text-subtle)">
                  No activity yet. Start a new service to see updates here.
                </p>
              </div>
            ) : (
              recentMessages.slice(0, 3).map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 border border-(--border-color) rounded-lg hover:border-(--text-main) transition-colors cursor-pointer"
                >
                  <p className="text-sm font-semibold">{msg.subject}</p>
                  <p className="text-xs text-(--text-muted) mt-1">
                    {msg.preview}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 bg-(--subtle) rounded text-(--text-subtle)">
                      {msg.serviceType.replace(/-/g, " ")}
                    </span>
                    <span className="text-xs text-(--text-subtle)">
                      {msg.date}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-(--border-color) pb-3">
            <Clock size={16} />
            <p className="text-sm font-medium">Getting Started</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                <p className="text-xs text-white font-bold">✓</p>
              </div>
              <p className="text-sm text-(--text-main)">
                Account created and verified
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 rounded-full bg-(--border-color) flex items-center justify-center shrink-0 mt-0.5">
                <p className="text-xs text-(--text-subtle) font-bold">2</p>
              </div>
              <p className="text-sm text-(--text-muted)">
                Request your first service
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 rounded-full bg-(--border-color) flex items-center justify-center shrink-0 mt-0.5">
                <p className="text-xs text-(--text-subtle) font-bold">3</p>
              </div>
              <p className="text-sm text-(--text-muted)">
                Track progress in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
