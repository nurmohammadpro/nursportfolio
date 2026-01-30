"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase"; // Your standard firebase config
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        if (tokenResult.claims.role === "admin") {
          // Redirect Nur to the command center
          router.push("/admin/monitor");
        }
      }
    });
  }, []);

  if (!authorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-(--brand)" />
        <p className="text-[10px] uppercase tracking-widest font-bold text-(--text-subtle)">
          Verifying Security Credentials...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
