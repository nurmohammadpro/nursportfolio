import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500 gap-6">
        <div className="animate-spin h-8 w-8 border-4 border-gray-500 border-t-transparent rounded-full"></div>
        Loading Dashboard...
      </div>
    );
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-8 lg:64 bg-white border-r border-gray-200 shadow-r flex flex-col">
        <h3 className="text-gray-600 font-semibold">
          {role === "admin" ? "Admin Panel" : "Client Portal"}
        </h3>

        <nav className="flex-1 space-y-2">
          {role === "admin" ? (
            <>
              <Link
                href="/admin"
                className="text-gray-500 hover:bg-gray-50 p-2 rounded-sm"
              >
                Monitor Clients
              </Link>
              <Link
                href="/admin/blog"
                className="text-gray-500 hover:bg-gray-50 p-2 rounded-sm"
              >
                Monitor Clients
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="text-gray-500 hover:bg-gray-50 p-2 rounded-sm"
              >
                Monitor Clients
              </Link>
              <Link
                href="/dashboard/services"
                className="text-gray-500 hover:bg-gray-50 p-2 rounded-sm"
              >
                Monitor Clients
              </Link>
            </>
          )}
        </nav>
        <button
          className="w-full px-4 py-2 rounded-sm bg-gray-50 hover:bg-white border border-gray-600 font-normal text-gray-600 hover:text-gray-800 cursor-pointer transition-all ease-in-out duration-300"
          onClick={() => auth.signOut()}
        >
          Sign Out
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
