"use client";
import { useState, useEffect } from "react";

export default function SignatureEditor({ mailboxId }: { mailboxId: string }) {
  const [signature, setSignature] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load existing signature
  useEffect(() => {
    const loadSignature = async () => {
      const res = await fetch(`/api/email/signature?mailboxId=${mailboxId}`);
      const data = await res.json();
      if (data.signature) {
        setSignature(data.signature);
      }
    };
    loadSignature();
  }, [mailboxId]);

  const saveSignature = async () => {
    setIsSaving(true);
    await fetch("/api/email/signature", {
      method: "POST",
      body: JSON.stringify({ mailboxId, html: signature }),
    });
    setIsSaving(false);
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">
        Email Signature
      </h3>
      <textarea
        className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
        placeholder="Enter HTML or Plain Text Signature..."
      />
      <button
        onClick={saveSignature}
        disabled={isSaving}
        className="mt-4 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm active:scale-95 transition-transform"
      >
        {isSaving ? "Saving..." : "Update Signature"}
      </button>
    </div>
  );
}
