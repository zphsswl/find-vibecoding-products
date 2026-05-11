import type { CSSProperties } from "react";
import type { ProjectCardData } from "@/lib/projects";

type ProjectCoverProps = {
  project: Pick<ProjectCardData, "title" | "summary" | "category" | "tags" | "image">;
  size?: "card" | "detail";
};

export function ProjectCover({ project, size = "card" }: ProjectCoverProps) {
  const accent = coverAccent(project.category);
  const leadTag = project.tags[0] ?? project.category;
  const style = { "--cover-accent": accent } as CSSProperties;
  const isTextCover = project.image.startsWith("data:text/plain;charset=utf-8,") || !project.image;
  const coverText = project.image.startsWith("data:text/plain;charset=utf-8,")
    ? decodeURIComponent(project.image.slice("data:text/plain;charset=utf-8,".length))
    : project.summary;

  return (
    <div className={`project-cover project-cover-${size}`} style={style}>
      {project.image && !isTextCover ? (
        // Remote project screenshots come from user-submitted URLs; keep a plain img until allowed image domains are curated.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.image}
          alt={`${project.title} cover`}
          className="project-cover-image"
          loading={size === "detail" ? "eager" : "lazy"}
        />
      ) : null}
      <div className="project-cover-grid" />
      <div className="project-cover-content">
        <div className="flex items-center justify-between gap-3">
          <span className="project-cover-kicker">{project.category}</span>
          <span className="project-cover-mark">VC</span>
        </div>
        <p className="project-cover-title">{coverText}</p>
        <div className="project-cover-footer">
          <span>{project.title}</span>
          <span>{leadTag}</span>
        </div>
      </div>
    </div>
  );
}

function coverAccent(category: string) {
  let hash = 0;
  for (let i = 0; i < category.length; i += 1) {
    hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  }

  const palettes = [
    "166 42% 36%",
    "202 34% 34%",
    "270 24% 34%",
    "32 38% 36%",
    "112 26% 32%",
    "348 30% 40%",
    "24 40% 38%",
    "188 30% 32%",
    "214 30% 36%",
    "292 24% 36%",
    "42 50% 40%",
    "8 38% 38%",
    "154 28% 32%",
    "222 30% 34%"
  ];

  return palettes[hash % palettes.length];
}
