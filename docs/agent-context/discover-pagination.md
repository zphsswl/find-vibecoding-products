# Discover Pagination Context

Task: add sane pagination to the discover page.

Scope owned by this agent:
- `src/app/discover/page.tsx`
- `src/lib/projects.ts` only if query helpers need paging support
- any small shared UI helper if strictly necessary

Goals:
- Set a reasonable page size.
- Add next/previous navigation with URL-driven state.
- Preserve existing filters, search, and sort state across pages.
- Keep the implementation simple and server-rendered.

Rules:
- Do not touch moderation workflow or admin controls.
- Do not touch submit/detail/auth pages unless a shared helper is required.
- Do not revert or overwrite changes from other work.
