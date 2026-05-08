import { ProjectCard } from "@/components/project-card";
import { getProjectCards } from "@/lib/projects";

export default async function BookmarksPage() {
  const projects = await getProjectCards({ limit: 6 });

  return (
    <main className="page-band">
      <div className="page-shell">
        <span className="page-kicker">Bookmarks</span>
        <h1 className="mt-4 text-4xl font-semibold text-text">我的收藏</h1>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
