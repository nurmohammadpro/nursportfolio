"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Package,
  History,
  CheckCircle2,
  Clock,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function ServicesMonitor() {
  const [loading, setLoading] = useState(true);
  const [activeServices, setActiveServices] = useState<any[]>([]);
  const [serviceLogs, setServiceLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/services-data");
        const data = await res.json();

        if (data.projects) {
          setActiveServices(data.projects);
        }
        if (data.activityLogs) {
          setServiceLogs(data.activityLogs.slice(0, 10)); // Show last 10 activities
        }
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesData();
  }, []);

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      in_progress: "In Progress",
      new_inquiry: "New Inquiry",
      completed: "Completed",
      cancelled: "Cancelled",
      on_hold: "On Hold",
    };
    return statusMap[status] || status.replace(/_/g, " ");
  };

  const isActive = (status: string) => {
    return ["in_progress", "new_inquiry"].includes(status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-(--text-subtle)" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 fade-in">
      {/* 1. Header */}
      <div className="space-y-1">
        <p className="text-xl md:text-2xl font-semibold text-(--text-main)">
          Active <span className="font-medium">Services</span>
          <span className="text-sm font-normal text-(--text-subtle) ml-2">
            ({activeServices.length} total)
          </span>
        </p>
      </div>

      {/* 2. Purchased & Running Services Grid */}
      {activeServices.length === 0 ? (
        <div className="p-12 border border-dashed border-(--border-color) rounded-2xl text-center">
          <Package size={48} className="mx-auto text-(--text-subtle) mb-4" />
          <p className="text-lg font-medium text-(--text-subtle)">
            No active services yet
          </p>
          <p className="text-sm text-(--text-muted) mt-2">
            Service requests will appear here when clients submit inquiries.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 border border-(--border-color) bg-(--border-color)">
          {activeServices.map((service) => (
            <div
              key={service._id}
              className="bg-(--surface) p-4 md:p-6 space-y-3 md:space-y-4 group hover:bg-(--subtle) transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-(--text-subtle)">
                    {service._id?.toString().slice(-6).toUpperCase()}
                  </p>
                  <p className="text-lg font-semibold">{service.clientName}</p>
                  <p className="text-sm font-medium text-(--text-muted)">
                    {service.serviceType?.replace(/-/g, " ") || "Web Development"}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-(--subtle) rounded-full">
                  {isActive(service.status) ? (
                    <Activity size={12} className="text-green-500 animate-pulse" />
                  ) : service.status === "completed" ? (
                    <CheckCircle2 size={12} className="text-green-600" />
                  ) : (
                    <Clock size={12} />
                  )}
                  <p className="text-xs font-medium">
                    {getStatusDisplay(service.status)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-xs font-medium text-(--text-subtle)">
                    Deployment Progress
                  </p>
                  <p className="text-sm font-semibold">{service.progress || 0}%</p>
                </div>
                <div className="h-1 bg-(--subtle) rounded-full overflow-hidden">
                  <div
                    className="h-full bg-(--text-main) transition-all duration-1000"
                    style={{ width: `${service.progress || 0}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-(--border-color)/50">
                <p className="text-xs text-(--text-subtle)">
                  {new Date(service.createdAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/admin/projects?projectId=${service._id}`}
                  className="text-xs font-medium text-(--brand) hover:underline flex items-center gap-1"
                >
                  View Details <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Real-time Service Logs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-(--border-color) pb-3">
          <div className="flex items-center gap-3">
            <History size={16} className="text-(--text-subtle)" />
            <p className="text-sm font-medium">Recent Activity</p>
          </div>
          <span className="text-xs text-(--text-subtle)">
            {serviceLogs.length} events
          </span>
        </div>

        {serviceLogs.length === 0 ? (
          <div className="p-8 text-center text-(--text-subtle)">
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
