import Link from "next/link";
import { ProjectCardActions } from "@/components/project-card-actions";
import { ProjectCover } from "@/components/project-cover";
import type { ProjectCardData } from "@/lib/projects";

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <article className="group panel overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_28px_80px_rgba(70,56,29,0.12)]">
      <Link href={`/projects/${project.slug}`} className="block">
        <ProjectCover project={project} />
      </Link>

      <div className="space-y-4 p-5">
        <Link href={`/projects/${project.slug}`} className="block space-y-4">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="chip border-primary/15 bg-primary/5 text-primary">
              {project.status}
            </span>
            <span className="text-text/40">{project.category}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-text">{project.title}</h3>
            <p className="mt-2 text-sm leading-6 text-text/64">{project.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        </Link>

        <div className="flex items-center justify-between text-xs text-text/48">
          <Link href={`/users/${project.author}`} className="transition hover:text-text">
            @{project.author}
          </Link>
        </div>

        <ProjectCardActions
          likes={project.likes}
          comments={project.comments}
          bookmarks={project.bookmarks}
        />
      </div>
    </article>
  );
}
