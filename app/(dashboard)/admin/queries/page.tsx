"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Trash2,
  Search,
  Clock,
  MessageSquare,
  X,
  Save,
} from "lucide-react";
import { cn } from "@/app/lib/utils";

interface ContactQuery {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  subject: string;
  message: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  notes?: string;
  createdAt: string;
  respondedAt?: string;
  resolvedAt?: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-800" },
  closed: { label: "Closed", color: "bg-gray-100 text-gray-800" },
};

export default function AdminQueries() {
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);

  useEffect(() => {
    fetchQueries();
  }, [statusFilter, page]);

  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      params.append("page", page.toString());

      const response = await fetch(`/api/admin/queries?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setQueries(data.data || data);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error("Failed to fetch queries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this query?")) return;

    try {
      const response = await fetch(`/api/admin/queries/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setQueries(queries.filter((q) => q._id !== id));
        if (selectedQuery?._id === id) setSelectedQuery(null);
      }
    } catch (error) {
      console.error("Failed to delete query:", error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/queries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        const updatedQuery = await response.json();
        setQueries(
          queries.map((q) => (q._id === id ? updatedQuery : q))
        );
        if (selectedQuery?._id === id) {
          setSelectedQuery(updatedQuery);
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedQuery || editingNotes === null) return;

    try {
      const response = await fetch(`/api/admin/queries/${selectedQuery._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: editingNotes }),
      });
      if (response.ok) {
        const updatedQuery = await response.json();
        setQueries(
          queries.map((q) => (q._id === selectedQuery._id ? updatedQuery : q))
        );
        setSelectedQuery(updatedQuery);
        setEditingNotes(null);
      }
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  };

  return (
    <div className="space-y-6 md:space-y-10 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xl md:text-2xl font-semibold">
            Contact <span className="font-medium">Queries</span>
          </p>
          <p className="text-sm text-(--text-subtle)">
            Manage incoming contact form submissions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--text-muted)" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchQueries()}
            placeholder="Search by name, email, or subject..."
            className="w-full pl-10 pr-4 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--brand)"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 bg-(--primary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queries List */}
        <div className="lg:col-span-1">
          {isLoading ? (
            <div className="text-center py-12 text-(--text-subtle)">
              Loading queries...
            </div>
          ) : queries.length > 0 ? (
            <div className="space-y-2">
              {queries.map((query) => (
                <div
                  key={query._id}
                  onClick={() => setSelectedQuery(query)}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all hover:border-(--brand)",
                    selectedQuery?._id === query._id
                      ? "bg-(--subtle) border-(--brand)"
                      : "bg-(--surface) border-(--border-color)"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-semibold truncate">
                      {query.name}
                    </p>
                    <span
                      className={cn(
                        "px-2 py-0.5 text-xs font-medium rounded shrink-0",
                        statusLabels[query.status]?.color
                      )}
                    >
                      {statusLabels[query.status]?.label}
                    </span>
                  </div>
                  <p className="text-xs text-(--text-subtle) mb-1">
                    {query.email}
                  </p>
                  <p className="text-xs text-(--text-muted) truncate">
                    {query.subject}
                  </p>
                  <p className="text-xs text-(--text-subtle) mt-2">
                    {new Date(query.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-(--secondary) border border-(--border-color) rounded-lg">
              <Mail className="w-12 h-12 mx-auto text-(--text-subtle) mb-4" />
              <p className="text-(--text-subtle)">No queries found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg hover:border-(--brand) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-(--text-subtle)">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg hover:border-(--brand) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Query Detail */}
        <div className="lg:col-span-2">
          {selectedQuery ? (
            <div className="bg-(--surface) border border-(--border-color) rounded-xl p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6 pb-6 border-b border-(--border-color)">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">
                    {selectedQuery.subject}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-sm text-(--text-subtle)">
                    <span>{selectedQuery.name}</span>
                    <span>•</span>
                    <a
                      href={`mailto:${selectedQuery.email}`}
                      className="text-(--brand) hover:underline"
                    >
                      {selectedQuery.email}
                    </a>
                    {selectedQuery.phone && (
                      <>
                        <span>•</span>
                        <a
                          href={`tel:${selectedQuery.phone}`}
                          className="text-(--brand) hover:underline"
                        >
                          {selectedQuery.phone}
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Status Selector */}
                <select
                  value={selectedQuery.status}
                  onChange={(e) =>
                    handleStatusChange(selectedQuery._id, e.target.value)
                  }
                  className="px-3 py-2 bg-(--secondary) border border-(--border-color) rounded-lg text-sm text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Details */}
              <div className="space-y-6">
                {/* Service */}
                {selectedQuery.service && (
                  <div>
                    <p className="text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-2">
                      Service Interest
                    </p>
                    <p className="text-(--text-main)">{selectedQuery.service}</p>
                  </div>
                )}

                {/* Message */}
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-2">
                    Message
                  </p>
                  <p className="text-(--text-main) leading-relaxed whitespace-pre-wrap">
                    {selectedQuery.message}
                  </p>
                </div>

                {/* Notes */}
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-(--text-subtle) mb-2">
                    Internal Notes
                  </p>
                  {editingNotes !== null ? (
                    <div className="space-y-3">
                      <textarea
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-(--secondary) border border-(--border-color) rounded-lg text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand) resize-none"
                        placeholder="Add internal notes about this query..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveNotes}
                          className="flex items-center gap-2 px-4 py-2 bg-(--brand) text-white rounded-lg hover:bg-(--brand-hover) transition-colors"
                        >
                          <Save size={16} />
                          Save Notes
                        </button>
                        <button
                          onClick={() => setEditingNotes(null)}
                          className="flex items-center gap-2 px-4 py-2 bg-(--secondary) border border-(--border-color) rounded-lg hover:border-(--brand) transition-colors"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="group">
                      <p className="text-(--text-main) leading-relaxed whitespace-pre-wrap mb-2">
                        {selectedQuery.notes || (
                          <span className="text-(--text-subtle) italic">
                            No notes added yet
                          </span>
                        )}
                      </p>
                      <button
                        onClick={() =>
                          setEditingNotes(selectedQuery.notes || "")
                        }
                        className="text-sm text-(--brand) hover:underline"
                      >
                        {selectedQuery.notes ? "Edit notes" : "Add notes"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Timestamps */}
                <div className="flex flex-wrap gap-6 text-xs text-(--text-subtle)">
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>
                      Created:{" "}
                      {new Date(selectedQuery.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {selectedQuery.respondedAt && (
                    <div className="flex items-center gap-2">
                      <MessageSquare size={14} />
                      <span>
                        Responded:{" "}
                        {new Date(selectedQuery.respondedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedQuery.resolvedAt && (
                    <div className="flex items-center gap-2">
                      <Save size={14} />
                      <span>
                        Resolved:{" "}
                        {new Date(selectedQuery.resolvedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t border-(--border-color)">
                <button
                  onClick={() => handleDelete(selectedQuery._id)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                  Delete Query
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-(--secondary) border border-(--border-color) rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-16 h-16 text-(--text-subtle) mb-4" />
              <p className="text-(--text-subtle)">
                Select a query to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
