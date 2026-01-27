"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { auth } from "@/app/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: unknown) {
      // Firebase auth errors typically have a 'code' property
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in instead.");
      } else if (firebaseError.code === "auth/weak-password") {
        setError("Password is too weak. Please use at least 6 characters.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("Invalid email address. Please check and try again.");
      } else {
        setError(firebaseError.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4 font-sans">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm space-y-6 bg-surface p-10 border border-subtle rounded-xl shadow-lg"
      >
        <div className="space-y-2 text-center">
          <h3 className="text-3xl font-display font-bold text-on-surface">
            Sign Up
          </h3>
          <p className="text-sm text-on-surface-variant">
            Create an account to get started
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Input
            label="Full Name"
            type="text"
            value={name}
            variant="filled"
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            variant="filled"
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <Input
            label="Phone"
            type="text"
            value={phone}
            variant="filled"
            onChange={(e) => {
              const val = e.target.value.replace(/[^0-9+]/g, "");
              setPhone(val);
            }}
            fullWidth
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            variant="filled"
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            variant="filled"
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            error={password !== confirmPassword && confirmPassword !== ""}
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>

        <div className="text-center text-sm text-fg-muted">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-brand font-medium hover:underline"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
