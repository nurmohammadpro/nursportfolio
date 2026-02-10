"use client";

import { useState } from "react";
import { User, Shield, Save, Key, RefreshCcw } from "lucide-react";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import { usePasswordVisibility } from "@/app/hooks/usePasswordVisibility";
import { Eye, EyeOff } from "lucide-react";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const { isVisible, toggleVisibility } = usePasswordVisibility();

  const [profile, setProfile] = useState({
    name: "Nur Mohammad",
    email: "client@example.com",
    phone: "+880 1234 567890",
    company: "AREI Group",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="max-w-4xl space-y-8 md:space-y-12 fade-in pb-12 md:pb-20">
      {/* 1. Profile Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 items-start sm:items-center justify-between border-b border-(--border-color) pb-6 md:pb-8">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-(--subtle) rounded-full flex items-center justify-center border border-(--border-color) shrink-0">
            <User size={32} md:size={40} className="text-(--text-subtle)" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-semibold">
              {profile.name}
            </h1>
            <p className="text-xs text-(--text-subtle)">
              Verified Client Account
            </p>
          </div>
        </div>
        <Button variant="outlined" size="sm" icon={<RefreshCcw size={14} />}>
          Sync Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* 2. Personal Information */}
        <div className="lg:col-span-7 space-y-4 md:space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <User size={16} /> Personal Identity
            </h3>
            <p className="text-sm text-(--text-muted)">
              Update how your name and company appear in reports.
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
              Save Profile
            </Button>
          </form>
        </div>

        {/* 3. Security Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 border border-(--border-color) rounded-xl bg-(--subtle)/30 space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2 text-(--text-main)">
                <Shield size={16} /> Security
              </h4>
              <p className="text-xs text-(--text-subtle)">
                Access Credentials
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Current Password"
                type={isVisible ? "text" : "password"}
                fullWidth
                endAdornment={
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className="text-(--text-subtle) hover:text-(--text-main)"
                  >
                    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              <Input label="New Password" type="password" fullWidth />
              <Button variant="outlined" fullWidth icon={<Key size={16} />}>
                Update Password
              </Button>
            </div>
          </div>

          <div className="px-4">
            <p className="text-xs text-(--text-subtle)">
              Last login: Today at 1:03 PM <br />
              From: Feni, Bangladesh (Current Session)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
