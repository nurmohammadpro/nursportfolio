//app/(dashboard)/layout.tsx
"use client";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Activity,
  LogOut,
  User,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdTokenResult();
        setRole((token.claims.role as string) || "client");
        setLoading(false);
      } else {
        router.push("/signin");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-(--surface) gap-4">
        <div className="animate-spin h-6 w-6 border-2 border-(--border-color) border-t-(--text-main) rounded-full"></div>
        <span className="text-[10px] uppercase tracking-widest font-bold">
          Initializing Portal...
        </span>
      </div>
    );

  const navLinks =
    role === "admin"
      ? [
          { name: "Monitor", href: "/admin", icon: <Activity size={18} /> },
          {
            name: "Manage Blog",
            href: "/admin/blog",
            icon: <FileText size={18} />,
          },
        ]
      : [
          {
            name: "Overview",
            href: "/dashboard",
            icon: <LayoutDashboard size={18} />,
          },
          {
            name: "Services",
            href: "/dashboard/services",
            icon: <User size={18} />,
          },
        ];

  return (
    <div className="flex min-h-screen bg-(--surface)">
      {/* Sidebar */}
      <aside className="w-64 border-r border-(--border-color) flex flex-col p-8 sticky top-0 h-screen">
        <div className="mb-12">
          <h3 className="text-sm font-bold tracking-tighter italic">
            NM <span className="not-italic text-(--text-subtle)">Engine</span>
          </h3>
          <p className="text-[10px] uppercase tracking-widest font-bold text-(--text-subtle) mt-1">
            {role === "admin" ? "Systems Administrator" : "Client Access"}
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-radius-md text-sm transition-all ${
                pathname === link.href
                  ? "bg-(--subtle) text-(--text-main) font-medium"
                  : "text-(--text-muted) hover:bg-(--subtle)/50 hover:text-(--text-main)"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </nav>

        <button
          className="mt-auto flex items-center gap-4 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-md transition-all cursor-pointer"
          onClick={() => signOut(auth)}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-12 lg:p-20 overflow-y-auto">
        <div className="max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
