"use client";

import { useState } from "react";
import { Plus, Shield, Globe, Loader2 } from "lucide-react";

export default function MailboxManager() {
  const [alias, setAlias] = useState("");
  const [role, setRole] = useState("Primary");
  const [isCreating, setIsCreating] = useState(false);

  const createEmail = async () => {
    if (!alias) return;
    setIsCreating(true);
    try {
      // 1. ENSURE THIS PATH IS CORRECT: api/email/mailbox/create
      const res = await fetch("/api/email/mailbox/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alias, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setAlias("");
        console.log("Success:", data);
        alert(`Mailbox ${data.email} is live on nurmohammad.pro`);
      } else {
        console.error("Server Error:", data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Network Error:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-8 space-y-8 bg-(--surface) border border-(--border-color) rounded-3xl dashboard-engine">
      <div className="space-y-1">
        <p className="p-engine-sm text-(--text-muted)">Infrastructure</p>
        <p className="p-engine-xl">
          Provision New <span className="font-bold italic">Identity.</span>
        </p>
      </div>

      <div className="flex gap-4 p-6 bg-(--subtle)/5 border border-(--border-color) rounded-2xl">
        <div className="flex-1 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-(--text-muted)">
            Alias Name
          </p>
          <div className="flex items-center gap-2">
            <input
              value={alias}
              onChange={(e) => setAlias(e.target.value.toLowerCase())}
              placeholder="e.g. support"
              className="bg-transparent border-b border-(--border-color) outline-none text-sm font-bold w-full"
            />
            <p className="text-sm font-bold opacity-40">@nurmohammad.pro</p>
          </div>
        </div>

        <div className="w-48 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-(--text-muted)">
            Role
          </p>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-transparent border-b border-(--border-color) outline-none text-sm font-bold"
          >
            <option>Primary</option>
            <option>Billing</option>
            <option>Support</option>
            <option>Automation</option>
          </select>
        </div>

        <button
          onClick={createEmail}
          disabled={isCreating}
          className="bg-(--text-main) text-(--surface) px-8 rounded-xl flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
        >
          {isCreating ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Plus size={14} />
          )}
          <p className="text-[10px] font-black uppercase tracking-widest">
            Create
          </p>
        </button>
      </div>
    </div>
  );
}
