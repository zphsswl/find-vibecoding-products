import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { getProjectCards } from "@/lib/projects";

const collections = [
  { href: "/discover?sort=hot", label: "热门项目" },
  { href: "/discover?sort=latest", label: "最新项目" },
  { href: "/discover?sort=bookmarks", label: "收藏最多" },
  { href: "/discover?sort=comments", label: "评论最多" }
];

export default async function CollectionsPage() {
  const [featured, latest, hot] = await Promise.all([
    getProjectCards({ featuredOnly: true, limit: 3 }),
    getProjectCards({ sort: "latest", limit: 3 }),
    getProjectCards({ sort: "hot", limit: 3 })
  ]);

  return (
    <main className="page-band">
      <div className="page-shell">
        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-3xl space-y-3">
            <span className="page-kicker">Collections</span>
            <h1 className="text-4xl font-semibold text-text md:text-5xl">榜单与精选</h1>
            <p className="text-sm leading-7 text-text/64 md:text-base">这里聚合热门、最新与精选项目，作为快速入口使用。</p>
          </div>
          <div className="panel p-5 text-sm leading-7 text-text/58">
            按不同浏览意图组织作品：先看编辑精选，再补充最新提交和社区热度。
          </div>
        </div>

        <div className="mb-10 flex flex-wrap gap-2 border-b border-border/70 pb-6">
          {collections.map((item) => (
            <Link key={item.href} href={item.href} className="chip">
              {item.label}
            </Link>
          ))}
        </div>

        <section className="mb-12 space-y-4">
          <h2 className="section-title">精选</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {featured.length === 0 ? (
              <div className="panel p-6 text-sm text-text/60">暂无精选项目。</div>
            ) : (
              featured.map((project) => <ProjectCard key={project.slug} project={project} />)
            )}
          </div>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="section-title">最新</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {latest.map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="section-title">热门</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {hot.map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </section>
      </div>
    </main>
  );
}
