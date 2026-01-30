"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/app/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  addDoc,
} from "firebase/firestore";
import {
  Mail,
  Send,
  Paperclip,
  Trash2,
  Reply,
  Zap,
  ChevronRight,
  Search,
  Inbox,
  ShieldCheck,
} from "lucide-react";

// Utility for Variable Injection
const injectVariables = (template: string, data: any) => {
  const variables = {
    clientName: data.clientName || "Client",
    projectTitle: data.title || "your project",
    serviceType: data.serviceType || "development",
    ...data,
  };
  return template.replace(/\{\{(.*?)\}\}/g, (match: string, key: string) => {
    return variables[key.trim()] || match;
  });
};

export default function EmailPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [mailboxes, setMailboxes] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [activeAlias, setActiveAlias] = useState<string>("all");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // 1. Fetch Mailboxes & Templates for the Sidebars
  useEffect(() => {
    const unsubMailboxes = onSnapshot(collection(db, "mailboxes"), (s) =>
      setMailboxes(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    const unsubTemplates = onSnapshot(collection(db, "email_templates"), (s) =>
      setTemplates(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    return () => {
      unsubMailboxes();
      unsubTemplates();
    };
  }, []);

  // 2. Fetch Projects/Threads based on Active Alias
  useEffect(() => {
    let q = query(collection(db, "projects"), orderBy("updatedAt", "desc"));
    if (activeAlias !== "all") {
      q = query(
        collection(db, "projects"),
        where("clientEmail", "==", activeAlias),
      );
    }
    return onSnapshot(q, (s) => {
      setThreads(s.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [activeAlias]);

  // 3. Fetch Messages for Selected Thread
  useEffect(() => {
    if (!selectedThread) return;
    const q = query(
      collection(db, "projects", selectedThread.id, "messages"),
      orderBy("createdAt", "asc"),
    );
    return onSnapshot(q, (s) => {
      setMessages(s.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [selectedThread]);

  const handleSend = async () => {
    if (!messageText || isSending) return;
    setIsSending(true);

    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        body: JSON.stringify({
          projectId: selectedThread.id,
          text: messageText,
          clientEmail: selectedThread.clientEmail,
          subject: selectedThread.title,
          fromEmail:
            activeAlias === "all" ? "nur@nurmohammad.pro" : activeAlias,
        }),
      });

      if (res.ok) {
        setMessageText("");
      }
    } catch (err) {
      console.error("Send failed", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex bg-(--surface) border border-(--border-color) rounded-3xl overflow-hidden dashboard-engine">
      {/* COLUMN 1: NAVIGATION & ALIASES */}
      <div className="w-64 border-r border-(--border-color) bg-(--subtle)/5 p-6 flex flex-col gap-8">
        <p className="p-engine-sm font-black text-(--text-main) tracking-widest uppercase">
          nurmohammad.pro
        </p>

        <div className="space-y-4">
          <p className="p-engine-sm text-(--text-muted)">Mailboxes</p>
          <button
            onClick={() => setActiveAlias("all")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${activeAlias === "all" ? "bg-(--text-main) text-(--surface)" : "hover:bg-(--subtle)/10"}`}
          >
            <div className="flex items-center gap-2">
              <Inbox size={14} />
              <p className="text-[11px] font-bold">All Inboxes</p>
            </div>
          </button>
          {mailboxes.map((box) => (
            <button
              key={box.id}
              onClick={() => setActiveAlias(box.email)}
              className={`w-full flex flex-col px-3 py-2 rounded-xl border transition-all ${activeAlias === box.email ? "border-(--text-main) bg-(--subtle)/10" : "border-transparent opacity-60"}`}
            >
              <p className="text-[10px] font-bold truncate">{box.email}</p>
              <p className="text-[8px] uppercase font-black text-(--text-muted)">
                {box.role}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* COLUMN 2: MESSAGE LIST */}
      <div className="w-96 border-r border-(--border-color) flex flex-col bg-(--surface)">
        <div className="p-6 border-b border-(--border-color) flex justify-between items-center">
          <div>
            <p className="p-engine-xl">Inbox</p>
            <p className="p-engine-sm text-(--text-subtle)">
              {threads.length} Threads
            </p>
          </div>
          <Search size={16} className="text-(--text-muted)" />
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-(--border-color)">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`p-6 cursor-pointer transition-all ${selectedThread?.id === thread.id ? "bg-(--subtle)/15 border-l-4 border-(--text-main)" : "hover:bg-(--subtle)/5"}`}
            >
              <div className="flex justify-between mb-1">
                <p className="text-[11px] font-bold">{thread.clientName}</p>
                <p className="text-[9px] text-(--text-muted)">12:45 PM</p>
              </div>
              <p className="text-[10px] font-black uppercase text-(--text-main) mb-1 truncate">
                {thread.title}
              </p>
              <p className="text-[11px] text-(--text-subtle) line-clamp-1 italic">
                "{thread.description}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* COLUMN 3: READING PANE & COMPOSER */}
      <div className="flex-1 flex flex-col bg-(--surface)">
        {selectedThread ? (
          <div className="flex-1 flex flex-col h-full">
            {/* 1. Header: Document Identity */}
            <div className="p-8 border-b border-(--border-color) flex justify-between items-start">
              <div className="space-y-1">
                <p className="p-engine-xl font-bold">{selectedThread.title}</p>
                <div className="flex items-center gap-2 text-(--text-subtle)">
                  <p className="text-[10px] font-black uppercase tracking-tighter">
                    From:
                  </p>
                  <p className="text-xs font-medium">
                    {selectedThread.clientEmail}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-(--text-muted) font-bold uppercase">
                  Ref: {selectedThread.id.slice(0, 8)}
                </p>
                <p className="text-[10px] text-(--text-muted)">
                  {new Date(selectedThread.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* 2. Focused Document Body */}
            <div className="flex-1 overflow-y-auto p-12 bg-(--subtle)/5">
              <div className="max-w-3xl mx-auto bg-(--surface) p-10 border border-(--border-color) rounded-sm shadow-sm">
                {/* We show the latest message as a formal letter */}
                <div className="space-y-6">
                  <p className="text-xs text-(--text-muted) italic border-b border-(--border-color) pb-4">
                    Viewing the latest transmission in this project thread.
                  </p>

                  <p className="p-engine-body leading-relaxed whitespace-pre-wrap text-[13px]">
                    {messages.length > 0
                      ? messages[messages.length - 1].text
                      : selectedThread.description}
                  </p>

                  {/* Injected Signature Area */}
                  <div className="pt-8 mt-12 border-t border-(--border-color)/30">
                    <p className="text-[11px] font-bold text-(--text-main)">
                      Nur Mohammad
                    </p>
                    <p className="text-[10px] text-(--text-subtle)">
                      Web Application Developer | nurmohammad.pro
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Reply Action (remains as a composer) */}
            <div className="p-8 border-t border-(--border-color) bg-(--surface)">
              {/* ... composer logic from previous version ... */}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center opacity-20 italic">
            <p className="p-engine-sm">
              Select an inquiry to view the formal documentation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
