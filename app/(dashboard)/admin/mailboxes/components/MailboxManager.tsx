"use client";

import { useState, useEffect } from "react";
import { Plus, Mail, Shield, Clock, Loader2, CheckCircle2 } from "lucide-react";
import Select from "@/app/components/Select";

export default function MailboxManager() {
  const [alias, setAlias] = useState("");
  const [role, setRole] = useState("Primary");
  const [isCreating, setIsCreating] = useState(false);
  const [mailboxes, setMailboxes] = useState<any[]>([]);

  const roleOptions = [
    { value: "Primary", label: "Primary" },
    { value: "Billing", label: "Billing" },
    { value: "Support", label: "Support" },
    { value: "Automation", label: "Automation" },
  ];

  // 1. Registry Sync
  useEffect(() => {
    const fetchMailboxes = async () => {
      try {
        const res = await fetch("/api/email/mailbox");
        const data = await res.json();
        if (Array.isArray(data)) {
          setMailboxes(data);
        }
      } catch (error) {
        console.error("Registry Error:", error);
      }
    };
    fetchMailboxes();
  }, []);

  // 2. Identity Provisioning Logic
  const createEmail = async () => {
    if (!alias) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/email/mailbox/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alias, role }),
      });

      const data = await res.json();
      if (res.ok) {
        setAlias("");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Provisioning Error:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 dashboard-engine">
      {/* Creation UI */}
      <div className="p-4 md:p-6 lg:p-8 bg-(--surface) border border-(--border-color) rounded-2xl md:rounded-3xl space-y-6 md:space-y-8">
        <div className="space-y-1">
          <p className="text-xl md:text-2xl font-semibold">
            Create New <span className="font-bold ">Mailboxes</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6 bg-(--subtle)/5 border border-(--border-color) rounded-xl md:rounded-2xl">
          <div className="flex-1 space-y-2">
            <p className="text-xs font-medium text-(--text-muted)">
              Email Identity
            </p>
            <div className="flex items-center gap-2">
              <input
                value={alias}
                onChange={(e) => setAlias(e.target.value.toLowerCase())}
                placeholder="e.g. support"
                className="bg-transparent border-b border-(--border-color) outline-none text-sm font-normal w-full focus:border-(--text-main) transition-colors"
              />
              <p className="text-sm font-semibold opacity-80 whitespace-nowrap">
                @nurmohammad.pro
              </p>
            </div>
          </div>

          <div className="w-full sm:w-56 flex items-end">
            <Select
              label="Role"
              options={roleOptions}
              value={role}
              onChange={setRole}
            />
          </div>

          <button
            onClick={createEmail}
            disabled={isCreating}
            className="w-full sm:w-auto bg-(--text-main) text-(--surface) px-6 md:px-8 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 min-h-11 cursor-pointer"
          >
            {isCreating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Plus size={14} />
            )}
            <p className="text-xs font-black uppercase tracking-widest">
              Create
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
