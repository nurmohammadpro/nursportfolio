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
    name: "Nur Mohammad", // This would come from your auth context
    email: "client@example.com",
    phone: "+880 1234 567890",
    company: "AREI Group",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="max-w-4xl space-y-16 fade-in pb-20">
      {/* 1. Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-b border-(--border-color) pb-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-(--subtle) rounded-full flex items-center justify-center border border-(--border-color)">
            <User size={40} className="text-(--text-subtle)" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-heading tracking-tight">
              {profile.name}
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-(--text-subtle)">
              Verified Client Account
            </p>
          </div>
        </div>
        <Button variant="outlined" size="sm" icon={<RefreshCcw size={14} />}>
          Sync Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* 2. Personal Information */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <User size={16} /> Personal Identity
            </h3>
            <p className="text-sm text-(--text-muted) font-light italic">
              Update how your name and company appear in reports.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 border border-(--border-color) rounded-3xl bg-(--subtle)/30 space-y-8">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-(--text-main)">
                <Shield size={16} /> Security
              </h4>
              <p className="text-[10px] text-(--text-subtle) uppercase font-bold tracking-tight">
                Access Credentials
              </p>
            </div>

            <div className="space-y-6">
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
            <p className="text-[10px] leading-relaxed text-(--text-subtle) uppercase tracking-tighter">
              Last login: Today at 1:03 PM <br />
              From: Feni, Bangladesh (Current Session)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
