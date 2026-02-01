"use client";

import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  doc,
  getDoc,
  updateDoc,
  DocumentSnapshot,
} from "firebase/firestore";
import {
  Plus,
  Mail,
  Send,
  Trash2,
  Archive,
  Star,
  X,
  Paperclip,
  ChevronDown,
  ArrowLeft,
  MoreVertical,
  Reply,
  ShieldAlert,
  ShieldCheck,
  Inbox,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Select from "@/app/components/Select"; // Updated custom Select

// --- HELPERS ---
const MenuAction = ({ icon: Icon, label, onClick, className = "" }: any) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`w-full flex items-center gap-3 px-4 py-2 text-[11px] font-bold hover:bg-(--subtle) transition-colors ${className}`}
  >
    <Icon size={14} />
    {label}
  </button>
);

export default function EmailPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [mailboxes, setMailboxes] = useState<any[]>([]);
  const [activeAlias, setActiveAlias] = useState("all");
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileScreen, setMobileScreen] = useState<"list" | "detail">("list");
  const [isComposing, setIsComposing] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState({
    to: "",
    subject: "",
    body: "",
    fromEmail: "",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    const unsubBoxes = onSnapshot(collection(db, "mailboxes"), (s) =>
      setMailboxes(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    return () => {
      window.removeEventListener("resize", handleResize);
      unsubBoxes();
    };
  }, []);

  // 1. Thread Listener
  useEffect(() => {
    const projectsRef = collection(db, "projects");
    const q =
      activeFolder === "starred"
        ? query(
            projectsRef,
            where("starred", "==", true),
            orderBy("updatedAt", "desc"),
          )
        : query(
            projectsRef,
            where("status", "==", activeFolder),
            orderBy("updatedAt", "desc"),
          );

    return onSnapshot(q, (s) => {
      let data = s.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (activeAlias !== "all") {
        data = data.filter(
          (t: any) =>
            t.fromEmail === activeAlias ||
            t.clientEmail === activeAlias ||
            (!t.fromEmail && activeAlias === "info@nurmohammad.pro"),
        );
      }
      setThreads(data);
    });
  }, [activeAlias, activeFolder]);

  useEffect(() => {
    if (!selectedThread) return;
    const q = query(
      collection(db, "projects", selectedThread.id, "messages"),
      orderBy("createdAt", "asc"),
    );
    return onSnapshot(q, (s) =>
      setMessages(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, [selectedThread]);

  const toggleStar = async (id: string, state: boolean) =>
    await updateDoc(doc(db, "projects", id), { starred: !state });

  const handleAction = async (threadId: string, action: string) => {
    await fetch("/api/email/action", {
      method: "PATCH",
      body: JSON.stringify({ threadId, action }),
    });
    setMenuOpen(null);
    if (["delete", "archive", "trash", "restore", "spam"].includes(action)) {
      if (isMobile) setMobileScreen("list");
      setSelectedThread(null);
    }
  };

  // --- MOBILE UI ---
  if (isMobile) {
    return (
      <div className="h-screen bg-(--primary) text-(--text-main) flex flex-col overflow-hidden font-sans">
        {mobileScreen === "list" ? (
          <>
            <header className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="p-heading-xl capitalize">{activeFolder}</h1>
                <button
                  onClick={() => {
                    const idx = mailboxes.findIndex(
                      (m) => m.email === activeAlias,
                    );
                    if (activeAlias === "all")
                      setActiveAlias(mailboxes[0]?.email);
                    else if (idx === mailboxes.length - 1)
                      setActiveAlias("all");
                    else setActiveAlias(mailboxes[idx + 1]?.email);
                  }}
                  className="bg-(--subtle) text-(--text-main) border border-(--border-color) px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest"
                >
                  {activeAlias === "all"
                    ? "All Accounts"
                    : activeAlias.split("@")[0]}
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {["inbox", "sent", "starred", "archive", "spam", "trash"].map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFolder(f)}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${activeFolder === f ? "bg-(--text-main) text-(--surface)" : "bg-(--subtle) text-(--text-muted)"}`}
                    >
                      {f}
                    </button>
                  ),
                )}
              </div>
            </header>
            <div className="flex-1 overflow-y-auto divide-y divide-(--border-color)">
              {threads.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedThread(t);
                    setMobileScreen("detail");
                  }}
                  className="p-5 active:bg-(--subtle) relative"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <Star
                        size={14}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(t.id, t.starred);
                        }}
                        className={
                          t.starred
                            ? "fill-amber-400 text-amber-400"
                            : "text-(--text-subtle)"
                        }
                      />
                      <p className="text-[15px] font-bold">{t.clientName}</p>
                      {t.unread && (
                        <div className="w-1.5 h-1.5 rounded-full bg-(--brand)" />
                      )}
                    </div>
                    <span className="p-engine-sm">
                      {new Date(t.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-[14px] font-semibold truncate">
                    {t.title}
                  </p>
                  <p className="p-body line-clamp-1 italic text-(--text-subtle)">
                    "{t.lastMessage || t.description}"
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col bg-(--surface) animate-fade-in">
            {/* MOBILE ACTION HEADER */}
            <header className="p-4 border-b border-(--border-color) flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <button onClick={() => setMobileScreen("list")}>
                  <ArrowLeft size={20} />
                </button>
                <div className="min-w-0">
                  <h2 className="p-body font-bold truncate">
                    {selectedThread?.title}
                  </h2>
                  <p className="p-engine-sm uppercase font-black text-(--text-subtle)">
                    {selectedThread?.clientName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-(--text-muted)">
                <Star
                  size={18}
                  onClick={() =>
                    toggleStar(selectedThread.id, selectedThread.starred)
                  }
                  className={
                    selectedThread?.starred
                      ? "fill-amber-400 text-amber-400"
                      : ""
                  }
                />
                <Mail
                  size={18}
                  onClick={() => handleAction(selectedThread.id, "toggleRead")}
                />
                {activeFolder === "trash" ? (
                  <Inbox
                    size={18}
                    onClick={() => handleAction(selectedThread.id, "restore")}
                  />
                ) : (
                  <Trash2
                    size={18}
                    onClick={() => handleAction(selectedThread.id, "trash")}
                  />
                )}
                {activeFolder === "spam" ? (
                  <ShieldCheck
                    size={18}
                    onClick={() => handleAction(selectedThread.id, "restore")}
                  />
                ) : (
                  <ShieldAlert
                    size={18}
                    onClick={() => handleAction(selectedThread.id, "spam")}
                  />
                )}
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((m, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl p-body ${m.type === "inbound" ? "bg-(--subtle) mr-8" : "bg-(--primary) text-(--surface) ml-8"}`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-(--subtle) rounded-2xl p-body">
                  <p className="whitespace-pre-wrap">
                    {selectedThread?.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        <button
          onClick={() => setIsComposing(true)}
          className="fixed bottom-8 right-6 w-14 h-14 bg-(--text-main) text-(--surface) rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-90"
        >
          <Plus size={24} />
        </button>
      </div>
    );
  }

  // --- DESKTOP UI ---
  return (
    <div className="dashboard-engine h-[calc(100vh-120px)] flex bg-(--surface) border border-(--border-color) rounded-3xl overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-(--border-color) bg-(--subtle) p-6 flex flex-col gap-8">
        <button
          onClick={() => setIsComposing(true)}
          className="btn-brand w-full flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Compose
        </button>
        <div className="px-1">
          <Select
            label="Account View"
            value={activeAlias}
            onChange={setActiveAlias}
            options={[
              { label: "All Inboxes", value: "all" },
              ...mailboxes.map((box: any) => ({
                label: box.email,
                value: box.email,
              })),
            ]}
          />
        </div>
        <div className="space-y-1 pt-4 border-t border-(--border-color)">
          {[
            { id: "inbox", icon: Inbox, label: "Inbox" },
            { id: "sent", icon: Send, label: "Sent" },
            { id: "starred", icon: Star, label: "Starred" },
            { id: "archive", icon: Archive, label: "Archive" },
            { id: "spam", icon: ShieldAlert, label: "Spam" },
            { id: "trash", icon: Trash2, label: "Trash" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFolder(f.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${activeFolder === f.id ? "bg-(--text-main) text-(--surface)" : "text-(--text-muted) hover:bg-(--surface)"}`}
            >
              <f.icon size={14} />
              <p className="p-engine-sm font-bold">{f.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Message List */}
      <div className="w-96 border-r border-(--border-color) flex flex-col bg-(--surface)">
        <div className="p-6 border-b border-(--border-color) flex justify-between items-center">
          <p className="p-engine-xl capitalize">{activeFolder}</p>
          <Search size={16} className="text-(--text-muted)" />
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-(--border-color)">
          {threads.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedThread(t)}
              className={`p-6 cursor-pointer group relative transition-all ${selectedThread?.id === t.id ? "bg-(--subtle) border-l-4 border-(--brand)" : "hover:bg-(--subtle)"}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <Star
                    size={14}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(t.id, t.starred);
                    }}
                    className={
                      t.starred
                        ? "fill-amber-400 text-amber-400"
                        : "text-(--text-subtle) hover:text-amber-400"
                    }
                  />
                  <p className="text-[11px] font-bold text-(--text-main)">
                    {t.clientName}
                  </p>
                  {t.unread && (
                    <div className="w-1.5 h-1.5 rounded-full bg-(--brand)" />
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === t.id ? null : t.id);
                    }}
                    className="p-1 hover:bg-(--border-color) rounded-md text-(--text-subtle)"
                  >
                    <MoreVertical size={14} />
                  </button>
                  <AnimatePresence>
                    {menuOpen === t.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-(--surface) border border-(--border-color) rounded-xl shadow-2xl z-50 overflow-hidden"
                      >
                        {activeFolder === "trash" ? (
                          <>
                            <MenuAction
                              icon={Inbox}
                              label="Restore to Inbox"
                              onClick={() => handleAction(t.id, "restore")}
                            />
                            <div className="h-px bg-(--border-color) my-1" />
                            <MenuAction
                              icon={Trash2}
                              label="Delete Permanently"
                              onClick={() => handleAction(t.id, "delete")}
                              className="text-red-500"
                            />
                          </>
                        ) : activeFolder === "spam" ? (
                          <>
                            <MenuAction
                              icon={ShieldCheck}
                              label="Not Spam"
                              onClick={() => handleAction(t.id, "restore")}
                            />
                            <div className="h-px bg-(--border-color) my-1" />
                            <MenuAction
                              icon={Trash2}
                              label="Move to Trash"
                              onClick={() => handleAction(t.id, "trash")}
                            />
                          </>
                        ) : (
                          <>
                            <MenuAction
                              icon={Reply}
                              label="Reply"
                              onClick={() => {
                                setIsComposing(true);
                                setNewEmail((prev) => ({
                                  ...prev,
                                  to: t.clientEmail,
                                }));
                              }}
                            />
                            <MenuAction
                              icon={Mail}
                              label={t.unread ? "Mark Read" : "Mark Unread"}
                              onClick={() => handleAction(t.id, "toggleRead")}
                            />
                            <div className="h-px bg-(--border-color) my-1" />
                            <MenuAction
                              icon={ShieldAlert}
                              label="Spam"
                              onClick={() => handleAction(t.id, "spam")}
                            />
                            <MenuAction
                              icon={Trash2}
                              label="Move to Trash"
                              onClick={() => handleAction(t.id, "trash")}
                              className="text-red-500"
                            />
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <p className="p-engine-sm uppercase font-black tracking-widest text-(--text-muted) mb-1 truncate">
                {t.title}
              </p>
              <p className="p-engine-body text-(--text-subtle) line-clamp-1 italic">
                "{t.lastMessage || t.description}"
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-(--primary)">
        {selectedThread ? (
          <div className="flex-1 overflow-y-auto p-12">
            <div className="max-w-3xl mx-auto bg-(--surface) p-10 border border-(--border-color) rounded-sm shadow-sm">
              <h2 className="p-engine-xl border-b border-(--border-color) pb-4 mb-6">
                {selectedThread.title}
              </h2>
              <div className="space-y-4">
                {messages.length > 0 ? (
                  messages.map((m, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl p-engine-body ${m.type === "inbound" ? "bg-(--subtle) mr-12" : "bg-(--brand) text-(--surface) ml-12"}`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="p-engine-body italic opacity-50">
                    {selectedThread.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-engine-body italic opacity-20">
            Select an inquiry to read.
          </div>
        )}
      </div>
    </div>
  );
}
