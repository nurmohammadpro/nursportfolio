"use client";

import { Shield, Lock, Fingerprint, Database, Smartphone } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="space-y-12 fade-in">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-2xl font-semibold">
          Admin <span className="font-medium">Settings</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role-Based Access Control Section */}
        <div className="p-6 border border-(--border-color) rounded-xl bg-(--surface) space-y-4">
          <div className="flex items-center gap-3 border-b border-(--border-color) pb-3">
            <Shield size={16} className="text-(--text-main)" />
            <p className="text-sm font-medium">
              Access Control (RBAC)
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold">Admin Privileges</p>
                <p className="text-xs text-(--text-subtle)">
                  Restricted to UID: LPE3pq...QV2
                </p>
              </div>
              <div className="px-3 py-1 bg-green-50 border border-green-200 rounded">
                <p className="text-xs font-medium text-green-600">
                  Verified
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Native App Sync Settings */}
        <div className="p-6 border border-(--border-color) rounded-xl bg-(--surface) space-y-4">
          <div className="flex items-center gap-3 border-b border-(--border-color) pb-3">
            <Smartphone size={16} className="text-(--text-main)" />
            <p className="text-sm font-medium">
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
            <p className="text-xs text-(--text-subtle)">
              Syncing Firestore listeners with iOS/Android endpoints for instant
              project updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
