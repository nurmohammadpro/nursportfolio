"use client";

import { useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";
import Sidebar from "@/app/components/Sidebar";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EngineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<"admin" | "client" | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/signin");
        return;
      }

      // Force refresh to get the latest custom claims for your UID
      const token = await user.getIdTokenResult(true);
      const userRole = (token.claims.role as "admin" | "client") || "client";

      setRole(userRole);
    });

    return () => unsubscribe();
  }, [router]);

  // Minimalist loading state using Raleway P-tag
  if (!role) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-(--surface) space-y-4">
        <Loader2 className="w-6 h-6 animate-spin text-(--text-subtle)" />
        <p className="text-[10px] uppercase dashboard-engine font-bold tracking-[0.3em] text-(--text-subtle)">
          Initializing Engine
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden dashboard-engine bg-(--surface) text-(--text-main)">
      {/* Shared Sidebar with role awareness */}
      <Sidebar role={role} />

      {/* The Dashboard Workspace */}
      <main className="flex-1 overflow-y-auto font-body scrollbar-hide">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
