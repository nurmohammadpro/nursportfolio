"use client";

import { Box, MessageSquare, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
  // This data will eventually come from your Firestore sync
  const projectSummary = {
    status: "In Development",
    nextMilestone: "API Integration",
    updateDate: "Jan 30, 2026",
  };

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
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs font-medium uppercase tracking-wide">
              {projectSummary.status}
            </p>
          </div>
          <p className="text-xl md:text-2xl font-semibold leading-tight">
            {projectSummary.nextMilestone}
          </p>
          <p className="text-xs md:text-sm text-(--text-subtle)">
            Last system update: {projectSummary.updateDate}
          </p>
        </div>

        <Link
          href="/dashboard/services/new"
          className="bg-(--surface) p-4 md:p-6 flex flex-col justify-between group hover:bg-(--subtle) transition-colors"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-(--text-subtle)">
            Quick Action
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm md:text-base font-semibold">
              Request <br /> New Service
            </p>
            <ArrowUpRight
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              size={18} md:size={20}
            />
          </div>
        </Link>
      </div>

      {/* 3. Bottom Grid - Recent Inquiries & Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-(--border-color) pb-3">
            <MessageSquare size={16} />
            <p className="text-sm font-medium">
              Recent Messages
            </p>
          </div>
          {/* This will link to your future Email Client data */}
          <div className="space-y-3">
            <div className="p-4 border border-(--border-color) rounded-lg hover:border-(--text-main) transition-colors cursor-pointer">
              <p className="text-sm font-semibold">Re: Database Schema Inquiry</p>
              <p className="text-xs text-(--text-muted) mt-1">
                Nur Mohammad: "The automation logic is now..."
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-(--border-color) pb-3">
            <Clock size={16} />
            <p className="text-sm font-medium">
              Active Roadmap
            </p>
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <p className="text-xs font-mono pt-0.5 text-(--text-subtle)">
                  0{i}
                </p>
                <p className="text-sm text-(--text-muted)">
                  Phase {i} completed successfully.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
