# Community Pages Context

Task: polish the user-facing pages for the new community/account system.

Owned files:
- `src/app/me/page.tsx`
- `src/app/bookmarks/page.tsx`
- `src/app/users/[username]/page.tsx`
- `src/components/site-header.tsx` only if needed for a new top-level entry

Goals:
- Add a real "My" experience with folders, stats, and profile editing.
- Surface follower/following/likes/bookmarks counts clearly.
- Keep the current editorial visual language.

Rules:
- Do not touch Prisma schema unless the main agent requests it.
- Do not alter auth logic or project moderation flow.
- Do not overwrite other agents' edits.
