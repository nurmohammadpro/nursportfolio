"use client";

import { useState, useEffect } from "react";
import { Mail, Shield, User, Clock, CheckCircle2 } from "lucide-react";
import MailboxManager from "./components/MailboxManager";

export default function MailboxesPage() {
  const [mailboxes, setMailboxes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMailboxes = async () => {
      try {
        const res = await fetch("/api/email/mailbox");
        const data = await res.json();
        if (Array.isArray(data)) {
          setMailboxes(data);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMailboxes();
  }, []);

  return (
    <div className="space-y-12 pb-20">
      {/* Creation Section */}
      <MailboxManager />

      {/* List Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-2 md:px-4">
          <div className="space-y-1">
            <p className="text-xl md:text-2xl font-semibold">
              Active <span className="font-medium">Mailboxes</span>
            </p>
          </div>
          <p className="text-xs md:text-sm text-(--text-subtle)">
            {mailboxes.length} Active
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          {loading ? (
            <div
              key="loading"
              className="col-span-2 p-12 text-center opacity-20 italic text-sm"
            >
              Scanning Registry...
            </div>
          ) : mailboxes.length > 0 ? (
            mailboxes.map((box) => (
              <div
                key={box.id || box._id}
                className="group flex items-center justify-between p-2 md:p-4 bg-(--surface) border border-(--border-color) rounded-lg hover:border-(--text-main) transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-(--subtle)/5 flex items-center justify-center text-(--text-main) group-hover:bg-(--text-main) group-hover:text-(--surface) transition-colors">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{box.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 bg-(--subtle)/10 rounded text-(--text-muted)">
                        {box.role}
                      </span>
                      <p className="text-xs text-(--text-subtle) flex items-center gap-1">
                        <Clock size={12} />{" "}
                        {new Date(box.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 md:gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className="hidden md:block text-xs font-medium text-green-600">
                      Active
                    </p>
                  </div>
                  <Shield
                    size={14}
                    className="text-(--text-muted) hover:text-(--text-main) cursor-pointer"
                  />
                </div>
              </div>
            ))
          ) : (
            <div
              key="empty"
              className="col-span-2 p-12 border border-dashed border-(--border-color) rounded-2xl text-center"
            >
              <p className="text-sm italic opacity-40">
                No mailboxes found. Provision your first identity above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
