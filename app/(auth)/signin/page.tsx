"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Loader2, Lock, Mail } from "lucide-react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle Credentials Login
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email.toLocaleLowerCase().trim(),
        password: password,
        redirect: false,
      });
      if (result?.error) throw new Error("Invalid email or password");

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const userRole = session?.user?.role;

      // Fixed: Added leading slash for absolute path
      if (userRole === "admin") {
        router.push("/admin/monitor");
      } else {
        router.push("/client/dashboard");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/admin/monitor" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-(--surface) fade-in">
      <div className="max-w-md w-full space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-6xl font-heading tracking-tighter italic">
            Sign <span className="not-italic text-(--text-muted)">In.</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-(--text-subtle)">
            Access your agency command center
          </p>
        </div>

        <div className="space-y-6">
          {/* New Google Login Button */}
          <Button
            type="button"
            variant="outlined"
            fullWidth
            onClick={handleGoogleSignIn}
            className="border-(--border-color) hover:bg-(--subtle)"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="text-xs uppercase tracking-widest font-bold">
                Continue with Google
              </span>
            </div>
          </Button>

          <div className="relative flex items-center py-2">
            <div className="grow border-t border-(--border-color)"></div>
            <span className="shrink mx-4 text-[10px] font-bold text-(--text-subtle) uppercase tracking-widest">
              or use key
            </span>
            <div className="grow border-t border-(--border-color)"></div>
          </div>

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
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                icon={<Mail size={16} />}
                fullWidth
              />
              <Input
                label="Security Key"
                type="password"
                required
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                icon={<Lock size={16} />}
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
        </div>

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
