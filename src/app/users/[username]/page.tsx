import { ProjectCard } from "@/components/project-card";
import { getProjectCards } from "@/lib/projects";

export default async function UserProfilePage({
  params
}: {
  params: Promise<{ username: string }>;
}) {
  const resolvedParams = await params;
  const projects = await getProjectCards({ author: resolvedParams.username, limit: 9 });

  return (
    <main className="page-band">
      <div className="page-shell">
        <span className="page-kicker">Profile</span>
        <h1 className="mt-4 text-4xl font-semibold text-text">@{resolvedParams.username}</h1>
        <p className="mt-3 text-sm leading-7 text-text/64">这个页面展示作者简介、投稿和收藏。</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
