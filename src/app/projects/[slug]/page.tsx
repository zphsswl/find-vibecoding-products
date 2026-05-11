import { notFound } from "next/navigation";
import Link from "next/link";
import {
  addCommentAction,
  reportProjectAction,
  toggleBookmarkAction,
  toggleLikeAction
} from "@/app/projects/[slug]/actions";
import { ProjectViewTracker, TrackedExternalLink } from "@/components/analytics-tracker";
import { CommentSection } from "@/components/comment-section";
import { ProjectCover } from "@/components/project-cover";
import { getAvatarUrl } from "@/lib/avatar";
import { getProjectDetail, getProjectSlugs } from "@/lib/projects";
import { getCurrentUser } from "@/lib/session";

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
  const currentUser = await getCurrentUser();
  const project = await getProjectDetail(resolvedParams.slug, currentUser);

  if (!project) {
    notFound();
  }

  const isGithubProject = isGithubUrl(project.url) || isGithubUrl(project.sourceUrl);
  const sourceLabel = isGithubProject ? "GitHub" : sourceHost(project.sourceUrl ?? project.url);

  return (
    <main className="page-band">
      <div className="page-shell">
        <ProjectViewTracker slug={resolvedParams.slug} projectId={project.id} />
        <section className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">{project.title}</h1>
            <p className="max-w-3xl text-lg leading-8 text-text/62">{project.summary}</p>
            {project.moderationStatus !== "approved" ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                当前项目处于 {moderationLabel(project.moderationStatus)} 状态，仅作者和管理员可见。
              </div>
            ) : null}
            </div>
            <div className="panel grid grid-cols-2 gap-4 p-5 text-sm">
              <div>
                <p className="text-3xl font-semibold text-text">{formatCount(project.likes)}</p>
                <p className="mt-1 text-xs text-text/48">点赞</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-text">{formatCount(project.bookmarks)}</p>
                <p className="mt-1 text-xs text-text/48">收藏</p>
              </div>
            </div>
          </div>

          <div className="panel overflow-hidden">
            <ProjectCover project={project} size="detail" />
          </div>

          {project.moderationStatus === "approved" ? (
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
              <TrackedExternalLink href={project.url} projectSlug={project.slug} projectId={project.id} className="btn-primary px-5 py-2.5 text-sm">
                访问项目
              </TrackedExternalLink>
            </div>
          ) : null}
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-6">
            <div className="panel p-6 md:p-7">
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

            {project.moderationStatus === "approved" ? (
              <section className="panel p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text">评论区</h2>
                  <span className="text-sm text-text/46">{project.commentList.length} 条</span>
                </div>
                <form action={addCommentAction.bind(null, project.slug)} className="mt-4 space-y-3">
                  <textarea name="body" className="field-area" placeholder="写下你对这个项目的看法..." />
                  <button type="submit" className="btn-primary">
                    发表
                  </button>
                </form>
                <div className="mt-6">
                  <CommentSection
                    comments={project.commentList}
                    slug={project.slug}
                    isLoggedIn={Boolean(currentUser)}
                    currentUsername={currentUser?.username ?? null}
                  />
                </div>
              </section>
            ) : null}

            {project.moderationStatus === "approved" ? (
              <details className="panel p-6 md:p-7">
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
            ) : null}
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="panel p-6">
              <p className="text-sm text-text/46">项目信息</p>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="mb-2 text-xs text-text/42">作者</dt>
                  <dd>
                    <Link
                      href={`/users/${project.author}`}
                      className="group flex items-center gap-3 rounded-lg p-2 -mx-2 transition hover:bg-surface-strong"
                    >
                      <img
                        src={getAvatarUrl(project.authorAvatarUrl, project.authorAvatarPreset)}
                        alt={project.authorDisplayName}
                        className="h-9 w-9 rounded-full border border-border object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-text group-hover:text-text/80">{project.authorDisplayName}</p>
                        <p className="text-text/40">@{project.author}</p>
                      </div>
                    </Link>
                  </dd>
                </div>
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

function moderationLabel(status: string) {
  switch (status) {
    case "pending":
      return "待审核";
    case "rejected":
      return "已驳回";
    case "changes_requested":
      return "需修改";
    default:
      return status;
  }
}
