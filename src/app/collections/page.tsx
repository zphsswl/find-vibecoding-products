import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { getProjectCards } from "@/lib/projects";

export default async function CollectionsPage() {
  const projects = await getProjectCards({ limit: 9 });

  return (
    <main className="page-band">
      <div className="page-shell">
        <div className="mb-8 space-y-3">
          <span className="page-kicker">Collections</span>
          <h1 className="text-4xl font-semibold text-text md:text-5xl">榜单与精选</h1>
          <p className="text-sm leading-7 text-text/64 md:text-base">
            这里承载热门、本周精选、新增项目和专题合集。
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <Link href="/collections" className="chip">
            精选
          </Link>
          <Link href="/collections" className="chip">
            热门
          </Link>
          <Link href="/collections" className="chip">
            最新
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
