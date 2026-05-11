# Page Polish Context

Task: polish page-level presentation without changing core functionality.

Primary ownership:
- `src/app/page.tsx`
- `src/app/discover/page.tsx`
- `src/app/projects/[slug]/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/submit/page.tsx`
- `src/app/auth/sign-in/page.tsx`
- `src/app/auth/sign-up/page.tsx`
- `src/app/bookmarks/page.tsx`
- `src/app/collections/page.tsx`
- `src/app/users/[username]/page.tsx`

Design goals:
- Improve first-viewport impact and page rhythm.
- Make hero, filters, and detail pages feel more intentional.
- Preserve all current interactions and server-rendered behavior.

Rules:
- Do not change data fetching behavior or any server actions.
- Do not change routing or permissions.
- Do not overwrite other agents' edits.
