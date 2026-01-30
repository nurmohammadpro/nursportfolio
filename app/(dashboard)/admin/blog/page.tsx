"use client";

import { PenTool, Eye, Trash2 } from "lucide-react";

export default function BlogAdmin() {
  return (
    <div className="space-y-10 fade-in">
      <div className="space-y-1">
        <p className="p-engine-sm">Content Engine</p>
        <p className="p-engine-xl">
          Article <span className="font-bold italic">Manager.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-1 bg-(--border-color) border border-(--border-color)">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-(--surface) p-6 flex justify-between items-center group"
          >
            <div className="space-y-1">
              <p className="text-sm font-bold">
                Advanced WordPress Security: Hardening your Core
              </p>
              <p className="text-[10px] font-medium text-(--text-subtle) uppercase tracking-widest">
                Published • Jan 28, 2026
              </p>
            </div>
            <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-(--text-subtle) hover:text-(--text-main)">
                <Eye size={18} />
              </button>
              <button className="text-(--text-subtle) hover:text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
