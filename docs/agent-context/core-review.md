# Core Review Context

Task: implement the moderation closure and visibility boundary fixes.

Scope owned by this agent:
- `src/lib/projects.ts`
- `src/app/projects/[slug]/page.tsx`
- `src/app/projects/[slug]/actions.ts`
- `src/app/admin/page.tsx`
- `src/app/submit/actions.ts`
- `prisma/schema.prisma` only if schema changes are required for approval/rejection workflow

Goals:
- Hide non-approved projects from public detail pages and list surfaces.
- Add a real moderation workflow with approve / reject / request changes actions.
- Keep counts and revalidation consistent.
- Preserve existing UI style and server-action patterns.

Rules:
- Do not touch discover pagination.
- Do not touch profile/bookmarks/collections pages unless needed for the moderation fix.
- Do not revert or overwrite changes from other work.
