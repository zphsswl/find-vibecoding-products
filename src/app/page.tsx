import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { getCategoryNames, getProjectCards } from "@/lib/projects";

export default async function HomePage() {
  const [categories, featuredProjects] = await Promise.all([
    getCategoryNames(),
    getProjectCards({ featuredOnly: true, limit: 6 })
  ]);

  return (
    <main>
      <section className="page-band border-b border-border/70">
        <div className="page-shell">
          <div className="mx-auto max-w-5xl space-y-8 py-8 text-center md:py-14">
            <span className="page-kicker">精选 / 投稿 / 发现</span>
            <div className="space-y-5">
              <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[0.96] text-text md:text-6xl lg:text-7xl">
                发现更有审美的 vibe coding 作品。
              </h1>
              <p className="mx-auto max-w-3xl text-base leading-8 text-text/66 md:text-lg md:leading-9">
                一个更克制的作品库、投稿社区和灵感入口。看作品、看方法、看目的，再决定要不要打开。
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/discover" className="btn-primary">
                浏览作品
              </Link>
              <Link href="/submit" className="btn-secondary">
                提交作品
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
            {[
              ["精选", "只保留好玩、有审美、有启发的项目"],
              ["分类", "按用途、技术栈和创作方向筛选"],
              ["中文", "每个项目都用中文说明价值和使用方式"]
            ].map(([title, desc]) => (
              <div key={title} className="rounded-lg border border-border/70 bg-white/60 p-5">
                <p className="text-base font-semibold text-text">{title}</p>
                <p className="mt-2 text-sm leading-6 text-text/54">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-band border-b border-border/70">
        <div className="page-shell">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="section-title">分类入口</h2>
              <p className="section-lead">只展示已有精选项目的分类，避免空分类和泛项目干扰。</p>
            </div>
            <Link href="/discover" className="text-sm font-medium text-text/70 transition hover:text-text">
              查看全部
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/discover?category=${encodeURIComponent(category)}`}
                className="panel px-5 py-5 text-sm font-semibold text-text transition hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-band">
        <div className="page-shell">
          <div className="mb-7">
            <h2 className="section-title">编辑精选</h2>
            <p className="section-lead">优先展示说明完整、目的清晰、完成度高的 vibe coding 项目。</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
