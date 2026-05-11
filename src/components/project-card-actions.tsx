import { toggleBookmarkAction, toggleLikeAction } from "@/app/projects/[slug]/actions";

type ProjectCardActionsProps = {
  slug: string;
  likes: number;
  comments: number;
  bookmarks: number;
};

export function ProjectCardActions({ slug, likes, comments, bookmarks }: ProjectCardActionsProps) {
  return (
    <div className="flex items-center justify-between border-t border-border/70 pt-4 text-xs text-text/52">
      <form action={toggleLikeAction.bind(null, slug)}>
        <button type="submit" aria-label="Like" className="project-action">
          <ThumbIcon />
          <span>{likes}</span>
        </button>
      </form>

      <span className="project-action" aria-label={`${comments} comments`}>
        <CommentIcon />
        <span>{comments}</span>
      </span>

      <form action={toggleBookmarkAction.bind(null, slug)}>
        <button type="submit" aria-label="Bookmark" className="project-action">
          <StarIcon />
          <span>{bookmarks}</span>
        </button>
      </form>
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

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="m12 3.4 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9L12 3.4Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
