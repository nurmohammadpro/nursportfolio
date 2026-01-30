"use client";

import { auth } from "@/app/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Button from "@/app/components/Button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Sign out from Firebase Client
      await signOut(auth);

      // 2. Clear the Server Session Cookie
      await fetch("/api/auth/logout", { method: "POST" });

      // 3. Redirect to the sign-in page
      router.push("/signin");
      router.refresh(); // Force a refresh to clear any cached layout states
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button
      variant="outlined"
      size="sm"
      onClick={handleLogout}
      icon={<LogOut size={16} />}
    >
      Sign Out
    </Button>
  );
}
