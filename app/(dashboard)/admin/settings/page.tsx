"use client";

import { Shield, Lock, Fingerprint, Database, Smartphone } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="space-y-12 fade-in">
      {/* Header */}
      <div className="space-y-1">
        <p className="p-engine-xl">
          Admin <span className="font-semibold">Settings.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Role-Based Access Control Section */}
        <div className="p-8 border border-(--border-color) rounded-2xl bg-(--surface) space-y-6">
          <div className="flex items-center gap-3 border-b border-(--border-color) pb-4">
            <Shield size={16} className="text-(--text-main)" />
            <p className="text-xs font-black uppercase tracking-widest">
              Access Control (RBAC)
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold">Admin Privileges</p>
                <p className="text-[11px] text-(--text-subtle)">
                  Restricted to UID: LPE3pq...QV2
                </p>
              </div>
              <div className="px-3 py-1 bg-green-50 border border-green-200 rounded">
                <p className="text-[9px] font-black text-green-600 uppercase">
                  Verified
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Native App Sync Settings */}
        <div className="p-8 border border-(--border-color) rounded-2xl bg-(--surface) space-y-6">
          <div className="flex items-center gap-3 border-b border-(--border-color) pb-4">
            <Smartphone size={16} className="text-(--text-main)" />
            <p className="text-xs font-black uppercase tracking-widest">
              AREI Group Native Sync
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">Real-Time Mobile Push</p>
              <div className="w-8 h-4 bg-green-500 rounded-full relative">
                <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5" />
              </div>
            </div>
            <p className="text-[10px] text-(--text-subtle) leading-relaxed">
              Syncing Firestore listeners with iOS/Android endpoints for instant
              project updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
