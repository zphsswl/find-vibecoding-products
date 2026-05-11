"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addCommentAction, toggleFollowFromCommentAction } from "@/app/projects/[slug]/actions";
import { getAvatarUrl } from "@/lib/avatar";

type CommentData = {
  id: string;
  body: string;
  author: string;
  authorDisplayName: string;
  authorAvatarUrl: string | null;
  authorAvatarPreset: string | null;
  createdAt: Date;
  parentId?: string | null;
  replies?: CommentData[];
};

function TimeAgo({ date }: { date: Date }) {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return <>刚刚</>;
  if (minutes < 60) return <>{minutes} 分钟前</>;
  if (hours < 24) return <>{hours} 小时前</>;
  if (days < 30) return <>{days} 天前</>;
  return <>{new Date(date).toLocaleDateString("zh-CN")}</>;
}

function CommentItem({
  comment,
  slug,
  isLoggedIn,
  currentUsername
}: {
  comment: CommentData;
  slug: string;
  isLoggedIn: boolean;
  currentUsername: string | null;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [showDM, setShowDM] = useState(false);
  const [dmBody, setDmBody] = useState("");
  const [dmSent, setDmSent] = useState(false);
  const router = useRouter();

  const handleReply = async () => {
    if (!replyBody.trim()) return;
    const formData = new FormData();
    formData.set("body", replyBody);
    formData.set("parentId", comment.id);
    await addCommentAction(slug, formData);
    setReplyBody("");
    setShowReply(false);
    router.refresh();
  };

  const handleFollow = async () => {
    await toggleFollowFromCommentAction(comment.author);
    setIsFollowing(!isFollowing);
  };

  const handleDM = async () => {
    if (!dmBody.trim()) return;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverUsername: comment.author, body: dmBody })
    });
    if (res.ok) {
      setDmBody("");
      setDmSent(true);
      setTimeout(() => {
        setShowDM(false);
        setDmSent(false);
      }, 1500);
    }
  };

  return (
    <div className="group">
      <div className="flex items-start gap-3">
        <Link href={`/users/${comment.author}`}>
          <img
            src={getAvatarUrl(comment.authorAvatarUrl, comment.authorAvatarPreset)}
            alt={comment.authorDisplayName}
            className="h-8 w-8 flex-shrink-0 rounded-full border border-border object-cover"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <Link
              href={`/users/${comment.author}`}
              className="font-semibold text-text transition hover:text-text/70 hover:underline"
            >
              {comment.authorDisplayName}
            </Link>
            <span className="text-text/40">@{comment.author}</span>
            <span className="text-text/40">
              <TimeAgo date={comment.createdAt} />
            </span>
            {isLoggedIn && currentUsername !== comment.author && (
              <span className="ml-auto flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                {/* Follow button */}
                <button
                  type="button"
                  onClick={handleFollow}
                  title={isFollowing ? "已关注" : "关注"}
                  className="rounded p-1 text-text/40 transition hover:bg-surface-strong hover:text-text/70"
                >
                  {isFollowing ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <polyline points="16 11 18 13 22 9" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="8" x2="19" y2="14" />
                      <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                  )}
                </button>
                {/* DM button */}
                <button
                  type="button"
                  onClick={() => setShowDM(!showDM)}
                  title="私信"
                  className="rounded p-1 text-text/40 transition hover:bg-surface-strong hover:text-text/70"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </span>
            )}
          </div>
          <p className="mt-1 text-sm leading-7 text-text/76">{comment.body}</p>
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => setShowReply(!showReply)}
              className="mt-1 text-xs text-text/40 transition hover:text-text/70"
            >
              {showReply ? "取消" : "回复"}
            </button>
          )}
        </div>
      </div>

      {/* Inline reply form */}
      {showReply && (
        <div className="ml-11 mt-2 space-y-2">
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            className="field-area min-h-20 text-sm"
            placeholder={`回复 @${comment.author}...`}
          />
          <button type="button" onClick={handleReply} className="btn-primary px-3 py-1.5 text-xs">
            回复
          </button>
        </div>
      )}

      {/* Inline DM form */}
      {showDM && (
        <div className="ml-11 mt-2 space-y-2">
          {dmSent ? (
            <p className="text-sm text-green-600">私信已发送！</p>
          ) : (
            <>
              <textarea
                value={dmBody}
                onChange={(e) => setDmBody(e.target.value)}
                className="field-area min-h-16 text-sm"
                placeholder={`给 @${comment.author} 发私信...`}
              />
              <button type="button" onClick={handleDM} className="btn-secondary px-3 py-1.5 text-xs">
                发送私信
              </button>
            </>
          )}
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 mt-3 space-y-3 border-l-2 border-border/60 pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="rounded-lg bg-surface-strong/50 p-3">
              <div className="flex items-center gap-2 text-xs">
                <Link
                  href={`/users/${reply.author}`}
                  className="font-semibold text-text transition hover:text-text/70 hover:underline"
                >
                  {reply.authorDisplayName}
                </Link>
                <span className="text-text/40">@{reply.author}</span>
                <span className="text-text/40">
                  <TimeAgo date={reply.createdAt} />
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-text/72">{reply.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentSection({
  comments,
  slug,
  isLoggedIn,
  currentUsername
}: {
  comments: CommentData[];
  slug: string;
  isLoggedIn: boolean;
  currentUsername: string | null;
}) {
  return (
    <div className="space-y-5">
      {comments.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-white/60 p-4 text-sm text-text/52">
          暂无评论，等第一条真实反馈。
        </p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            slug={slug}
            isLoggedIn={isLoggedIn}
            currentUsername={currentUsername}
          />
        ))
      )}
    </div>
  );
}
