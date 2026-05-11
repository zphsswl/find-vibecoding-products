import Link from "next/link";
import { toggleFollowAction } from "@/app/users/[username]/actions";
import { ProjectCard } from "@/components/project-card";
import { getAvatarUrl } from "@/lib/community";
import { getProjectCards, getUserProfileData } from "@/lib/projects";
import { getCurrentUser } from "@/lib/session";

export default async function UserProfilePage({
  params
}: {
  params: Promise<{ username: string }>;
}) {
  const currentUser = await getCurrentUser();
  const resolvedParams = await params;
  const profile = await getUserProfileData(resolvedParams.username, currentUser?.username);
  const projects = await getProjectCards({ author: resolvedParams.username, limit: 12 });
  const isOwnPage = currentUser?.username === resolvedParams.username;
  const isFollowing = Boolean(profile?.isFollowedByCurrentUser);

  if (!profile) {
    return (
      <main className="page-band">
        <div className="page-shell">
          <div className="max-w-3xl space-y-4">
            <span className="page-kicker">Profile</span>
            <h1 className="text-4xl font-semibold text-text">@{resolvedParams.username}</h1>
          </div>
          <div className="panel mt-8 p-6 text-sm text-text/60">找不到这个用户。</div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-band">
      <div className="page-shell">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div className="max-w-3xl space-y-4">
            <span className="page-kicker">Profile</span>
            <h1 className="text-4xl font-semibold text-text md:text-5xl">@{resolvedParams.username}</h1>
            <p className="text-sm leading-7 text-text/64 md:text-base">
              {profile.user.bio ?? "这位作者还没有填写简介。"}
            </p>
          </div>
          <div className="panel overflow-hidden p-5">
            <img
              src={getAvatarUrl(profile.user.avatarUrl, profile.user.avatarPreset)}
              alt={profile.user.displayName}
              className="h-40 w-full rounded-md object-cover"
            />
            <p className="mt-4 text-lg font-semibold text-text">{profile.user.displayName}</p>
            <p className="text-sm text-text/56">@{profile.user.username}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["已发布", profile.approvedCount],
            ["待审", profile.pendingCount],
            ["关注", profile.communityStats.following],
            ["粉丝", profile.communityStats.followers]
          ].map(([label, value]) => (
            <div key={label as string} className="panel p-5">
              <p className="text-sm text-text/50">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-text">{value as number}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["获赞", profile.communityStats.likesReceived],
            ["收藏", profile.communityStats.bookmarksReceived],
            ["个人收藏", profile.bookmarkCount],
            ["评论", profile.commentCount]
          ].map(([label, value]) => (
            <div key={label as string} className="panel p-5">
              <p className="text-sm text-text/50">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-text">{value as number}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {!isOwnPage && currentUser ? (
            <form action={toggleFollowAction.bind(null, resolvedParams.username)}>
              <button type="submit" className="btn-primary">
                {isFollowing ? "已关注" : "关注"}
              </button>
            </form>
          ) : null}
          {isOwnPage ? (
            <Link href="/me" className="btn-secondary">
              编辑我的资料
            </Link>
          ) : null}
        </div>

        <section className="mt-12 space-y-4">
          <h2 className="section-title">作品</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {projects.length === 0 ? (
              <div className="panel p-6 text-sm text-text/60 lg:col-span-3">暂无公开作品。</div>
            ) : (
              projects.map((project) => <ProjectCard key={project.slug} project={project} />)
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
