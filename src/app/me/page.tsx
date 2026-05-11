import Link from "next/link";
import { setPresetAvatarAction, updateMyEmailAction, updateMyProfileAction } from "@/app/me/actions";
import { avatarPresets, getAvatarUrl } from "@/lib/community";
import { getBookmarkedProjectCards, getUserProfileData } from "@/lib/projects";
import { requireCurrentUser } from "@/lib/session";

export default async function MyPage() {
  const user = await requireCurrentUser();
  const profile = await getUserProfileData(user.username);
  const bookmarkedProjects = await getBookmarkedProjectCards(user.username, { limit: 6 });
  const avatarUrl = getAvatarUrl(user.avatarUrl, user.avatarPreset);

  return (
    <main className="page-band">
      <div className="page-shell mx-auto max-w-4xl">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div className="space-y-4">
            <span className="page-kicker">My Account</span>
            <h1 className="text-4xl font-semibold text-text md:text-5xl">我的页面</h1>
            <p className="text-sm leading-7 text-text/64 md:text-base">
              管理你的昵称、头像、邮箱和收藏夹。这里会逐步变成你的社区中心。
            </p>
          </div>

          <div className="panel overflow-hidden p-5">
            <img
              src={avatarUrl}
              alt={user.displayName}
              className="h-48 w-full rounded-md object-cover"
            />
            <p className="mt-4 text-lg font-semibold text-text">{user.displayName}</p>
            <p className="text-sm text-text/56">@{user.username}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profile
            ? [
                ["关注", profile.communityStats.following],
                ["粉丝", profile.communityStats.followers],
                ["获赞", profile.communityStats.likesReceived],
                ["收藏", profile.communityStats.bookmarksReceived]
              ].map(([label, value]) => (
                <div key={label as string} className="panel p-5">
                  <p className="text-sm text-text/50">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-text">{value as number}</p>
                </div>
              ))
            : null}
        </div>

        <section className="panel mt-8 p-6 md:p-8">
          <h2 className="text-lg font-semibold text-text">资料设置</h2>
          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            <form action={updateMyProfileAction} className="space-y-4">
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-text">展示名</span>
                <input name="displayName" className="field" defaultValue={user.displayName} />
              </label>
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-text">头像图片地址</span>
                <input name="avatarUrl" className="field" defaultValue={user.avatarUrl?.startsWith("data:") ? "" : user.avatarUrl ?? ""} placeholder="https://..." />
              </label>
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-text">上传本地头像</span>
                <input name="avatarFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" className="field" />
              </label>
              <button type="submit" className="btn-primary">
                保存资料
              </button>
            </form>

            <form action={updateMyEmailAction} className="space-y-4">
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-text">绑定邮箱</span>
                <input
                  name="email"
                  type="email"
                  className="field"
                  defaultValue={user.email ?? ""}
                  placeholder="you@example.com"
                />
              </label>
              <button type="submit" className="btn-primary">
                保存邮箱
              </button>
              <p className="text-xs leading-6 text-text/52">
                头像支持图片地址、本地图片和预设像素形象。本地图片会直接保存到你的资料里，建议使用小于 700KB 的方形图片。
              </p>
            </form>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-text">预设头像</p>
            <div className="flex flex-wrap gap-3">
              {avatarPresets.map((avatarPreset) => (
                <form key={avatarPreset} action={setPresetAvatarAction}>
                  <input type="hidden" name="avatarPreset" value={avatarPreset} />
                  <button type="submit" className="rounded-md border border-border bg-white p-1.5">
                    <img src={getAvatarUrl(null, avatarPreset)} alt="预设头像" className="h-14 w-14 rounded-sm" />
                  </button>
                </form>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="section-title">收藏夹</h2>
            <Link href="/bookmarks" className="text-sm font-medium text-text/70 transition hover:text-text">
              查看全部
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {bookmarkedProjects.length === 0 ? (
              <div className="panel p-6 text-sm text-text/60 lg:col-span-3">你的收藏夹还是空的。</div>
            ) : (
              bookmarkedProjects.map((project) => (
                <Link key={project.slug} href={`/projects/${project.slug}`} className="panel p-5 transition hover:-translate-y-0.5">
                  <p className="text-xs text-text/46">收藏项目</p>
                  <p className="mt-2 text-lg font-semibold text-text">{project.title}</p>
                  <p className="mt-2 text-sm leading-6 text-text/60">{project.summary}</p>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
