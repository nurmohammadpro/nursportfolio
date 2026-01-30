"use client";

import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { FileText, Plus, Zap } from "lucide-react";

export default function TemplateManager() {
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    return onSnapshot(collection(db, "email_templates"), (snapshot) => {
      setTemplates(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  return (
    <div className="space-y-12 dashboard-engine">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="p-engine-sm text-(--text-muted)">Response Library</p>
          <p className="p-engine-xl">
            Email <span className="font-bold italic">Templates.</span>
          </p>
        </div>
        <button className="flex items-center gap-2 bg-(--text-main) text-(--surface) px-4 py-2 rounded-xl">
          <Plus size={14} />
          <p className="text-[10px] font-black uppercase tracking-widest">
            New Template
          </p>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="p-6 border border-(--border-color) rounded-2xl bg-(--surface) hover:border-(--text-main) transition-all group"
          >
            <div className="flex items-center gap-3 mb-4">
              <Zap size={14} className="text-amber-500" />
              <p className="text-xs font-black uppercase tracking-widest">
                {template.label}
              </p>
            </div>
            <p className="text-[11px] text-(--text-subtle) line-clamp-3 italic mb-4">
              "{template.body}"
            </p>
            <div className="pt-4 border-t border-(--border-color) flex justify-between">
              <p className="text-[9px] font-bold text-(--text-muted) uppercase">
                {template.category}
              </p>
              <p className="text-[9px] font-black text-(--text-main) opacity-0 group-hover:opacity-100 cursor-pointer">
                Edit Template
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
