"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { usePasswordVisibility } from "@/app/hooks/usePasswordVisibility";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Custom Hook Integration
  const { isVisible, toggleVisibility } = usePasswordVisibility();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      setError("Invalid credentials. Please check your email and password.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-(--surface) px-4">
      <div className="w-full max-w-sm space-y-12">
        <div className="space-y-4 text-center">
          <h3 className="text-5xl font-heading leading-tight">
            Welcome <br />{" "}
            <span className="italic text-(--text-muted)">Back</span>
          </h3>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-(--text-subtle)">
            Secure Identity Portal
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] uppercase font-bold tracking-widest rounded-sm animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-10">
          <div className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <Input
              label="Password"
              type={isVisible ? "text" : "password"}
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              fullWidth
              required
              // Passing toggle logic to the input
              endAdornment={
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="text-(--text-subtle) hover:text-(--text-main) transition-colors"
                >
                  {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={<ArrowRight />}
            iconPosition="right"
          >
            Sign In
          </Button>
        </form>

        <p className="text-[10px] uppercase tracking-widest font-bold text-(--text-subtle) text-center">
          New here?{" "}
          <Link
            href="/signup"
            className="text-(--text-main) hover:underline underline-offset-4"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
