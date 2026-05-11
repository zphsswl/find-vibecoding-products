import Link from "next/link";
import { ProjectCardActions } from "@/components/project-card-actions";
import { ProjectCover } from "@/components/project-cover";
import type { ProjectCardData } from "@/lib/projects";

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <article className="group panel overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-[hsl(var(--primary)/0.22)] hover:shadow-[0_28px_80px_hsl(28_24%_22%/0.12)]">
      <Link href={`/projects/${project.slug}`} className="block">
        <ProjectCover project={project} />
      </Link>

      <div className="space-y-4 p-5 sm:p-6">
        <Link href={`/projects/${project.slug}`} className="block space-y-4">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="chip border-[hsl(var(--primary)/0.12)] bg-[hsl(var(--primary)/0.05)] text-[hsl(var(--primary))]">
              {project.status}
            </span>
            <span className="text-text/42">{project.category}</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-text">
              {project.title}
            </h3>
            <p className="text-sm leading-6 text-text/65">{project.summary}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>
        </Link>

        <div className="flex items-center justify-between border-t border-border/70 pt-4 text-xs text-text/48">
          <Link href={`/users/${project.author}`} className="transition hover:text-text">
            @{project.author}
          </Link>
        </div>

        <ProjectCardActions
          slug={project.slug}
          likes={project.likes}
          comments={project.comments}
          bookmarks={project.bookmarks}
        />
      </div>
    </article>
  );
}
