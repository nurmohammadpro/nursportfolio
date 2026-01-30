"use client";

import { useState } from "react";
import {
  Activity,
  Package,
  History,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react";

// Mock data reflecting your plan: purchased services and logs
const activeServices = [
  {
    id: "S1",
    client: "Duncun Immigration",
    service: "Web Automation",
    status: "running",
    progress: 75,
  },
  {
    id: "S2",
    client: "Global Tech",
    service: "Next.js Web App",
    status: "purchased",
    progress: 0,
  },
];

const serviceLogs = [
  {
    time: "19:12:05",
    event: "Automation Bot: Sequence A-1 started successfully.",
    type: "system",
  },
  {
    time: "18:45:30",
    event: "Payment Verified: Invoice #882 for Duncun Immigration.",
    type: "payment",
  },
  {
    time: "16:20:11",
    event: "Security Audit: Malware scan complete for Client Portal.",
    type: "security",
  },
];

export default function ServicesMonitor() {
  return (
    <div className="space-y-12 fade-in">
      {/* 1. Header - No headings, just weight-based P tags */}
      <div className="space-y-1">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-(--text-subtle)">
          Service Engine
        </p>
        <p className="text-3xl font-light tracking-tighter text-(--text-main)">
          Active <span className="font-bold italic">Operations</span>
        </p>
      </div>

      {/* 2. Purchased & Running Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 border border-(--border-color) bg-(--border-color)">
        {activeServices.map((service) => (
          <div
            key={service.id}
            className="bg-(--surface) p-8 space-y-6 group hover:bg-(--subtle) transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-(--text-subtle)">
                  {service.id}
                </p>
                <p className="text-xl font-bold tracking-tight">
                  {service.client}
                </p>
                <p className="text-sm font-medium text-(--text-muted)">
                  {service.service}
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-(--subtle) rounded-full">
                {service.status === "running" ? (
                  <Activity size={12} className="text-green-500" />
                ) : (
                  <Clock size={12} />
                )}
                <p className="text-[10px] font-black uppercase tracking-tighter">
                  {service.status}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-bold uppercase tracking-widest text-(--text-subtle)">
                  Deployment Progress
                </p>
                <p className="text-sm font-bold">{service.progress}%</p>
              </div>
              <div className="h-1 bg-(--subtle) rounded-full overflow-hidden">
                <div
                  className="h-full bg-(--text-main) transition-all duration-1000"
                  style={{ width: `${service.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Real-time Service Logs (P-tag optimized) */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-(--border-color) pb-4">
          <History size={16} className="text-(--text-subtle)" />
          <p className="text-xs font-black uppercase tracking-[0.2em]">
            System Logs
          </p>
        </div>

        <div className="space-y-4">
          {serviceLogs.map((log, index) => (
            <div key={index} className="flex gap-6 items-start">
              <p className="text-[11px] font-bold font-mono text-(--text-subtle) whitespace-nowrap pt-1">
                [{log.time}]
              </p>
              <p className="text-sm font-medium leading-relaxed text-(--text-muted) border-l border-(--border-color) pl-6 group-hover:text-(--text-main) transition-colors">
                {log.event}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
