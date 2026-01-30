"use client";

"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Link from "next/link";

export default function RequestQuotePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceType = searchParams.get("type") || "web-development";
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    projectDescription: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        body: JSON.stringify({ ...formData, serviceType }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 3000);
      }
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 fade-in">
        <p className="text-5xl font-light tracking-tighter italic text-(--text-main)">
          Transmission <span className="font-bold not-italic">Complete.</span>
        </p>
        <p className="text-[10px] uppercase tracking-widest font-black text-(--text-subtle)">
          Inquiry logged in engine.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="space-y-6">
        <Link
          href="/dashboard/services"
          className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-black text-(--text-subtle) hover:text-(--text-main) transition-colors"
        >
          <ArrowLeft size={12} /> Return to Catalog
        </Link>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--text-subtle)">
            Onboarding Brief
          </p>
          <p className="text-4xl font-light tracking-tighter capitalize">
            {serviceType.replace("-", " ")}
          </p>
        </div>
      </div>

      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Identity / Name" fullWidth required />
          <Input
            label="Communication / Email"
            type="email"
            fullWidth
            required
          />
        </div>
        <div className="space-y-2">
          <p className="text-[9px] uppercase tracking-widest font-black text-(--text-subtle) ml-1">
            Project Objectives
          </p>
          <textarea
            required
            className="w-full bg-(--subtle)/30 border border-(--border-color) rounded-xl p-6 outline-none focus:border-(--text-main) h-40 font-body text-sm font-medium leading-relaxed transition-all"
            placeholder="Define the problem space..."
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
          icon={
            loading ? <Loader2 className="animate-spin" /> : <Send size={16} />
          }
        >
          {loading ? "Transmitting..." : "Initiate Brief"}
        </Button>
      </form>
    </div>
  );
}
