"use client";

import { FilePlus2, Search, Filter, MoreHorizontal } from "lucide-react";

const quotes = [
  {
    id: "Q-9921",
    client: "Duncun Immigration",
    total: "2,400",
    status: "Pending",
  },
  { id: "Q-9890", client: "Global Tech", total: "1,200", status: "Accepted" },
];

export default function QuotesPage() {
  return (
    <div className="space-y-6 md:space-y-10 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-1">
          <p className="text-xl md:text-2xl font-semibold text-(--text-main)">
            Project <span className="font-medium">Quotes</span>
          </p>
        </div>
        <button className="bg-(--brand) text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-(--brand-hover) transition-colors whitespace-nowrap">
          <FilePlus2 size={16} />
          <p className="text-sm font-medium">
            New Quote
          </p>
        </button>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {quotes.map((q) => (
          <div
            key={q.id}
            className="border border-(--border-color) rounded-lg p-4 bg-(--surface) space-y-2"
          >
            <div className="flex justify-between items-start">
              <p className="text-xs font-mono font-semibold text-(--text-subtle)">{q.id}</p>
              <span className="text-xs px-2 py-1 bg-(--subtle) rounded-full">{q.status}</span>
            </div>
            <p className="text-base font-semibold">{q.client}</p>
            <p className="text-sm font-medium text-(--text-muted)">${q.total}</p>
          </div>
        ))}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block border border-(--border-color) rounded-lg overflow-hidden bg-(--surface)">
        <div className="grid grid-cols-4 p-4 bg-(--subtle)/20 border-b border-(--border-color)">
          <p className="text-xs font-medium text-(--text-subtle)">ID</p>
          <p className="text-xs font-medium text-(--text-subtle)">Client</p>
          <p className="text-xs font-medium text-(--text-subtle)">Amount</p>
          <p className="text-xs font-medium text-(--text-subtle) text-right">Status</p>
        </div>
        {quotes.map((q) => (
          <div
            key={q.id}
            className="grid grid-cols-4 p-4 border-b border-(--border-color) last:border-0 hover:bg-(--subtle)/10 transition-colors"
          >
            <p className="text-xs font-medium font-mono">{q.id}</p>
            <p className="text-sm font-medium">{q.client}</p>
            <p className="text-sm font-medium">${q.total}</p>
            <p className="text-xs text-right text-(--text-subtle)">
              {q.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
