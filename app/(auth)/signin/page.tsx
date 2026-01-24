"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { auth } from "@/app/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
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
    <div className="flex flex-col min-h-screen items-center justify-center bg-primary px-4 font-sans">
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
            <Input
              label="Email"
              value={email}
              variant="filled"
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <Input
              label="Password"
              value={password}
              variant="filled"
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
          </div>
        </div>
        <Button type="submit" variant="contained">
          Sign In
        </Button>
        <p className="text-sm text-on-surface-variant">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline transition-all ease-in-out duration-200"
          >
            Sign Up Now
          </Link>
        </p>
      </form>
    </div>
  );
}
