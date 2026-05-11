"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toggleFollowFromCommentAction } from "@/app/projects/[slug]/actions";

export function FollowDMButtons({
  targetUsername,
  isFollowing: initialFollowing,
  isOwnPage
}: {
  targetUsername: string;
  isFollowing: boolean;
  isOwnPage: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [showDM, setShowDM] = useState(false);
  const [dmBody, setDmBody] = useState("");
  const [dmSent, setDmSent] = useState(false);
  const router = useRouter();

  if (isOwnPage) return null;

  const handleFollow = async () => {
    await toggleFollowFromCommentAction(targetUsername);
    setFollowing(!following);
  };

  const handleDM = async () => {
    if (!dmBody.trim()) return;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverUsername: targetUsername, body: dmBody })
    });
    if (res.ok) {
      setDmBody("");
      setDmSent(true);
      setTimeout(() => {
        setShowDM(false);
        setDmSent(false);
      }, 1500);
      router.refresh();
    }
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleFollow}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            following
              ? "bg-surface-strong text-text/70 border border-border hover:bg-surface-strong/80"
              : "bg-accent text-white hover:bg-accent/90"
          }`}
        >
          {following ? "已关注" : "关注"}
        </button>

        <button
          type="button"
          onClick={() => setShowDM(!showDM)}
          className="flex items-center gap-1.5 rounded-md border border-border bg-white px-4 py-2 text-sm font-medium text-text/70 transition hover:bg-surface-strong"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          私信
        </button>
      </div>

      {showDM && (
        <div className="space-y-2 rounded-md border border-border bg-surface-strong/40 p-3">
          {dmSent ? (
            <p className="text-sm text-green-600">私信已发送！</p>
          ) : (
            <>
              <textarea
                value={dmBody}
                onChange={(e) => setDmBody(e.target.value)}
                className="field-area min-h-20 text-sm"
                placeholder={`给 @${targetUsername} 发私信...`}
              />
              <div className="flex gap-2">
                <button type="button" onClick={handleDM} className="btn-primary px-3 py-1.5 text-xs">
                  发送
                </button>
                <button type="button" onClick={() => setShowDM(false)} className="btn-secondary px-3 py-1.5 text-xs">
                  取消
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
