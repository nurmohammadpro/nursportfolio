"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Zap } from "lucide-react";

export default function TemplateManager() {
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("/api/email/templates");
        const data = await res.json();
        if (Array.isArray(data)) {
          setTemplates(data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchTemplates();
  }, []);

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-xs text-(--text-muted)">Response Library</p>
          <p className="text-2xl font-semibold">
            Email <span className="font-medium">Templates</span>
          </p>
        </div>
        <button className="flex items-center gap-2 bg-(--brand) text-white px-4 py-2 rounded-lg hover:bg-(--brand-hover) transition-colors">
          <Plus size={14} />
          <p className="text-sm font-medium">
            New Template
          </p>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="p-4 border border-(--border-color) rounded-lg bg-(--surface) hover:border-(--text-main) transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <Zap size={14} className="text-amber-500" />
              <p className="text-xs font-medium uppercase tracking-wide">
                {template.label}
              </p>
            </div>
            <p className="text-xs text-(--text-subtle) line-clamp-3 italic mb-3">
              "{template.body}"
            </p>
            <div className="pt-3 border-t border-(--border-color) flex justify-between">
              <p className="text-xs text-(--text-muted)">
                {template.category}
              </p>
              <p className="text-xs font-medium text-(--text-main) opacity-0 group-hover:opacity-100 cursor-pointer">
                Edit Template
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
