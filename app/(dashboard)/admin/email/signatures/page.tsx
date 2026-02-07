"use client";

import { useState, useEffect } from "react";
import { PenTool, Save, ShieldCheck } from "lucide-react";

export default function SignatureManager() {
  const [signatures, setSignatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignatures = async () => {
      try {
        const res = await fetch("/api/email/signature");
        const data = await res.json();
        if (Array.isArray(data)) {
          setSignatures(data);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSignatures();
  }, []);

  const handleUpdate = async (mailboxId: string, newContent: string) => {
    await fetch("/api/email/signature", {
      method: "POST",
      body: JSON.stringify({ mailboxId, html: newContent }),
    });
  };

  return (
    <div className="space-y-12 dashboard-engine">
      <div className="space-y-1">
        <p className="p-engine-sm text-(--text-muted)">Identity Control</p>
        <p className="p-engine-xl">
          Email <span className="font-bold italic">Signatures.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {signatures.map((sig) => (
          <div
            key={sig.id}
            className="p-8 border border-(--border-color) rounded-2xl bg-(--surface) space-y-6"
          >
            <div className="flex justify-between items-center border-b border-(--border-color) pb-4">
              <div className="flex items-center gap-3">
                <PenTool size={16} className="text-(--text-main)" />
                <p className="text-xs font-black uppercase tracking-widest">
                  {sig.alias}
                </p>
              </div>
              <ShieldCheck size={16} className="text-green-500" />
            </div>

            <textarea
              defaultValue={sig.content}
              onBlur={(e) => handleUpdate(sig.id, e.target.value)}
              className="w-full h-32 p-4 bg-(--subtle)/5 border border-(--border-color) rounded-xl text-xs font-medium leading-relaxed outline-none focus:border-(--text-main) transition-all"
              placeholder="Enter professional signature..."
            />

            <div className="flex justify-between items-center">
              <p className="text-[10px] text-(--text-subtle) italic leading-tight">
                This signature is automatically appended to all{" "}
                <span className="font-bold">{sig.alias}</span> transmissions.
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-(--text-main) text-(--surface) rounded-lg hover:opacity-90 transition-all">
                <Save size={12} />
                <p className="text-[9px] font-black uppercase tracking-widest">
                  Update
                </p>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
