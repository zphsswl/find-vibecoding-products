# Auth Copy Polish Context

Task: fix visible mojibake/garbled text around the top-right navigation and auth/profile pages.

Owned files:
- `src/components/site-header.tsx`
- `src/app/auth/sign-in/page.tsx`
- `src/app/auth/sign-up/page.tsx`
- `src/app/users/[username]/page.tsx`

Goals:
- Replace garbled Chinese UI labels with clean Chinese.
- Do not change authentication logic or database schema.
- Keep styling consistent with the current editorial/archive design.

Rules:
- Do not touch server actions, Prisma schema, or session logic.
- Do not overwrite main-agent edits outside these owned files.
