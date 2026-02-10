"use client";

import { useState, useEffect } from "react";
import { User, Shield, Save, Key, RefreshCcw, Loader2 } from "lucide-react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { usePasswordVisibility } from "@/app/hooks/usePasswordVisibility";
import { Eye, EyeOff } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { isVisible, toggleVisibility } = usePasswordVisibility();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetchLoading(true);
        const res = await fetch("/api/client/profile");
        const data = await res.json();

        if (data.client) {
          setProfile({
            name: data.client.name || "",
            email: data.client.email || "",
            phone: data.client.phone || "",
            company: data.client.company || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUpdateSuccess(false);

    try {
      const res = await fetch("/api/client/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-(--text-subtle)" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 md:space-y-12 fade-in pb-12 md:pb-20">
      {/* 1. Profile Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 items-start sm:items-center justify-between border-b border-(--border-color) pb-6 md:pb-8">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-(--subtle) rounded-full flex items-center justify-center border border-(--border-color) shrink-0">
            <User size={32} className="text-(--text-subtle)" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-semibold">
              {profile.name || "Client"}
            </h1>
            <p className="text-xs text-(--text-subtle)">
              Verified Client Account
            </p>
          </div>
        </div>
        <Button
          variant="outlined"
          size="sm"
          icon={<RefreshCcw size={14} />}
          onClick={() => window.location.reload()}
        >
          Refresh Data
        </Button>
      </div>

      {updateSuccess && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            Profile updated successfully!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* 2. Personal Information */}
        <div className="lg:col-span-7 space-y-4 md:space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <User size={16} /> Personal Information
            </h3>
            <p className="text-sm text-(--text-muted)">
              Update how your name and company appear in communications.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={profile.name}
                onChange={(e: any) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                fullWidth
              />
              <Input
                label="Company"
                value={profile.company}
                onChange={(e: any) =>
                  setProfile({ ...profile, company: e.target.value })
                }
                fullWidth
              />
              <Input
                label="Email Address"
                value={profile.email}
                disabled
                fullWidth
                className="opacity-60 cursor-not-allowed"
              />
              <Input
                label="Phone Number"
                value={profile.phone}
                onChange={(e: any) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                fullWidth
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={<Save size={18} />}
            >
              Save Changes
            </Button>
          </form>
        </div>

        {/* 3. Account Info Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-4 md:p-6 border border-(--border-color) rounded-xl bg-(--subtle)/30 space-y-4 md:space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2 text-(--text-main)">
                <Shield size={16} /> Account Security
              </h4>
              <p className="text-xs text-(--text-subtle)">
                Password management
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-(--text-muted)">
                For security, password changes are handled through your authentication provider.
              </p>
              <Button
                variant="outlined"
                fullWidth
                icon={<Key size={16} />}
                onClick={() => window.open("https://accounts.google.com", "_blank")}
              >
                Manage Password
              </Button>
            </div>
          </div>

          <div className="px-4">
            <p className="text-xs text-(--text-subtle)">
              Last login: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} <br />
              From: Current Session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
