"use client";

import { auth } from "@/app/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Track errors for UI
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Success redirect
      router.push("/dashboard");
    } catch (error) {
      console.error("Invalid credentials", error);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    // Added min-h-screen to fix vertical centering
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-4 bg-gray-50 p-8 border border-gray-200 rounded-md shadow-sm"
      >
        <h3 className="text-xl font-semibold text-center text-gray-700">
          Sign in to Dashboard
        </h3>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          className="w-full bg-white border border-gray-200 rounded-sm p-2 outline-none hover:border-gray-300 focus:border-gray-400 transition-all ease-in-out duration-300 text-gray-800"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full bg-white border border-gray-200 rounded-sm p-2 outline-none hover:border-gray-300 focus:border-gray-400 transition-all ease-in-out duration-300 text-gray-800"
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          className="w-full px-4 py-2 rounded-sm bg-gray-50 hover:bg-white border border-gray-600 font-normal text-gray-600 hover:text-gray-800 cursor-pointer transition-all ease-in-out duration-300"
          type="submit"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
