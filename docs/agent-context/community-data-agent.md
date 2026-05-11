# Community Data Agent

Scope: data model, server actions, session-adjacent profile behavior.

Responsibilities:
- Username/password authentication.
- Default random display names for new or incomplete accounts.
- Email binding through `/me`.
- Follow relationships and user community stats.
- Avatar fields: `avatarUrl` stores external or uploaded image data, `avatarPreset` stores the selected preset key.

Notes:
- The password implementation is still demo-grade SHA-256 with a pepper, not production authentication.
- Local avatar uploads are stored as data URLs in SQLite. This is acceptable for small demo avatars but should become object storage before public launch.
- `getUserProfileData(username, viewerUsername)` returns whether the viewer follows the profile owner.
