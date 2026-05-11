import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { getBookmarkedProjectCards } from "@/lib/projects";
import { getCurrentUser } from "@/lib/session";

export default async function BookmarksPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="page-band">
        <div className="page-shell">
          <div className="max-w-3xl space-y-4">
            <span className="page-kicker">Bookmarks</span>
            <h1 className="text-4xl font-semibold text-text md:text-5xl">我的收藏夹</h1>
          </div>
          <div className="panel mt-8 p-6 md:p-8">
            <p className="text-sm text-text/70">登录后可以查看你收藏过的项目。</p>
            <Link href="/auth/sign-in" className="btn-primary mt-4">
              去登录
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const projects = await getBookmarkedProjectCards(user.username, { limit: 24 });

  return (
    <main className="page-band">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-3xl space-y-4">
            <span className="page-kicker">Bookmarks</span>
            <h1 className="text-4xl font-semibold text-text md:text-5xl">我的收藏夹</h1>
            <p className="text-sm leading-7 text-text/64 md:text-base">这里展示你收藏过的已发布项目。</p>
          </div>
          <div className="panel px-5 py-4 text-sm">
            <p className="text-3xl font-semibold text-text">{projects.length}</p>
            <p className="mt-1 text-xs text-text/48">收藏项目</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 ? (
            <div className="panel p-6 text-sm text-text/60 md:col-span-2 lg:col-span-3">你的收藏夹还是空的。</div>
          ) : (
            projects.map((project) => <ProjectCard key={project.slug} project={project} />)
          )}
        </div>

        <div className="mt-8">
          <Link href="/me" className="btn-secondary">
            返回我的页面
          </Link>
        </div>
      </div>
    </main>
  );
}
