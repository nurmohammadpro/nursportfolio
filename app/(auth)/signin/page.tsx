"use client";

import { useState } from "react";
import { auth } from "@/app/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { LogIn, Loader2, Lock, Mail } from "lucide-react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Authenticate with Firebase Client SDK
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // 2. Retrieve the ID Token (force refresh to get current claims)
      const idToken = await user.getIdToken(true);

      // 3. Sync the session with the Server (API Route) to set the 'session' cookie
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) throw new Error("Failed to establish server session.");

      const { role } = await response.json();

      // 4. Role-Based Redirection
      // Based on your admin status, you will be routed to /admin
      if (role === "admin") {
        router.push("/admin/monitor");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setError("Invalid credentials or access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-(--surface) fade-in"
      style={{ minHeight: "calc(100vh - 180px)" }}
    >
      <div className="max-w-md w-full space-y-12">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <h1 className="text-6xl font-heading tracking-tighter italic">
            Sign <span className="not-italic text-(--text-muted)">In.</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-(--text-subtle)">
            Access your agency command center
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSignIn} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-widest border border-red-100 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="nurprodev@gmail.com"
              icon={<Mail size={16} />}
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              fullWidth
            />
            <Input
              label="Security Key"
              type="password"
              required
              placeholder="••••••••"
              icon={<Lock size={16} />}
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              fullWidth
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
            icon={
              loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <LogIn size={18} />
              )
            }
          >
            {loading ? "Authenticating..." : "Enter Dashboard"}
          </Button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-[10px] uppercase font-bold text-(--text-subtle) tracking-widest">
          New client?{" "}
          <Link
            href="/signup"
            className="text-(--text-main) underline underline-offset-4"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
