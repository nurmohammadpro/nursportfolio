"use client";

import { signOut } from "next-auth/react";
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
  MessageCircle,
  BriefcaseBusiness,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import Image from "next/image";

interface SidebarProps {
  // Keeping your role structure intact
  role: "admin" | "client";
}

export default function Sidebar({ role }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: "/signin",
        redirect: true,
      });
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const adminItems = [
    { label: "Email Client", icon: Mail, href: "/admin/email" },
    { label: "Mailboxes", icon: Mailbox, href: "/admin/mailboxes" },
    { label: "Queries", icon: MessageCircle, href: "/admin/queries" },
    { label: "Services", icon: Briefcase, href: "/admin/services" },
    { label: "Quotes", icon: FileText, href: "/admin/quotes" },
    { label: "Payments", icon: CreditCard, href: "/admin/payments" },
    { label: "Blog", icon: PenTool, href: "/admin/blog" },
    { label: "Skills", icon: BriefcaseBusiness, href: "/admin/skills" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  const clientItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/client/dashboard" },
    { label: "Services", icon: Briefcase, href: "/client/services" },
    { label: "Profile", icon: Settings, href: "/client/profile" },
  ];

  const menuItems = role === "admin" ? adminItems : clientItems;
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/Nur-New-Light.png" : "/Nur-New-Dark.png";

  return (
    <aside className="h-screen bg-(--surface) border-r border-(--border-color) flex flex-col transition-all duration-300 w-16 md:w-48">
      <div className="p-6 mb-4 flex justify-center md:justify-start">
        <Link
          href={role === "admin" ? "/admin/monitor" : "/client/dashboard"}
          className="text-xl font-bold tracking-tighter"
        >
          <Image src={logoSrc} alt="Logo" width={16} height={16} />
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-(--subtle) text-(--text-main)"
                  : "text-(--text-muted) hover:text-(--text-main) hover:bg-(--subtle)/40"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <p
                className={`hidden md:block text-sm ${isActive ? "font-semibold" : "font-medium"}`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-(--border-color)">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full p-3 text-(--text-muted) hover:text-red-600 transition-colors group cursor-pointer"
        >
          <LogOut
            size={20}
            className="group-hover:translate-x-0.5 transition-transform"
          />
          <p className="hidden md:block text-sm font-medium">Sign Out</p>
        </button>
      </div>
    </aside>
  );
}
