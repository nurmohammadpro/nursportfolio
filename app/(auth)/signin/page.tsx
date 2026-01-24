"use client";

import Button from "@/app/components/Button";
import { auth } from "@/app/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Invalid credentials", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    // Uses bg-primary (Light Cyan: #ecfeff)
    <div className="flex min-h-screen items-center justify-center bg-primary px-4 font-sans">
      <form
        onSubmit={handleLogin}
        // Uses bg-surface (#cffafe) and border-subtle (#bae6fd)
        className="w-full max-w-sm space-y-6 bg-surface p-10 border border-subtle rounded-xl shadow-lg"
      >
        <div className="space-y-2 text-center">
          {/* Uses Playfair Display for the header */}
          <h3 className="text-3xl font-display font-bold text-fg-main">
            Sign In
          </h3>
          <p className="text-sm text-fg-muted">
            Enter your details to access your dashboard
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-fg-muted uppercase mb-1 ml-1">
              Email Address
            </label>
            <input
              className="w-full bg-primary border border-subtle rounded-lg p-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all text-fg-main placeholder:text-fg-muted/50"
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-fg-muted uppercase mb-1 ml-1">
              Password
            </label>
            <input
              className="w-full bg-primary border border-subtle rounded-lg p-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all text-fg-main placeholder:text-fg-muted/50"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <Button type="submit">Sign In</Button>
      </form>
    </div>
  );
}
