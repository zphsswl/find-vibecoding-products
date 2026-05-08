import { notFound } from "next/navigation";
import {
  addCommentAction,
  reportProjectAction,
  toggleBookmarkAction,
  toggleLikeAction
} from "@/app/projects/[slug]/actions";
import { ProjectCover } from "@/components/project-cover";
import { getProjectDetail, getProjectSlugs } from "@/lib/projects";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const project = await getProjectDetail(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  const isGithubProject = isGithubUrl(project.url) || isGithubUrl(project.sourceUrl);
  const sourceLabel = isGithubProject ? "GitHub" : sourceHost(project.sourceUrl ?? project.url);

  return (
    <main className="page-band">
      <div className="page-shell">
        <section className="space-y-6">
          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">
              {project.title}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-text/62">{project.summary}</p>
          </div>

          <div className="panel overflow-hidden">
            <ProjectCover project={project} size="detail" />
          </div>

          <div className="panel flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div className="grid grid-cols-2 gap-3 text-sm sm:flex">
              <form action={toggleLikeAction.bind(null, project.slug)}>
                <button type="submit" className="btn-secondary w-full px-4 py-2.5">
                  点赞 {formatCount(project.likes)}
                </button>
              </form>
              <form action={toggleBookmarkAction.bind(null, project.slug)}>
                <button type="submit" className="btn-secondary w-full px-4 py-2.5">
                  收藏 {formatCount(project.bookmarks)}
                </button>
              </form>
            </div>
            <a href={project.url} className="btn-primary px-5 py-2.5 text-sm">
              访问项目
            </a>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-6">
            <div className="panel p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <InfoBlock title="创作目的">{project.purpose}</InfoBlock>
                <InfoBlock title="使用方式">{project.howToUse}</InfoBlock>
              </div>
              <div className="mt-6 border-t border-border pt-6">
                <InfoBlock title="项目介绍">{project.description}</InfoBlock>
              </div>
              <div className="mt-6 border-t border-border pt-6">
                <InfoBlock title="来源说明">{project.buildNotes ?? "暂无补充说明。"}</InfoBlock>
              </div>
            </div>

            <section className="panel p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text">评论区</h2>
                <span className="text-sm text-text/46">{project.commentList.length} 条</span>
              </div>
              <form action={addCommentAction.bind(null, project.slug)} className="mt-4 space-y-3">
                <textarea
                  name="body"
                  className="field-area"
                  placeholder="写下你对这个项目的看法..."
                />
                <button type="submit" className="btn-primary">
                  发表
                </button>
              </form>
              <div className="mt-6 space-y-4">
                {project.commentList.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-border bg-white/60 p-4 text-sm text-text/52">
                    暂无评论，等真实用户来留下第一条反馈。
                  </p>
                ) : null}
                {project.commentList.map((comment) => (
                  <article key={comment.id} className="rounded-lg border border-border bg-white/80 p-4">
                    <div className="flex items-center justify-between text-xs text-text/46">
                      <span>@{comment.author}</span>
                      <span>{comment.createdAt.toLocaleDateString("zh-CN")}</span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-text/76">{comment.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <details className="panel p-6">
              <summary className="cursor-pointer text-sm font-semibold text-text/68">举报这个项目</summary>
              <form action={reportProjectAction.bind(null, project.slug)} className="mt-4 space-y-3 text-sm">
                <select name="reason" className="field">
                  <option value="spam">垃圾内容</option>
                  <option value="abuse">不当内容</option>
                  <option value="copyright">版权问题</option>
                  <option value="nsfw">不适宜内容</option>
                  <option value="other">其他</option>
                </select>
                <textarea name="detail" className="field-area min-h-24" placeholder="补充说明" />
                <button type="submit" className="btn-secondary px-4 py-2 text-sm">
                  提交举报
                </button>
              </form>
            </details>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="panel p-6">
              <p className="text-sm text-text/46">项目信息</p>
              <dl className="mt-5 space-y-4 text-sm">
                <MetaRow label="作者" value={`@${project.author}`} />
                <MetaRow label="分类" value={project.category} />
                <MetaRow label="技术栈" value={project.tech.length ? project.tech.join(" / ") : "未标注"} />
                <MetaRow label="来源" value={sourceLabel} />
              </dl>
            </div>

            {isGithubProject ? (
              <div className="panel p-6">
                <p className="text-sm text-text/46">GitHub 热度</p>
                <p className="mt-3 text-3xl font-semibold text-text">
                  {project.githubStars === null ? "暂无" : formatCount(project.githubStars)}
                </p>
                <p className="mt-1 text-sm text-text/58">Stars</p>
                {project.githubStarsCheckedAt ? (
                  <p className="mt-4 text-xs leading-6 text-text/46">
                    统计时间：{project.githubStarsCheckedAt.toLocaleString("zh-CN", { hour12: false })}
                  </p>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoBlock({ title, children }: { title: string; children: string }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-text">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-text/64">{children}</p>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-text/42">{label}</dt>
      <dd className="mt-1 leading-6 text-text/70">{value}</dd>
    </div>
  );
}

function isGithubUrl(url?: string | null) {
  return Boolean(url && /^https?:\/\/(www\.)?github\.com\//i.test(url));
}

function sourceHost(url?: string | null) {
  if (!url) return "未标注";

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "外部链接";
  }
}

function formatCount(count: number) {
  if (count >= 10000) return `${(count / 10000).toFixed(count >= 100000 ? 0 : 1)}万`;
  if (count >= 1000) return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`;
  return count.toString();
}
