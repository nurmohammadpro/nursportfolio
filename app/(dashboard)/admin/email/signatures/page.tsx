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
    <div className="space-y-12">
      <div className="space-y-1">
        <p className="text-xs text-(--text-muted)">Identity Control</p>
        <p className="text-2xl font-semibold">
          Email <span className="font-medium">Signatures</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {signatures.map((sig) => (
          <div
            key={sig.id}
            className="p-6 border border-(--border-color) rounded-lg bg-(--surface) space-y-4"
          >
            <div className="flex justify-between items-center border-b border-(--border-color) pb-3">
              <div className="flex items-center gap-3">
                <PenTool size={16} className="text-(--text-main)" />
                <p className="text-sm font-medium">
                  {sig.alias}
                </p>
              </div>
              <ShieldCheck size={16} className="text-green-500" />
            </div>

            <textarea
              defaultValue={sig.content}
              onBlur={(e) => handleUpdate(sig.id, e.target.value)}
              className="w-full h-32 p-3 bg-(--subtle)/5 border border-(--border-color) rounded-lg text-sm outline-none focus:border-(--text-main) transition-all resize-none"
              placeholder="Enter professional signature..."
            />

            <div className="flex justify-between items-center">
              <p className="text-xs text-(--text-subtle) italic">
                This signature is automatically appended to all{" "}
                <span className="font-medium">{sig.alias}</span> transmissions.
              </p>
              <button className="flex items-center gap-2 px-4 py-2 bg-(--brand) text-white rounded-lg hover:bg-(--brand-hover) transition-colors">
                <Save size={12} />
                <p className="text-sm font-medium">
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
