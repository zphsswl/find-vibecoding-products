"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAvatarUrl } from "@/lib/avatar";

type Conversation = {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  avatarPreset: string | null;
};

type MessageItem = {
  id: string;
  body: string;
  createdAt: string;
  sender: { username: string; displayName: string; avatarUrl: string | null; avatarPreset: string | null };
  receiver: { username: string; displayName: string; avatarUrl: string | null; avatarPreset: string | null };
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newBody, setNewBody] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => {
        if (r.status === 401) router.push("/auth/sign-in");
        return r.json();
      })
      .then((data) => {
        setConversations(data.conversations || []);
        setUnreadCount(data.unreadCount || 0);
        setLoading(false);
      });
  }, [router]);

  const openChat = async (username: string) => {
    setActiveChat(username);
    const res = await fetch(`/api/messages?with=${username}`);
    const data = await res.json();
    setMessages(data.messages || []);
  };

  const sendMessage = async () => {
    if (!newBody.trim() || !activeChat) return;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverUsername: activeChat, body: newBody })
    });
    if (res.ok) {
      setNewBody("");
      openChat(activeChat);
    }
  };

  if (loading) {
    return (
      <main className="page-band">
        <div className="page-shell py-12">
          <p className="text-sm text-text/50">加载中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-band">
      <div className="page-shell">
        <section className="max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="page-kicker">Messages</span>
              <h1 className="mt-1 text-3xl font-semibold text-text">私信</h1>
            </div>
            {unreadCount > 0 && (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                {unreadCount} 条未读
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
            {/* Conversation list */}
            <div className="space-y-1 rounded-lg border border-border bg-white p-3">
              {conversations.length === 0 ? (
                <p className="p-3 text-sm text-text/50">暂无对话</p>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.username}
                    type="button"
                    onClick={() => openChat(conv.username)}
                    className={`flex w-full items-center gap-3 rounded-md p-3 text-left transition ${
                      activeChat === conv.username
                        ? "bg-surface-strong text-text"
                        : "text-text/70 hover:bg-surface-strong/60"
                    }`}
                  >
                    <img
                      src={getAvatarUrl(conv.avatarUrl, conv.avatarPreset)}
                      alt={conv.displayName}
                      className="h-9 w-9 rounded-full border border-border object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{conv.displayName}</p>
                      <p className="truncate text-xs text-text/40">@{conv.username}</p>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Chat area */}
            <div className="flex flex-col rounded-lg border border-border bg-white">
              {activeChat ? (
                <>
                  <div className="flex-1 space-y-3 overflow-y-auto p-4" style={{ maxHeight: "60vh" }}>
                    {messages.length === 0 ? (
                      <p className="py-12 text-center text-sm text-text/50">开始对话吧</p>
                    ) : (
                      messages.map((msg) => {
                        const isSent = msg.sender.username !== activeChat;
                        return (
                          <div key={msg.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[75%] rounded-lg px-4 py-2.5 text-sm ${
                                isSent
                                  ? "bg-accent text-white"
                                  : "bg-surface-strong text-text/80"
                              }`}
                            >
                              <p>{msg.body}</p>
                              <p className="mt-1 text-xs opacity-50">
                                {new Date(msg.createdAt).toLocaleString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="border-t border-border p-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newBody}
                        onChange={(e) => setNewBody(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        className="field flex-1"
                        placeholder="输入消息..."
                      />
                      <button type="button" onClick={sendMessage} className="btn-primary px-4">
                        发送
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-64 items-center justify-center text-sm text-text/50">
                  选择对话或从评论区点击私信图标开始交流
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
