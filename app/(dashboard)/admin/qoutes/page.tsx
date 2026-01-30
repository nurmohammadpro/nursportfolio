"use client";

import { useState } from "react";
import {
  FilePlus2,
  Send,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  CheckCircle,
} from "lucide-react";

const quotes = [
  {
    id: "Q-9921",
    client: "Duncun Immigration",
    total: "2,400",
    date: "Jan 28",
    status: "pending",
  },
  {
    id: "Q-9918",
    client: "AREI Group Native",
    total: "8,500",
    date: "Jan 21",
    status: "sent",
  },
  {
    id: "Q-9890",
    client: "Global Tech",
    total: "1,200",
    date: "Jan 15",
    status: "accepted",
  },
];

export default function QuotesPage() {
  return (
    <div className="space-y-10 fade-in">
      {/* Header - Weight-based hierarchy */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--text-subtle)">
            Financial Suite
          </p>
          <p className="text-3xl font-light tracking-tighter text-(--text-main)">
            Project <span className="font-bold italic">Quotes</span>
          </p>
        </div>

        <button className="flex items-center justify-center gap-3 bg-(--text-main) text-(--surface) px-6 py-3 rounded-xl transition-transform hover:scale-[0.98]">
          <FilePlus2 size={16} />
          <p className="text-xs font-bold uppercase tracking-widest">
            Generate New Quote
          </p>
        </button>
      </div>

      {/* Search and Filters - High Utility */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-(--subtle)/30 border border-(--border-color) rounded-xl">
          <Search size={14} className="text-(--text-subtle)" />
          <p className="text-xs font-medium text-(--text-subtle) flex-1">
            Search quotes by client or ID...
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-3 border border-(--border-color) rounded-xl hover:bg-(--subtle)/50 transition-colors">
            <Filter size={14} />
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Filter
            </p>
          </button>
        </div>
      </div>

      {/* Quotes List - Dense, Minimalist Table */}
      <div className="border border-(--border-color) rounded-xl overflow-hidden bg-(--surface)">
        <div className="grid grid-cols-4 md:grid-cols-6 p-4 bg-(--subtle)/20 border-b border-(--border-color)">
          <p className="text-[10px] font-black uppercase tracking-widest text-(--text-subtle)">
            ID
          </p>
          <p className="col-span-2 text-[10px] font-black uppercase tracking-widest text-(--text-subtle)">
            Client
          </p>
          <p className="hidden md:block text-[10px] font-black uppercase tracking-widest text-(--text-subtle)">
            Date
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-(--text-subtle)">
            Amount
          </p>
          <p className="hidden md:block text-[10px] font-black uppercase tracking-widest text-(--text-subtle) text-right">
            Status
          </p>
        </div>

        <div className="divide-y divide-(--border-color)">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="grid grid-cols-4 md:grid-cols-6 p-4 items-center hover:bg-(--subtle)/10 transition-colors group"
            >
              <p className="text-[11px] font-bold font-mono">{quote.id}</p>
              <p className="col-span-2 text-sm font-semibold tracking-tight">
                {quote.client}
              </p>
              <p className="hidden md:block text-xs font-medium text-(--text-muted)">
                {quote.date}
              </p>
              <p className="text-sm font-bold">${quote.total}</p>
              <div className="hidden md:flex justify-end items-center gap-2">
                <p
                  className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border ${
                    quote.status === "accepted"
                      ? "border-green-200 text-green-600 bg-green-50"
                      : quote.status === "pending"
                        ? "border-amber-200 text-amber-600 bg-amber-50"
                        : "border-(--border-color) text-(--text-subtle)"
                  }`}
                >
                  {quote.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
