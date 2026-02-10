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
    status: "Running",
    progress: 75,
  },
  {
    id: "S2",
    client: "Global Tech",
    service: "Next.js Web App",
    status: "Purchased",
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
      {/* 1. Header */}
      <div className="space-y-1">
        <p className="text-2xl font-semibold text-(--text-main)">
          Active <span className="font-medium">Services</span>
        </p>
      </div>

      {/* 2. Purchased & Running Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 border border-(--border-color) bg-(--border-color)">
        {activeServices.map((service) => (
          <div
            key={service.id}
            className="bg-(--surface) p-6 space-y-4 group hover:bg-(--subtle) transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-(--text-subtle)">
                  {service.id}
                </p>
                <p className="text-lg font-semibold">
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
                <p className="text-xs font-medium">{service.status}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-xs font-medium text-(--text-subtle)">
                  Deployment Progress
                </p>
                <p className="text-sm font-semibold">{service.progress}%</p>
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

      {/* 3. Real-time Service Logs */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-(--border-color) pb-3">
          <History size={16} className="text-(--text-subtle)" />
          <p className="text-sm font-medium">System Logs</p>
        </div>

        <div className="space-y-3">
          {serviceLogs.map((log, index) => (
            <div key={index} className="flex gap-4 items-start">
              <p className="text-xs font-medium font-mono text-(--text-subtle) whitespace-nowrap pt-0.5">
                [{log.time}]
              </p>
              <p className="text-sm text-(--text-muted) border-l border-(--border-color) pl-4 group-hover:text-(--text-main) transition-colors">
                {log.event}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
