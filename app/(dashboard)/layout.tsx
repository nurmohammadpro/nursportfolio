import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Sidebar from "../components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Guard: If no session, redirect to signin
  if (!session) {
    redirect("/signin");
  }

  // Normalize the role to match your SidebarProps: "admin" | "client"
  const userRole =
    session.user.role?.toLowerCase() === "admin" ? "admin" : "client";

  return (
    <div className="flex h-screen overflow-hidden bg-(--primary)">
      {/* Sidebar Component with dynamic role */}
      <Sidebar role={userRole} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="layout-container py-6 md:py-8 lg:py-10 px-4 md:px-6">{children}</div>
      </main>
    </div>
  );
}
