"use client";

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
  sender: { username: string; displayName: string };
  receiver: { username: string; displayName: string };
};

export function MessagesInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newBody, setNewBody] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => {
        setConversations(data.conversations || []);
        setUnreadCount(data.unreadCount || 0);
        setLoading(false);
      });
  }, []);

  const openChat = async (username: string) => {
    setActiveChat(username);
    const res = await fetch(`/api/messages?with=${username}`);
    const data = await res.json();
    setMessages(data.messages || []);
    // Refresh unread count
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => setUnreadCount(data.unreadCount || 0));
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
      <div className="panel p-6 md:p-8">
        <h2 className="text-lg font-semibold text-text">我的私信</h2>
        <p className="mt-4 text-sm text-text/50">加载中...</p>
      </div>
    );
  }

  return (
    <section className="panel p-6 md:p-8">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text">
          我的私信
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">
              {unreadCount} 未读
            </span>
          )}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-[240px_minmax(0,1fr)]">
        {/* Conversation list */}
        <div className="space-y-0.5 rounded-md border border-border bg-surface-strong/40 p-2">
          {conversations.length === 0 ? (
            <p className="p-2 text-sm text-text/50">暂无对话</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.username}
                type="button"
                onClick={() => openChat(conv.username)}
                className={`flex w-full items-center gap-2 rounded p-2 text-left text-sm transition ${
                  activeChat === conv.username
                    ? "bg-white text-text shadow-sm"
                    : "text-text/70 hover:bg-white/60"
                }`}
              >
                <img
                  src={getAvatarUrl(conv.avatarUrl, conv.avatarPreset)}
                  alt={conv.displayName}
                  className="h-7 w-7 rounded-full border border-border object-cover"
                />
                <span className="truncate font-medium">{conv.displayName}</span>
              </button>
            ))
          )}
        </div>

        {/* Chat area */}
        <div className="flex flex-col rounded-md border border-border bg-white min-h-[280px]">
          {activeChat ? (
            <>
              <div className="flex-1 space-y-2 overflow-y-auto p-4" style={{ maxHeight: "350px" }}>
                {messages.length === 0 ? (
                  <p className="py-12 text-center text-sm text-text/50">暂无消息，发送第一条私信吧</p>
                ) : (
                  messages.map((msg) => {
                    const isSent = msg.sender.username !== activeChat;
                    return (
                      <div key={msg.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                            isSent
                              ? "bg-accent text-white"
                              : "bg-surface-strong text-text/80"
                          }`}
                        >
                          <p>{msg.body}</p>
                          <p className="mt-0.5 text-xs opacity-50">
                            {new Date(msg.createdAt).toLocaleString("zh-CN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="border-t border-border p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="field flex-1 text-sm"
                    placeholder="输入消息..."
                  />
                  <button type="button" onClick={sendMessage} className="btn-primary px-3 py-1.5 text-xs">
                    发送
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-1 items-center justify-center text-sm text-text/50">
              选择左侧对话开始查看私信
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
