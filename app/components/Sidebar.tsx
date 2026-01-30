"use client";

import { auth } from "@/app/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Briefcase,
  FileText,
  CreditCard,
  PenTool,
  Settings,
  LogOut,
  LayoutDashboard,
  Mailbox,
} from "lucide-react";

interface SidebarProps {
  role: "admin" | "client";
}

export default function Sidebar({ role }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      // 1. Clear Firebase Client Session
      await signOut(auth);

      // 2. Clear Server-Side Session Cookie
      await fetch("/api/auth/logout", { method: "POST" });

      // 3. Redirect to login
      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const adminItems = [
    { label: "Email Client", icon: Mail, href: "/admin/email" },
    { label: "Mailboxes", icon: Mailbox, href: "/admin/mailboxes" },
    { label: "Services", icon: Briefcase, href: "/admin/services" },
    { label: "Quotes", icon: FileText, href: "/admin/quotes" },
    { label: "Payments", icon: CreditCard, href: "/admin/payments" },
    { label: "Blog", icon: PenTool, href: "/admin/blog" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  const clientItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/client/dashboard" },
    { label: "Services", icon: Briefcase, href: "/client/services" },
    { label: "Profile", icon: Settings, href: "/client/profile" },
  ];

  const menuItems = role === "admin" ? adminItems : clientItems;

  return (
    <aside className="h-screen bg-(--surface) border-r border-(--border-color) flex flex-col transition-all duration-300 w-16 md:w-64">
      {/* Brand Identity - Minimalist P-tag */}
      <div className="p-6 mb-4 flex justify-center md:justify-start">
        <Link
          href="/admin/monitor"
          className="text-xl font-bold tracking-tighter"
        >
          <p className="text-sm font-black tracking-tighter uppercase">
            {role}{" "}
            <span className="hidden md:inline text-(--text-muted)">
              Dashboard
            </span>
          </p>
        </Link>
      </div>

      {/* Role-Based Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-(--subtle) text-(--text-main)"
                  : "text-(--text-muted) hover:text-(--text-main) hover:bg-(--subtle)/40"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <p
                className={`hidden md:block text-[13px] tracking-tight ${isActive ? "font-bold" : "font-medium"}`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out Action */}
      <div className="p-4 border-t border-(--border-color)">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-4 w-full p-3 text-(--text-muted) hover:text-red-600 transition-colors group cursor-pointer"
        >
          <LogOut
            size={20}
            className="group-hover:translate-x-0.5 transition-transform"
          />
          <p className="hidden md:block text-[13px] font-bold uppercase tracking-wider">
            Sign Out
          </p>
        </button>
      </div>
    </aside>
  );
}
