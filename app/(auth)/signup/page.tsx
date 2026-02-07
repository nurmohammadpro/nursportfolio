"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePasswordVisibility } from "@/app/hooks/usePasswordVisibility";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Individual visibility hooks
  const passView = usePasswordVisibility();
  const confirmPassView = usePasswordVisibility();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Signup failed.");
      }

      router.push("/signin");
    } catch (err: any) {
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-(--surface) px-4"
      style={{ minHeight: "calc(100vh - 180px)" }}
    >
      <div className="w-full max-w-sm space-y-12 py-12">
        <div className="text-center space-y-4">
          <h3 className="text-5xl font-heading">
            Join the <span className="italic text-(--text-muted)">Engine</span>
          </h3>
          <p className="text-[10px] uppercase tracking-widest font-bold text-(--text-subtle)">
            Register Security Credentials
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-8">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e: any) =>
              setFormData({ ...formData, name: e.target.value })
            }
            fullWidth
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e: any) =>
              setFormData({ ...formData, email: e.target.value })
            }
            fullWidth
            required
          />

          <Input
            label="Password"
            type={passView.isVisible ? "text" : "password"}
            value={formData.password}
            onChange={(e: any) =>
              setFormData({ ...formData, password: e.target.value })
            }
            fullWidth
            required
            endAdornment={
              <button
                type="button"
                onClick={passView.toggleVisibility}
                className="text-(--text-subtle) hover:text-(--text-main)"
              >
                {passView.isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <Input
            label="Confirm Password"
            type={confirmPassView.isVisible ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e: any) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            fullWidth
            required
            error={
              formData.password !== formData.confirmPassword &&
              formData.confirmPassword !== ""
            }
            endAdornment={
              <button
                type="button"
                onClick={confirmPassView.toggleVisibility}
                className="text-(--text-subtle) hover:text-(--text-main)"
              >
                {confirmPassView.isVisible ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            }
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={loading}
            loading={loading}
            icon={<ArrowRight />}
            iconPosition="right"
          >
            Sign Up
          </Button>
        </form>

        <p className="text-[10px] uppercase tracking-widest font-bold text-(--text-subtle) text-center">
          Already a member?{" "}
          <Link
            href="/signin"
            className="text-(--text-main) hover:underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
