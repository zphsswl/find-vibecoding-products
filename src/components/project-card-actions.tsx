"use client";

import { useState } from "react";

type ProjectCardActionsProps = {
  likes: number;
  comments: number;
  bookmarks: number;
};

export function ProjectCardActions({ likes, comments, bookmarks }: ProjectCardActionsProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-text/52">
      <button
        type="button"
        aria-pressed={liked}
        aria-label={liked ? "取消点赞" : "点赞"}
        onClick={() => setLiked((value) => !value)}
        className={`project-action ${liked ? "project-action-like-active" : ""}`}
      >
        <ThumbIcon />
        <span>{likes + (liked ? 1 : 0)}</span>
      </button>

      <span className="project-action" aria-label={`${comments} 条评论`}>
        <CommentIcon />
        <span>{comments}</span>
      </span>

      <button
        type="button"
        aria-pressed={bookmarked}
        aria-label={bookmarked ? "取消收藏" : "收藏"}
        onClick={() => setBookmarked((value) => !value)}
        className={`project-action ${bookmarked ? "project-action-bookmark-active" : ""}`}
      >
        <StarIcon filled={bookmarked} />
        <span>{bookmarks + (bookmarked ? 1 : 0)}</span>
      </button>
    </div>
  );
}

function ThumbIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M7.5 10.4v9.1H4.8a1.8 1.8 0 0 1-1.8-1.8v-5.5a1.8 1.8 0 0 1 1.8-1.8h2.7Zm2 8.9h7.3c.9 0 1.7-.6 1.9-1.5l1.7-6.1a2 2 0 0 0-1.9-2.6h-4.4l.6-3.2c.2-1.1-.6-2.1-1.7-2.1h-.4a1 1 0 0 0-.9.6L8.9 10v8.2c0 .6.1 1.1.6 1.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M5.2 5.4h13.6c1 0 1.8.8 1.8 1.8v7.7c0 1-.8 1.8-1.8 1.8h-7.1l-4.4 3.1v-3.1H5.2c-1 0-1.8-.8-1.8-1.8V7.2c0-1 .8-1.8 1.8-1.8Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="m12 3.4 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9L12 3.4Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
