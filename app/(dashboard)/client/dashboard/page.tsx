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
    <div className="space-y-12 fade-in">
      {/* 1. Welcome Header - Minimalism with P-tags */}
      <div className="space-y-1">
        <p className="p-heading-sm">Client Portal</p>
        <p className="p-heading-xl">
          Project{" "}
          <span className="font-bold italic text-(--text-main)">Overview.</span>
        </p>
      </div>

      {/* 2. Primary Status Card - Heavy Weight Typography */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-(--border-color) border border-(--border-color)">
        <div className="bg-(--surface) p-8 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-widest">
              {projectSummary.status}
            </p>
          </div>
          <p className="text-4xl font-light tracking-tighter leading-none">
            {projectSummary.nextMilestone}
          </p>
          <p className="text-xs font-medium text-(--text-subtle)">
            Last system update: {projectSummary.updateDate}
          </p>
        </div>

        <Link
          href="/dashboard/services/new"
          className="bg-(--surface) p-8 flex flex-col justify-between group hover:bg-(--subtle) transition-colors"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-(--text-subtle)">
            Quick Action
          </p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">
              Request <br /> New Service
            </p>
            <ArrowUpRight
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              size={24}
            />
          </div>
        </Link>
      </div>

      {/* 3. Bottom Grid - Recent Inquiries & Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-(--border-color) pb-4">
            <MessageSquare size={14} />
            <p className="text-[10px] font-black uppercase tracking-widest">
              Recent Messages
            </p>
          </div>
          {/* This will link to your future Email Client data */}
          <div className="space-y-4">
            <div className="p-4 border border-(--border-color) rounded-xl hover:border-(--text-main) transition-colors cursor-pointer">
              <p className="text-xs font-bold">Re: Database Schema Inquiry</p>
              <p className="text-[11px] text-(--text-muted) mt-1">
                Nur Mohammad: "The automation logic is now..."
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-(--border-color) pb-4">
            <Clock size={14} />
            <p className="text-[10px] font-black uppercase tracking-widest">
              Active Roadmap
            </p>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <p className="text-[10px] font-bold font-mono pt-1 text-(--text-subtle)">
                  0{i}
                </p>
                <p className="text-sm font-medium text-(--text-muted)">
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
