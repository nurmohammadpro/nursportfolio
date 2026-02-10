"use client";

import { useState, useEffect } from "react";
import {
  FilePlus2,
  Search,
  MoreVertical,
  X,
  Loader2,
  Send,
  Trash2,
  FileText,
  CheckCircle2,
  Clock,
  User,
} from "lucide-react";

export default function QuotesPage() {
  const [loading, setLoading] = useState(true);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subject: "",
    amount: "",
    projectId: "",
    clientId: "",
  });
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Fetch quotes
  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/quotes");
      const data = await res.json();
      if (data.quotes) {
        setQuotes(data.quotes);
      }
    } catch (error) {
      console.error("Failed to fetch quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch form data (clients and projects)
  const fetchFormData = async () => {
    try {
      const res = await fetch("/api/admin/quotes/form-data");
      const data = await res.json();
      if (data.clients) setClients(data.clients);
      if (data.projects) setProjects(data.projects);
    } catch (error) {
      console.error("Failed to fetch form data:", error);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (showModal) {
      fetchFormData();
    }
  }, [showModal]);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        setFormData({ subject: "", amount: "", projectId: "", clientId: "" });
        fetchQuotes();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create quote");
      }
    } catch (error) {
      console.error("Failed to submit quote:", error);
      alert("Failed to create quote");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (quoteId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchQuotes();
        setMenuOpen(null);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm("Are you sure you want to delete this quote?")) return;

    try {
      const res = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchQuotes();
        setMenuOpen(null);
      } else {
        alert("Failed to delete quote");
      }
    } catch (error) {
      console.error("Failed to delete quote:", error);
      alert("Failed to delete quote");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      sent: "bg-blue-50 text-blue-700 border-blue-200",
      paid: "bg-green-50 text-green-700 border-green-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    if (status === "sent") return <Send size={12} />;
    if (status === "paid") return <CheckCircle2 size={12} />;
    return <Clock size={12} />;
  };

  return (
    <div className="space-y-6 md:space-y-10 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1">
          <p className="text-xl md:text-2xl font-semibold text-(--text-main)">
            Project <span className="font-medium">Quotes</span>
            <span className="text-sm font-normal text-(--text-subtle) ml-2">
              ({quotes.length} total)
            </span>
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-(--brand) text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-(--brand-hover) transition-colors whitespace-nowrap"
        >
          <FilePlus2 size={16} />
          <p className="text-sm font-medium">New Quote</p>
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-(--text-subtle)" size={32} />
        </div>
      ) : quotes.length === 0 ? (
        <div className="p-12 border border-dashed border-(--border-color) rounded-2xl text-center">
          <FileText size={48} className="mx-auto text-(--text-subtle) mb-4" />
          <p className="text-lg font-medium text-(--text-subtle)">
            No quotes yet
          </p>
          <p className="text-sm text-(--text-muted) mt-2">
            Create your first quote to get started
          </p>
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="md:hidden space-y-3">
            {quotes.map((q) => (
              <div
                key={q._id}
                className="border border-(--border-color) rounded-lg p-4 bg-(--surface) space-y-3"
              >
                <div className="flex justify-between items-start">
                  <p className="text-xs font-mono font-semibold text-(--text-subtle)">
                    Q-{q._id?.toString().slice(-6).toUpperCase()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${getStatusColor(q.status)}`}
                  >
                    {getStatusIcon(q.status)}
                    {q.status}
                  </span>
                </div>
                <p className="text-base font-semibold">{q.clientName}</p>
                <p className="text-sm text-(--text-muted)">{q.projectName}</p>
                <div className="flex justify-between items-center pt-2 border-t border-(--border-color)/50">
                  <p className="text-lg font-bold">${q.amount.toFixed(2)}</p>
                  <button
                    onClick={() => setMenuOpen(menuOpen === q._id ? null : q._id)}
                    className="p-2 hover:bg-(--subtle) rounded-lg"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* Action Menu */}
                {menuOpen === q._id && (
                  <div className="absolute right-4 mt-2 w-48 bg-(--surface) border border-(--border-color) rounded-lg shadow-lg z-10 overflow-hidden">
                    {q.status === "pending" && (
                      <button
                        onClick={() => handleUpdateStatus(q._id, "sent")}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-(--subtle) flex items-center gap-2"
                      >
                        <Send size={14} /> Mark as Sent
                      </button>
                    )}
                    {q.status === "sent" && (
                      <button
                        onClick={() => handleUpdateStatus(q._id, "paid")}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-(--subtle) flex items-center gap-2"
                      >
                        <CheckCircle2 size={14} /> Mark as Paid
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteQuote(q._id)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-(--subtle) text-red-600 flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop table view */}
          <div className="hidden md:block border border-(--border-color) rounded-lg overflow-hidden bg-(--surface)">
            <div className="grid grid-cols-5 p-4 bg-(--subtle)/20 border-b border-(--border-color)">
              <p className="text-xs font-medium text-(--text-subtle)">ID</p>
              <p className="text-xs font-medium text-(--text-subtle)">Client</p>
              <p className="text-xs font-medium text-(--text-subtle)">Project</p>
              <p className="text-xs font-medium text-(--text-subtle)">Amount</p>
              <p className="text-xs font-medium text-(--text-subtle) text-right">Status</p>
            </div>
            {quotes.map((q) => (
              <div
                key={q._id}
                className="grid grid-cols-5 p-4 border-b border-(--border-color) last:border-0 hover:bg-(--subtle)/10 transition-colors relative group"
              >
                <p className="text-xs font-medium font-mono">
                  Q-{q._id?.toString().slice(-6).toUpperCase()}
                </p>
                <div>
                  <p className="text-sm font-medium">{q.clientName}</p>
                  <p className="text-xs text-(--text-subtle)">{q.clientEmail}</p>
                </div>
                <p className="text-sm text-(--text-muted) truncate pr-4">
                  {q.projectName}
                </p>
                <p className="text-sm font-semibold">${q.amount.toFixed(2)}</p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1.5 ${getStatusColor(q.status)}`}
                  >
                    {getStatusIcon(q.status)}
                    {q.status}
                  </span>
                  <button
                    onClick={() => setMenuOpen(menuOpen === q._id ? null : q._id)}
                    className="p-1.5 hover:bg-(--subtle) rounded-lg opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {menuOpen === q._id && (
                  <div className="absolute right-8 top-12 w-48 bg-(--surface) border border-(--border-color) rounded-lg shadow-lg z-10 overflow-hidden">
                    {q.status === "pending" && (
                      <button
                        onClick={() => handleUpdateStatus(q._id, "sent")}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-(--subtle) flex items-center gap-2"
                      >
                        <Send size={14} /> Mark as Sent
                      </button>
                    )}
                    {q.status === "sent" && (
                      <button
                        onClick={() => handleUpdateStatus(q._id, "paid")}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-(--subtle) flex items-center gap-2"
                      >
                        <CheckCircle2 size={14} /> Mark as Paid
                      </button>
                    )}
                    <div className="h-px bg-(--border-color)" />
                    <button
                      onClick={() => handleDeleteQuote(q._id)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-(--subtle) text-red-600 flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* New Quote Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-(--text-main)/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-(--surface) w-full max-w-lg rounded-xl border border-(--border-color) shadow-xl p-6 animate-slide-up">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-(--text-subtle) hover:text-(--text-main)"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-6">Create New Quote</h2>

            <form onSubmit={handleSubmitQuote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="e.g., Website Development Quote"
                  className="w-full border border-(--border-color) rounded-lg px-4 py-2.5 outline-none focus:border-(--text-main) bg-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="0.00"
                  className="w-full border border-(--border-color) rounded-lg px-4 py-2.5 outline-none focus:border-(--text-main) bg-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Client
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => {
                    setFormData({ ...formData, clientId: e.target.value });
                  }}
                  className="w-full border border-(--border-color) rounded-lg px-4 py-2.5 outline-none focus:border-(--text-main) bg-transparent"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name} {client.company && `(${client.company})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Project
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => {
                    setFormData({ ...formData, projectId: e.target.value });
                  }}
                  className="w-full border border-(--border-color) rounded-lg px-4 py-2.5 outline-none focus:border-(--text-main) bg-transparent"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.projectName} - {project.clientName} ({project.serviceType.replace(/-/g, " ")}) - {project.status.replace(/_/g, " ").toUpperCase()}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-(--text-subtle) mt-1.5">
                  Only projects in inquiry/proposal stage are shown
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-(--border-color) rounded-lg text-sm font-medium hover:bg-(--subtle) transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-(--brand) text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-(--brand-hover) transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FilePlus2 size={14} />
                      Create Quote
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
