# Community Profile Context

Task: turn the account/profile area into a light community system.

Owned files:
- `prisma/schema.prisma`
- `src/lib/projects.ts`
- `src/app/me/page.tsx`
- `src/app/me/actions.ts`
- `src/app/auth/sign-up/actions.ts`
- `src/app/auth/sign-up/page.tsx`
- `src/app/users/[username]/page.tsx`
- `src/app/bookmarks/page.tsx`
- any small helper required for profile/account data

Goals:
- Add avatar support with local image upload or preset avatar choice.
- Add editable display name / nickname behavior with randomized default name at sign-up/login.
- Add follower/following/liked/bookmarked community stats.
- Keep bookmarks as a real collection/folder view.

Rules:
- Do not touch moderation workflow or discover pagination.
- Do not change core project submission or approval logic unless strictly required.
- Do not overwrite other agents' edits.
