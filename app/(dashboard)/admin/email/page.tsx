"use client";

import { useState, useEffect } from "react";
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
import Select from "@/app/components/Select";
import { cloudinary } from "@/app/lib/cloudinary";

// --- HELPERS ---
const MenuAction = ({ icon: Icon, label, onClick, className = "" }: any) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-(--subtle) transition-colors ${className}`}
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
    attachments: [] as any[],
  });

  useEffect(() => {
    const fetchMailboxes = async () => {
      const res = await fetch("/api/email/mailbox");
      const data = await res.json();
      if (Array.isArray(data)) setMailboxes(data);
    };
    fetchMailboxes();
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 1. Thread Fetcher
  useEffect(() => {
    const fetchThreads = async () => {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        let filtered = data;
        if (activeFolder !== "starred") {
          filtered = data.filter((t: any) => t.status === activeFolder);
        } else {
          filtered = data.filter((t: any) => t.starred);
        }

        if (activeAlias !== "all") {
          filtered = filtered.filter(
            (t: any) =>
              t.fromEmail === activeAlias ||
              t.clientEmail === activeAlias ||
              (!t.fromEmail && activeAlias === "info@nurmohammad.pro"),
          );
        }
        setThreads(filtered);
      }
    };
    fetchThreads();
    // Refresh every 30 seconds for "pseudo" real-time
    const interval = setInterval(fetchThreads, 30000);
    return () => clearInterval(interval);
  }, [activeAlias, activeFolder]);

  useEffect(() => {
    if (selectedThread) {
      setMessages(selectedThread.messages || []);
    }
  }, [selectedThread]);

  const toggleStar = async (id: string, state: boolean) => {
    await handleAction(id, "toggleStar");
  };

  const handleAction = async (threadId: string, action: string) => {
    const res = await fetch("/api/email/action", {
      method: "PATCH",
      body: JSON.stringify({ threadId, action }),
    });
    if (res.ok) {
      // Refresh current threads to see updates
      const fetchThreads = async () => {
        const resThreads = await fetch("/api/admin/projects");
        const data = await resThreads.json();
        if (Array.isArray(data)) {
          let filtered = data;
          if (activeFolder !== "starred") {
            filtered = data.filter((t: any) => t.status === activeFolder);
          } else {
            filtered = data.filter((t: any) => t.starred);
          }
          if (activeAlias !== "all") {
            filtered = filtered.filter(
              (t: any) =>
                t.fromEmail === activeAlias || t.clientEmail === activeAlias,
            );
          }
          setThreads(filtered);
          // Update selected thread if it was the one modified
          if (selectedThread && selectedThread.id === threadId) {
            const updated = data.find(
              (t: any) => t._id === threadId || t.id === threadId,
            );
            if (updated) setSelectedThread(updated);
          }
        }
      };
      await fetchThreads();
    }
    setMenuOpen(null);
    if (["delete", "archive", "trash", "restore", "spam"].includes(action)) {
      if (isMobile) setMobileScreen("list");
      setSelectedThread(null);
    }
  };

  const handleCompose = async () => {
    const res = await fetch("/api/email/compose", {
      method: "POST",
      body: JSON.stringify({ ...newEmail }),
    });
    if (res.ok) {
      setIsComposing(false);
      setNewEmail({
        to: "",
        subject: "",
        body: "",
        fromEmail: "",
        attachments: [],
      });
    }
  };

  // In your EmailPage component, add this function
  const handleFileUpload = async (file: File) => {
    // Use selectedThread.id if replying to an existing thread
    // Or generate a temporary ID for new compositions
    const folderId = selectedThread?.id || `temp-${Date.now()}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", `attachments/${folderId}`);

    try {
      const response = await fetch("/api/upload-cloudinary", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        // Add to newEmail attachments
        setNewEmail((prev) => ({
          ...prev,
          attachments: [
            ...prev.attachments,
            {
              name: file.name,
              size: file.size,
              url: result.url,
              publicId: result.publicId,
              type: file.type,
            },
          ],
        }));
        return result.url;
      }
      throw new Error("Upload failed");
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleDownloadAttachment = async (attachment: any) => {
    try {
      // For Cloudinary, we can create a download link with transformations
      const downloadUrl = attachment.url;

      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = attachment.name;
      link.target = "_blank"; // Open in new tab for better UX
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading attachment:", error);
      // You could show an error message to the user here
    }
  };

  const removeAttachment = (index: number) => {
    setNewEmail((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };
  // Unified Compose Overlay for both Mobile and Desktop
  const renderComposeOverlay = () => (
    <>
      {isComposing && (
        <div
          className="fixed inset-0 z-50 bg-(--text-main)/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsComposing(false)}
        >
          <div
            className="bg-(--surface) w-full max-w-2xl rounded-xl border border-(--border-color) shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-(--border-color) flex justify-between bg-(--subtle)">
              <p className="text-sm font-semibold text-(--text-main)">
                New Email
              </p>
              <X
                size={20}
                className="cursor-pointer text-(--text-main)"
                onClick={() => setIsComposing(false)}
              />
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <Select
                label="From Address"
                value={newEmail.fromEmail}
                onChange={(val: string) =>
                  setNewEmail({ ...newEmail, fromEmail: val })
                }
                options={mailboxes.map((box: any) => ({
                  label: box.email,
                  value: box.email,
                }))}
              />
              <input
                value={newEmail.to}
                onChange={(e) =>
                  setNewEmail({ ...newEmail, to: e.target.value })
                }
                placeholder="To: Client Email"
                className="w-full border-b border-(--border-color) py-2 outline-none text-sm text-(--text-main) bg-transparent"
              />
              <input
                value={newEmail.subject}
                onChange={(e) =>
                  setNewEmail({ ...newEmail, subject: e.target.value })
                }
                placeholder="Subject"
                className="w-full border-b border-(--border-color) py-2 outline-none text-sm font-semibold text-(--text-main) bg-transparent"
              />
              <textarea
                value={newEmail.body}
                onChange={(e) =>
                  setNewEmail({ ...newEmail, body: e.target.value })
                }
                placeholder="Your message..."
                className="w-full h-48 bg-transparent outline-none text-sm resize-none text-(--text-main)"
              />
            </div>
            <div className="p-4 bg-(--subtle) flex justify-between items-center gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {newEmail.attachments.map((file, idx) => (
                    <div
                      key={file.publicId || file.url || idx}
                      className="flex items-center gap-2 px-3 py-1.5 bg-(--subtle) border border-(--border-color) rounded-lg"
                    >
                      <Paperclip size={12} className="text-(--brand)" />
                      <span className="text-xs font-medium text-(--text-main)">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeAttachment(idx)}
                        className="hover:bg-red-500/10 p-1 rounded"
                      >
                        <X size={12} className="text-red-500" />
                      </button>
                    </div>
                  ))}

                  <label className="cursor-pointer flex items-center gap-2 px-4 py-1.5 bg-(--text-main) text-(--surface) rounded-lg text-xs font-medium transition-all">
                    <Plus size={14} /> Add File
                    <input
                      type="file"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            await handleFileUpload(file);
                          } catch (error) {
                            console.error("Failed to upload file:", error);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsComposing(false)}
                  className="text-sm opacity-60 text-(--text-main)"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompose}
                  className="px-4 py-2 bg-(--brand) text-white text-sm font-medium rounded-lg"
                >
                  Send Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <div className="h-screen bg-(--primary) text-(--text-main) flex flex-col overflow-hidden">
        {mobileScreen === "list" ? (
          <>
            <header className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold capitalize">
                  {activeFolder}
                </h1>
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
                  className="bg-(--subtle) text-(--text-main) border border-(--border-color) px-3 py-1.5 rounded-lg text-xs font-medium"
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
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeFolder === f ? "bg-(--text-main) text-(--surface)" : "bg-(--subtle) text-(--text-muted)"}`}
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
                  key={t._id || t.id}
                  onClick={() => {
                    setSelectedThread(t);
                    setMobileScreen("detail");
                  }}
                  className="p-4 active:bg-(--subtle) relative"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <Star
                        size={14}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(t._id || t.id, t.starred);
                        }}
                        className={
                          t.starred
                            ? "fill-amber-400 text-amber-400"
                            : "text-(--text-subtle)"
                        }
                      />
                      <p className="text-sm font-semibold">{t.clientName}</p>
                      {t.unread && (
                        <div className="w-1.5 h-1.5 rounded-full bg-(--brand)" />
                      )}
                    </div>
                    <span className="text-xs text-(--text-subtle)">
                      {new Date(t.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate">{t.title}</p>
                  <p className="text-xs text-(--text-subtle) line-clamp-1 italic">
                    "{t.lastMessage || t.description}"
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col bg-(--surface) animate-fade-in">
            <header className="p-4 border-b border-(--border-color) flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <button onClick={() => setMobileScreen("list")}>
                  <ArrowLeft size={20} />
                </button>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold truncate">
                    {selectedThread?.title}
                  </h2>
                  <p className="text-xs text-(--text-subtle)">
                    {selectedThread?.clientName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 text-(--text-muted)">
                <Star
                  size={18}
                  onClick={() =>
                    toggleStar(
                      selectedThread._id || selectedThread.id,
                      selectedThread.starred,
                    )
                  }
                  className={
                    selectedThread?.starred
                      ? "fill-amber-400 text-amber-400"
                      : ""
                  }
                />
                <Mail
                  size={18}
                  onClick={() =>
                    handleAction(
                      selectedThread._id || selectedThread.id,
                      "toggleRead",
                    )
                  }
                />
                {activeFolder === "trash" ? (
                  <Inbox
                    size={18}
                    onClick={() =>
                      handleAction(
                        selectedThread._id || selectedThread.id,
                        "restore",
                      )
                    }
                  />
                ) : (
                  <Trash2
                    size={18}
                    onClick={() =>
                      handleAction(
                        selectedThread._id || selectedThread.id,
                        "trash",
                      )
                    }
                  />
                )}
                <ShieldAlert
                  size={18}
                  onClick={() =>
                    handleAction(
                      selectedThread._id || selectedThread.id,
                      activeFolder === "spam" ? "restore" : "spam",
                    )
                  }
                  className={activeFolder === "spam" ? "text-green-500" : ""}
                />
              </div>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((m, i) => (
                  <div
                    key={m.createdAt?.toString() || i}
                    className={`p-4 rounded-xl text-sm ${m.type === "inbound" ? "bg-(--subtle) mr-8" : "bg-(--primary) text-(--surface) ml-8"}`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-(--subtle) rounded-xl text-sm">
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
          className="fixed bottom-8 right-6 w-14 h-14 bg-(--text-main) text-(--surface) rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-90 z-50"
        >
          <Plus size={24} />
        </button>
        {renderComposeOverlay()}
      </div>
    );
  }

  // --- DESKTOP UI ---
  return (
    <div className="h-[calc(100vh-120px)] flex bg-(--surface) border border-(--border-color) rounded-lg overflow-hidden relative">
      <div className="w-48 border-r border-(--border-color) bg-(--subtle) p-2 flex flex-col gap-6">
        <button
          onClick={() => setIsComposing(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-(--brand) text-white rounded-lg font-medium hover:bg-(--brand-hover) transition-colors"
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
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeFolder === f.id ? "bg-(--text-main) text-(--surface)" : "text-(--text-muted) hover:bg-(--surface)"}`}
            >
              <f.icon size={14} />
              <p className="text-sm font-medium">{f.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="w-64 border-r border-(--border-color) flex flex-col bg-(--surface)">
        <div className="p-4 border-b border-(--border-color) flex justify-between items-center">
          <p className="text-xl font-semibold capitalize">{activeFolder}</p>
          <Search size={16} className="text-(--text-muted)" />
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-(--border-color)">
          {threads.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedThread(t)}
              className={`p-4 cursor-pointer group relative transition-all ${selectedThread?._id === t._id ? "bg-(--subtle) border-l-4 border-(--brand)" : "hover:bg-(--subtle)"}`}
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
                  <p className="text-xs font-semibold text-(--text-main)">
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
                      setMenuOpen(
                        menuOpen === (t._id || t.id) ? null : t._id || t.id,
                      );
                    }}
                    className="p-1 hover:bg-(--border-color) rounded-md text-(--text-subtle)"
                  >
                    <MoreVertical size={14} />
                  </button>
                  {menuOpen === (t._id || t.id) && (
                    <div className="absolute right-0 mt-2 w-48 bg-(--surface) border border-(--border-color) rounded-lg shadow-lg z-50 overflow-hidden">
                      {activeFolder === "trash" ? (
                        <>
                          <MenuAction
                            icon={Inbox}
                            label="Restore to Inbox"
                            onClick={() =>
                              handleAction(t._id || t.id, "restore")
                            }
                          />
                          <div className="h-px bg-(--border-color) my-1" />
                          <MenuAction
                            icon={Trash2}
                            label="Delete Permanently"
                            onClick={() =>
                              handleAction(t._id || t.id, "delete")
                            }
                            className="text-red-500"
                          />
                        </>
                      ) : activeFolder === "spam" ? (
                        <>
                          <MenuAction
                            icon={ShieldCheck}
                            label="Not Spam"
                            onClick={() =>
                              handleAction(t._id || t.id, "restore")
                            }
                          />
                          <div className="h-px bg-(--border-color) my-1" />
                          <MenuAction
                            icon={Trash2}
                            label="Move to Trash"
                            onClick={() => handleAction(t._id || t.id, "trash")}
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
                            onClick={() =>
                              handleAction(t._id || t.id, "toggleRead")
                            }
                          />
                          <div className="h-px bg-(--border-color) my-1" />
                          <MenuAction
                            icon={ShieldAlert}
                            label="Spam"
                            onClick={() => handleAction(t._id || t.id, "spam")}
                          />
                          <MenuAction
                            icon={Trash2}
                            label="Move to Trash"
                            onClick={() => handleAction(t._id || t.id, "trash")}
                            className="text-red-500"
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs font-medium text-(--text-muted) mb-1 truncate uppercase">
                {t.title}
              </p>
              <p className="text-xs text-(--text-subtle) line-clamp-1 italic">
                "{t.lastMessage || t.description}"
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-(--primary)">
        {selectedThread ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-3xl mx-auto bg-(--surface) p-4 border border-(--border-color) rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold border-b border-(--border-color) pb-4 mb-6">
                {selectedThread.title}
              </h2>
              <div className="flex flex-col gap-2">
                {messages.length > 0 ? (
                  messages.map((m, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-lg text-sm ${m.type === "inbound" ? "bg-(--subtle) mr-12" : "bg-(--primary) text-(--main) ml-12"}`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      {m.attachments?.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-(--border-color)/20 flex flex-wrap gap-2">
                          {m.attachments.map((file: any, idx: number) => (
                            <div
                              key={file.id || idx}
                              className="flex items-center gap-2 px-3 py-1.5 bg-(--surface) border border-(--border-color) rounded-lg shadow-sm group cursor-pointer hover:bg-(--subtle)"
                              onClick={() => handleDownloadAttachment(file)}
                            >
                              <Paperclip
                                size={12}
                                className="text-(--text-muted) group-hover:text-(--brand) transition-colors"
                              />
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-medium text-(--text-main) truncate">
                                  {file.name || "Attachment"}
                                </span>
                                <span className="text-xs uppercase opacity-40">
                                  {file.size
                                    ? (file.size / 1024).toFixed(1) + " KB"
                                    : "File"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {m.type === "outbound" && (
                        <div className="flex items-center gap-1 mt-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${m.deliveryStatus === "delivered" ? "bg-green-500" : m.deliveryStatus === "bounced" ? "bg-red-500" : "bg-slate-300"}`}
                          />
                          <p className="text-xs uppercase opacity-50">
                            {m.deliveryStatus || "Pending"}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm italic opacity-50">
                      {selectedThread.description}
                    </p>
                    {selectedThread.attachments?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedThread.attachments.map(
                          (file: any, idx: number) => (
                            <div
                              key={file.id || file.publicId || file.name || idx}
                              className="flex items-center gap-2 px-3 py-1.5 bg-(--subtle) border border-(--border-color) rounded-lg"
                            >
                              <Paperclip size={12} className="text-(--brand)" />
                              <span className="text-xs font-medium">
                                {file.name}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm italic opacity-20">
            Select an inquiry to read.
          </div>
        )}
      </div>
      {renderComposeOverlay()}
    </div>
  );
}
