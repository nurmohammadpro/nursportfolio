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
    <div className="space-y-10 fade-in">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="p-engine-xl text-(--text-main)">
            Project <span className="font-semibold">Quotes.</span>
          </p>
        </div>
        <button className="bg-(--text-main) text-(--surface) px-6 py-3 rounded-xl flex items-center gap-3 cursor-pointer">
          <FilePlus2 size={16} />
          <p className="text-[10px] font-bold uppercase tracking-widest">
            New Quote
          </p>
        </button>
      </div>

      <div className="border border-(--border-color) rounded-xl overflow-hidden bg-(--surface)">
        <div className="grid grid-cols-4 p-4 bg-(--subtle)/20 border-b border-(--border-color)">
          <p className="p-engine-sm text-[9px]">ID</p>
          <p className="p-engine-sm text-[9px]">Client</p>
          <p className="p-engine-sm text-[9px]">Amount</p>
          <p className="p-engine-sm text-[9px] text-right">Status</p>
        </div>
        {quotes.map((q) => (
          <div
            key={q.id}
            className="grid grid-cols-4 p-4 border-b border-(--border-color) last:border-0 hover:bg-(--subtle)/10 transition-colors"
          >
            <p className="text-xs font-medium font-mono">{q.id}</p>
            <p className="text-sm font-medium tracking-tight">{q.client}</p>
            <p className="text-sm font-medium">${q.total}</p>
            <p className="text-[9px] font-normal text-right text-(--text-subtle)">
              {q.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
