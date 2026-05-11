# Aesthetic System Context

Task: improve the visual system without changing core functionality.

Primary ownership:
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/site-header.tsx`
- `src/components/project-card.tsx`
- `src/components/project-cover.tsx`
- `src/components/project-card-actions.tsx`

Design goals:
- Move the site toward an editorial archive / gallery tone.
- Strengthen hierarchy, spacing, and section separation.
- Increase brand recall without introducing decorative clutter.
- Keep all business logic unchanged.

Rules:
- Do not change data flow, routing, or server actions.
- Do not alter moderation/search/bookmark logic.
- Keep the UI production-grade and accessible.
- Do not overwrite other agents' edits.
