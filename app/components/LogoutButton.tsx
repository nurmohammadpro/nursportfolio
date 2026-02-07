"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Button from "@/app/components/Button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/signin" });
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
