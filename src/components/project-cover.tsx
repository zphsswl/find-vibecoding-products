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

  return (
    <div className={`project-cover project-cover-${size}`} style={style}>
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.title} 封面`}
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
        <p className="project-cover-title">{project.summary}</p>
        <div className="project-cover-footer">
          <span>{project.title}</span>
          <span>{leadTag}</span>
        </div>
      </div>
    </div>
  );
}

function coverAccent(category: string) {
  const accents: Record<string, string> = {
    "AI 设计": "166 48% 38%",
    "应用生成": "202 38% 36%",
    "智能体工具": "270 24% 38%",
    "开发工作流": "32 42% 38%",
    "学习资源": "112 28% 34%",
    "作品展示": "348 32% 42%",
    官网: "24 44% 40%",
    工具: "188 34% 34%",
    SaaS: "214 34% 38%",
    插件: "292 25% 38%",
    小游戏: "42 56% 42%",
    实验: "8 44% 40%",
    作品集: "154 30% 34%",
    数据可视化: "222 35% 36%"
  };

  return accents[category] ?? "30 24% 18%";
}
