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
  Zap,
  Search,
  Inbox,
  ShieldCheck,
  Menu,
  PenLine,
  Star,
  X,
  Paperclip,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- SUB-COMPONENT: SIGNATURE EDITOR ---
function SignatureEditor({ mailboxId }: { mailboxId: string }) {
  const [signature, setSignature] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSig = async () => {
      const snap: DocumentSnapshot = await getDoc(
        doc(db, "mailboxes", mailboxId, "signatures", "default"),
      );
      if (snap.exists()) setSignature(snap.data()?.html || "");
    };
    loadSig();
  }, [mailboxId]);

  const saveSignature = async () => {
    setIsSaving(true);
    await fetch("/api/email/signature", {
      method: "POST",
      body: JSON.stringify({ mailboxId, html: signature }),
    });
    setIsSaving(false);
  };

  return (
    <div className="space-y-4 pt-6 border-t border-(--border-color)">
      <p className="p-engine-sm uppercase tracking-widest">Edit Signature</p>
      <textarea
        className="w-full h-24 p-3 bg-(--subtle) border border-(--border-color) rounded-xl text-[11px] font-mono outline-none text-(--text-main)"
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
        placeholder="HTML Signature..."
      />
      <button
        onClick={saveSignature}
        disabled={isSaving}
        className="btn-brand w-full text-[10px] py-2"
      >
        {isSaving ? "Saving..." : "Update Signature"}
      </button>
    </div>
  );
}

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
  const [newEmail, setNewEmail] = useState({
    to: "",
    subject: "",
    body: "",
    fromEmail: "",
  });
  const [attachments, setAttachments] = useState<
    { name: string; url: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/email/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok)
      setAttachments([...attachments, { name: data.name, url: data.url }]);
    setUploading(false);
  };

  const handleCompose = async () => {
    const res = await fetch("/api/email/compose", {
      method: "POST",
      body: JSON.stringify({ ...newEmail, attachments, status: "sent" }),
    });
    if (res.ok) {
      setIsComposing(false);
      setNewEmail({ to: "", subject: "", body: "", fromEmail: "" });
      setAttachments([]);
    }
  };

  // --- MOBILE UI ---
  if (isMobile) {
    return (
      <div className="h-screen bg-(--primary) text-(--text-main) flex flex-col overflow-hidden">
        {mobileScreen === "list" ? (
          <>
            <header className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="p-heading-xl capitalize">{activeFolder}</h1>
                <button
                  onClick={() => {
                    // 1. Find current index
                    const currentIndex = mailboxes.findIndex(
                      (m) => m.email === activeAlias,
                    );

                    // 2. Logic to cycle: All -> Mailbox 1 -> Mailbox 2 -> All...
                    if (activeAlias === "all") {
                      setActiveAlias(mailboxes[0]?.email);
                    } else if (currentIndex === mailboxes.length - 1) {
                      setActiveAlias("all");
                    } else {
                      setActiveAlias(mailboxes[currentIndex + 1]?.email);
                    }
                  }}
                  className="bg-(--subtle) text-(--text-main) border border-(--border-color) px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  {activeAlias === "all"
                    ? "All Accounts"
                    : activeAlias.split("@")[0]}
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {["inbox", "sent", "starred", "archive"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFolder(f)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${activeFolder === f ? "bg-(--text-main) text-(--surface)" : "bg-(--subtle) text-(--text-muted)"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </header>
            <div className="flex-1 overflow-y-auto divide-y divide-(--border-color)">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => {
                    setSelectedThread(thread);
                    setMobileScreen("detail");
                  }}
                  className="p-5 active:bg-(--subtle)"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[15px] font-bold">{thread.clientName}</p>
                    <span className="p-engine-sm">
                      {new Date(thread.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-[14px] font-semibold truncate">
                    {thread.title}
                  </p>
                  <p className="p-body line-clamp-2">
                    {thread.lastMessage || thread.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col bg-(--surface) animate-fade-in">
            <header className="p-4 border-b border-(--border-color) flex items-center gap-4">
              <button onClick={() => setMobileScreen("list")}>
                <ArrowLeft size={20} />
              </button>
              <div className="flex-1 min-w-0">
                <h2 className="p-body font-bold truncate">
                  {selectedThread?.title}
                </h2>
                <p className="p-engine-sm uppercase font-black">
                  {selectedThread?.clientName}
                </p>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl p-body ${m.type === "inbound" ? "bg-(--subtle) mr-8" : "bg-(--primary) text-(--surface) ml-8"}`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => setIsComposing(true)}
          className="fixed bottom-8 right-6 w-14 h-14 bg-(--text-main) text-(--surface) rounded-full shadow-2xl flex items-center justify-center"
        >
          <Plus size={24} />
        </button>
      </div>
    );
  }

  // --- DESKTOP UI (DASHBOARD ENGINE) ---
  return (
    <div className="dashboard-engine h-[calc(100vh-120px)] flex bg-(--surface) border border-(--border-color) rounded-3xl overflow-hidden">
      {/* Column 1 */}
      <div className="w-64 border-r border-(--border-color) bg-(--subtle) p-6 flex flex-col gap-8">
        <button
          onClick={() => setIsComposing(true)}
          className="btn-brand w-full flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Compose
        </button>
        <div className="space-y-4">
          {/* Using your p-engine-sm utility for consistent typography */}
          <p className="p-engine-sm font-black uppercase tracking-widest text-(--text-muted)">
            Account View
          </p>

          <div className="relative group">
            <select
              value={activeAlias}
              onChange={(e) => setActiveAlias(e.target.value)}
              className="w-full appearance-none bg-(--subtle) border border-(--border-color) rounded-xl px-4 py-2.5 text-[11px] font-bold text-(--text-main) outline-none focus:ring-1 focus:ring-(--text-main)/20 transition-all cursor-pointer"
            >
              <option value="all" className="bg-(--surface) text-(--text-main)">
                All Inboxes
              </option>
              {mailboxes.map((box) => (
                <option
                  key={box.id}
                  value={box.email}
                  className="bg-(--surface) text-(--text-main)"
                >
                  {box.email}
                </option>
              ))}
            </select>

            {/* Minimalist arrow using your text-muted token */}
            <ChevronDown
              size={12}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
        <div className="space-y-1 pt-4 border-t border-(--border-color)">
          {[
            { id: "inbox", icon: Inbox, label: "Inbox" },
            { id: "sent", icon: Send, label: "Sent" },
            { id: "starred", icon: Star, label: "Starred" },
            { id: "archive", icon: Archive, label: "Archive" },
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

      {/* Column 2 */}
      <div className="w-96 border-r border-(--border-color) flex flex-col bg-(--surface)">
        <div className="p-6 border-b border-(--border-color) flex justify-between items-center">
          <p className="p-engine-xl capitalize">{activeFolder}</p>
          <Search size={16} className="text-(--text-muted)" />
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-(--border-color)">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`p-6 cursor-pointer relative transition-all ${selectedThread?.id === thread.id ? "bg-(--surface) border-l-4 border-(--brand)" : "hover:bg-(--primary)"}`}
            >
              <div className="flex justify-between items-center mb-1">
                <p className="p-engine-sm font-bold text-(--text-main)">
                  {thread.clientName}
                </p>
                <p className="p-engine-sm">
                  {new Date(thread.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p className="p-engine-sm uppercase font-black tracking-widest truncate">
                {thread.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Column 3 */}
      <div className="flex-1 flex flex-col bg-(--primary)">
        {selectedThread ? (
          <div className="flex-1 overflow-y-auto p-12">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-(--surface) p-10 border border-(--border-color) rounded-sm shadow-sm">
                <p className="text-lg font-semibold border-b border-(--border-color) pb-4 mb-6">
                  {selectedThread.title}
                </p>
                <div className="space-y-4">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-xl p-engine-body ${m.type === "inbound" ? "bg-(--subtle) mr-12" : "bg-(--primary) text-(--main) ml-12"}`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <p className="p-engine-body italic opacity-50">
                      {selectedThread.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-engine-body italic opacity-20">
            Select an inquiry to read.
          </div>
        )}
      </div>

      {/* Compose Modal */}
      <AnimatePresence>
        {isComposing && (
          <div
            className="fixed inset-0 z-100 bg-(--text-main)/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsComposing(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-(--surface) w-full max-w-2xl rounded-3xl border border-(--border-color) shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-(--border-color) flex justify-between bg-(--subtle)">
                <p className="p-engine-sm font-black uppercase">
                  New Transmission
                </p>
                <X
                  size={20}
                  className="cursor-pointer"
                  onClick={() => setIsComposing(false)}
                />
              </div>
              <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                <div className="space-y-2">
                  <p className="p-engine-sm uppercase">From</p>
                  <select
                    value={newEmail.fromEmail}
                    onChange={(e) =>
                      setNewEmail({ ...newEmail, fromEmail: e.target.value })
                    }
                    className="w-full bg-(--subtle) border border-(--border-color) rounded-xl px-4 py-2 p-engine-sm outline-none"
                  >
                    {mailboxes.map((box) => (
                      <option key={box.id} value={box.email}>
                        {box.email}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  value={newEmail.to}
                  onChange={(e) =>
                    setNewEmail({ ...newEmail, to: e.target.value })
                  }
                  placeholder="To: Client Email"
                  className="w-full border-b border-(--border-color) py-2 outline-none p-body"
                />
                <input
                  value={newEmail.subject}
                  onChange={(e) =>
                    setNewEmail({ ...newEmail, subject: e.target.value })
                  }
                  placeholder="Subject"
                  className="w-full border-b border-(--border-color) py-2 outline-none p-body font-bold"
                />
                <textarea
                  value={newEmail.body}
                  onChange={(e) =>
                    setNewEmail({ ...newEmail, body: e.target.value })
                  }
                  placeholder="Your message..."
                  className="w-full h-48 bg-transparent outline-none p-engine-body resize-none"
                />
                <div className="flex flex-wrap gap-2">
                  {attachments.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-(--subtle) px-3 py-1 rounded-full p-engine-sm border border-(--border-color)"
                    >
                      {f.name}
                    </div>
                  ))}
                </div>
                {mailboxes
                  .filter((m) => m.email === newEmail.fromEmail)
                  .map((box) => (
                    <SignatureEditor key={box.id} mailboxId={box.id} />
                  ))}
              </div>
              <div className="p-6 bg-(--subtle) flex justify-between items-center">
                <label className="cursor-pointer p-2">
                  <Paperclip
                    size={18}
                    className={
                      uploading ? "text-(--text-subtle)" : "text-(--brand)"
                    }
                  />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsComposing(false)}
                    className="p-engine-sm uppercase opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompose}
                    disabled={uploading}
                    className="btn-brand p-engine-sm uppercase px-8"
                  >
                    Send Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
