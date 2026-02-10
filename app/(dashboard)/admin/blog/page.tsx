"use client";

import { PenTool, Eye, Trash2 } from "lucide-react";

export default function BlogAdmin() {
  return (
    <div className="space-y-6 md:space-y-10 fade-in">
      <div className="space-y-1">
        <p className="text-xl md:text-2xl font-semibold">
          Blog <span className="font-medium">Manager</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-1 bg-(--border-color) border border-(--border-color)">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-(--surface) p-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 group"
          >
            <div className="space-y-1 flex-1">
              <p className="text-base font-semibold pr-2">
                Advanced WordPress Security: Hardening your Core
              </p>
              <p className="text-xs text-(--text-subtle)">
                Published • Jan 28, 2026
              </p>
            </div>
            <div className="flex gap-3 sm:gap-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-start sm:self-auto">
              <button className="text-(--text-subtle) hover:text-(--text-main) cursor-pointer">
                <Eye size={18} />
              </button>
              <button className="text-(--text-subtle) hover:text-red-500 cursor-pointer">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
