# Community UI Agent

Scope: visible pages, copy, layout, and community surface.

Responsibilities:
- Header copy and logged-in "我的" entry.
- `/me` profile center with stats, email binding, avatar editing, and bookmark folder.
- `/users/[username]` public profile with stats and follow button.
- `/bookmarks` as the logged-in user's real bookmark list.

Notes:
- Keep core project browsing and submission behavior unchanged.
- Use `getAvatarUrl(avatarUrl, avatarPreset)` for every profile avatar so presets and uploads render consistently.
- Chinese copy should be committed as UTF-8. Some PowerShell output may look garbled if read with the wrong encoding, but source files are UTF-8.
