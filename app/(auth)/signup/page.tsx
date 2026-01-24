"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { auth } from "@/app/lib/firebase";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    () => {
      e.preventDefault();
      setError("");

      if (typeof error === "object" && error !== null && "code" in error) {
        // After the check, we can safely assert the type.
        const firebaseError = error as { code: string; message: string };

        // Handle specific Firebase errors
        if (firebaseError.code === "auth/email-already-in-use") {
          setError("This email is already registered. Please sign in instead.");
        } else if (firebaseError.code === "auth/weak-password") {
          setError("Password is too weak. Please use a stronger password.");
        } else if (firebaseError.code === "auth/invalid-email") {
          setError("Invalid email address. Please check and try again.");
        } else {
          setError(
            firebaseError.message ||
              "Failed to create account. Please try again.",
          );
        }
      } else {
        // Fallback for non-Firebase errors
        setError("An unexpected error occurred. Please try again later.");
      }
    };
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4 font-sans">
      <form
        onSubmit={handleSignup}
        // Uses bg-surface (#cffafe) and border-subtle (#bae6fd)
        className="w-full max-w-sm space-y-6 bg-surface p-10 border border-subtle rounded-xl shadow-lg"
      >
        <div className="space-y-2 text-center">
          {/* Uses Playfair Display for the header */}
          <h3 className="text-3xl font-display font-bold text-fg-main">
            Sign Up
          </h3>
          <p className="text-sm text-fg-muted">
            Create an account to get started
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            variant="filled"
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Input
            label="Email"
            value={email}
            variant="filled"
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Input
            label="Password"
            type="password"
            value={password}
            variant="filled"
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            variant="filled"
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            error={password !== confirmPassword && confirmPassword !== ""}
            helperText={
              password !== confirmPassword && confirmPassword !== ""
                ? "Passwords do not match"
                : ""
            }
          />
        </div>

        <Button type="submit" variant="contained">
          Sign Up
        </Button>

        <div className="text-center text-sm text-fg-muted">
          Already have an account?{" "}
          <a href="/signin" className="text-brand hover:underline">
            Sign In
          </a>
        </div>
      </form>
    </div>
  );
}
