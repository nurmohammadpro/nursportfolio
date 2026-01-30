"use client";

import { useState, useEffect } from "react";
import { Project, ProjectStatus } from "@/app/lib/agency-types";
import {
  Search,
  Filter,
  ExternalLink,
  MoreVertical,
  LayoutGrid,
  List,
} from "lucide-react";
import Button from "@/app/components/Button";
import Link from "next/link";

export default function AdminMonitor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Logic for status badge styling
  const getStatusStyle = (status: ProjectStatus) => {
    switch (status) {
      case "new_inquiry":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "in_progress":
        return "bg-green-50 text-green-600 border-green-100";
      case "on_hold":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "completed":
        return "bg-slate-50 text-slate-600 border-slate-100";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  return (
    <div className="fade-in space-y-12">
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-heading tracking-tighter">
            System <span className="italic text-(--text-muted)">Monitor</span>
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-(--text-subtle)">
            Operational Overview
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-(--text-subtle)"
            />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-3 bg-(--subtle) border border-(--border-color) rounded-xl text-sm outline-none focus:border-(--text-main) transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outlined">
            <Filter size={16} />
          </Button>
        </div>
      </div>

      {/* 2. Project List Container */}
      <div className="border border-(--border-color) rounded-3xl overflow-hidden bg-(--surface)">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-(--subtle)/50 border-b border-(--border-color)">
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-(--text-subtle)">
                  Project / Client
                </th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-(--text-subtle)">
                  Service Type
                </th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-(--text-subtle)">
                  Progress
                </th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-(--text-subtle)">
                  Status
                </th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-(--text-subtle) text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-color)">
              {/* This would be a .map() over your projects */}
              <tr className="group hover:bg-(--subtle)/30 transition-colors">
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <p className="font-heading text-xl group-hover:italic transition-all">
                      AREI Group Sync
                    </p>
                    <p className="text-xs text-(--text-subtle)">
                      client@areigrp.com
                    </p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-medium text-(--text-muted)">
                    Web Automation
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="w-32 space-y-2">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-(--subtle) h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-(--text-main) h-full"
                        style={{ width: "75%" }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyle("in_progress")}`}
                  >
                    In Progress
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <Link href="/admin/projects/example-id">
                    <button className="p-2 hover:bg-(--subtle) rounded-lg transition-colors text-(--text-subtle) hover:text-(--text-main)">
                      <ExternalLink size={18} />
                    </button>
                  </Link>
                </td>
              </tr>

              {/* Empty State placeholder */}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <LayoutGrid size={48} />
                      <p className="text-sm font-light">
                        Waiting for new inquiries to populate...
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Active Sprints", value: "12" },
          { label: "Pending Inquiries", value: "05" },
          { label: "Completed this Month", value: "08" },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-8 border border-(--border-color) rounded-3xl"
          >
            <p className="text-[10px] uppercase font-bold text-(--text-subtle) mb-2">
              {stat.label}
            </p>
            <p className="text-4xl font-heading">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
