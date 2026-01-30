"use client";

import { useState, useEffect } from "react";
import { Search, User, FileText, Activity, Command } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Handle Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-(--text-main)/20 backdrop-blur-md transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Search Box */}
      <div className="relative w-full max-w-2xl bg-(--surface) rounded-2xl shadow-2xl border border-(--border-color) overflow-hidden animate-slide-up">
        <div className="flex items-center px-6 py-4 border-b border-(--border-color)">
          <Search size={20} className="text-(--text-subtle) mr-4" />
          <input
            autoFocus
            className="w-full bg-transparent outline-none text-lg font-light text-(--text-main) placeholder-(--text-subtle)"
            placeholder="Search anything... (Posts, Clients, Orders)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1 px-2 py-1 bg-(--subtle) rounded border border-(--border-color) text-[10px] font-bold text-(--text-subtle)">
            <Command size={10} /> ESC
          </div>
        </div>

        {/* Dynamic Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {query.length > 0 ? (
            <>
              {/* Category: Projects */}
              <div className="space-y-2">
                <h4 className="px-4 text-[10px] uppercase tracking-widest font-bold text-(--text-subtle)">
                  Active Projects
                </h4>
                <button
                  onClick={() => {
                    router.push("/admin/projects/id");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-(--subtle) transition-colors text-left group"
                >
                  <Activity
                    size={18}
                    className="text-(--text-subtle) group-hover:text-(--text-main)"
                  />
                  <div>
                    <p className="text-sm font-medium">AREI Group Sync</p>
                    <p className="text-[10px] text-(--text-subtle)">
                      In Progress • 75%
                    </p>
                  </div>
                </button>
              </div>

              {/* Category: Blog */}
              <div className="space-y-2">
                <h4 className="px-4 text-[10px] uppercase tracking-widest font-bold text-(--text-subtle)">
                  Blog Content
                </h4>
                <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-(--subtle) transition-colors text-left group">
                  <FileText
                    size={18}
                    className="text-(--text-subtle) group-hover:text-(--text-main)"
                  />
                  <p className="text-sm font-medium">
                    Securing Next.js 15 Routes
                  </p>
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm text-(--text-muted)">
                Start typing to search your ecosystem
              </p>
              <p className="text-[10px] uppercase tracking-widest text-(--text-subtle)">
                Quick Jump: Projects, Inquiries, Blog
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
