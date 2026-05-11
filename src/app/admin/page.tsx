import Link from "next/link";
import {
  approveProjectAction,
  rejectProjectAction,
  requestChangesProjectAction
} from "@/app/admin/actions";
import { getAnalyticsDashboardData, getAnalyticsFilteredData } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

type AdminSearchParams = {
  from?: string;
  to?: string;
  type?: string;
  source?: string;
  query?: string;
  status?: string;
};

export default async function AdminPage({
  searchParams
}: {
  searchParams?: Promise<AdminSearchParams>;
}) {
  const user = await getCurrentUser();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const filters = {
    from: resolvedSearchParams.from,
    to: resolvedSearchParams.to,
    type: resolvedSearchParams.type as "all" | "page_view" | "project_view" | "external_click" | "like" | "bookmark" | "sign_in" | "submit_project" | undefined,
    source: resolvedSearchParams.source,
    query: resolvedSearchParams.query,
    status: resolvedSearchParams.status
  };

  if (!user || user.role !== "admin") {
    return (
      <main className="page-band">
        <div className="page-shell mx-auto max-w-3xl">
          <div className="space-y-4">
            <span className="page-kicker">Admin</span>
            <h1 className="text-4xl font-semibold text-text md:text-5xl">管理后台</h1>
          </div>
          <div className="panel mt-8 p-6 md:p-8">
            <p className="text-sm text-text/70">需要管理员身份。请使用管理员账号和访问码登录。</p>
            <Link href="/auth/sign-in" className="btn-primary mt-4">
              去登录
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const [approvedCount, pendingCount, commentCount, reportCount, pendingProjects, latestProjects, reports, analytics, filteredAnalytics] =
    await Promise.all([
      prisma.project.count({ where: { status: "approved" } }),
      prisma.project.count({ where: { status: "pending" } }),
      prisma.comment.count(),
      prisma.report.count({ where: { status: "open" } }),
      prisma.project.findMany({
        where: { status: { in: ["pending", "changes_requested"] } },
        orderBy: { updatedAt: "desc" },
        take: 10,
        include: { author: true, category: true }
      }),
      prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { author: true, category: true }
      }),
      prisma.report.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { project: true }
      }),
      getAnalyticsDashboardData()
      ,
      getAnalyticsFilteredData(filters)
    ]);

  return (
    <main className="page-band">
      <div className="page-shell">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-3xl space-y-4">
            <span className="page-kicker">Admin</span>
            <h1 className="text-4xl font-semibold text-text md:text-5xl">管理后台</h1>
            <p className="text-sm leading-7 text-text/64 md:text-base">集中处理审核、举报和最新提交，保持作品库质量稳定。</p>
          </div>
          <Link href="/discover" className="btn-secondary px-4 py-2.5 text-sm">
            查看前台
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["已发布", approvedCount],
            ["待审核", pendingCount],
            ["评论", commentCount],
            ["举报", reportCount]
          ].map(([label, value]) => (
            <div key={label as string} className="panel p-5">
              <p className="text-sm text-text/50">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-text">{value as number}</p>
            </div>
          ))}
        </div>

        <section className="panel mt-8 p-6 md:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text">筛选数据</h2>
              <p className="mt-1 text-sm text-text/60">按日期、事件类型、来源和关键词过滤统计结果。</p>
            </div>
            <Link href="/admin" className="btn-secondary px-4 py-2.5 text-sm">
              清空筛选
            </Link>
          </div>

          <form className="mt-5 grid gap-4 lg:grid-cols-6" method="get">
            <input name="from" type="date" defaultValue={resolvedSearchParams.from ?? ""} className="field lg:col-span-1" />
            <input name="to" type="date" defaultValue={resolvedSearchParams.to ?? ""} className="field lg:col-span-1" />
            <select name="type" defaultValue={resolvedSearchParams.type ?? "all"} className="field lg:col-span-1">
              <option value="all">全部事件</option>
              <option value="page_view">页面浏览</option>
              <option value="project_view">项目访问</option>
              <option value="external_click">外链点击</option>
              <option value="like">点赞</option>
              <option value="bookmark">收藏</option>
              <option value="sign_in">登录</option>
              <option value="submit_project">投稿</option>
            </select>
            <select name="status" defaultValue={resolvedSearchParams.status ?? "all"} className="field lg:col-span-1">
              <option value="all">全部项目状态</option>
              <option value="approved">已发布</option>
              <option value="pending">待审核</option>
              <option value="changes_requested">需修改</option>
              <option value="rejected">已驳回</option>
            </select>
            <input name="source" defaultValue={resolvedSearchParams.source ?? ""} placeholder="来源页" className="field lg:col-span-1" />
            <input name="query" defaultValue={resolvedSearchParams.query ?? ""} placeholder="关键词 / 路径" className="field lg:col-span-1" />
            <button type="submit" className="btn-primary lg:col-span-6">
              应用筛选
            </button>
          </form>
        </section>

        <section className="panel mt-8 p-6 md:p-7">
          <h2 className="text-lg font-semibold text-text">筛选结果</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["事件数", filteredAnalytics.events.length],
              ["类型数", filteredAnalytics.countsByType.length],
              ["来源数", filteredAnalytics.topReferrers.length],
              ["路径数", filteredAnalytics.topPages.length]
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-lg border border-border bg-white/70 p-4">
                <p className="text-xs text-text/46">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-text">{value as number}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-white/70 p-4">
              <h3 className="text-sm font-semibold text-text">转化漏斗</h3>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  ["页面浏览", filteredAnalytics.countsByType.find((item) => item.type === "page_view")?._count.type ?? 0],
                  ["项目访问", filteredAnalytics.countsByType.find((item) => item.type === "project_view")?._count.type ?? 0],
                  ["外链点击", filteredAnalytics.countsByType.find((item) => item.type === "external_click")?._count.type ?? 0],
                  ["登录", filteredAnalytics.countsByType.find((item) => item.type === "sign_in")?._count.type ?? 0],
                  ["投稿", filteredAnalytics.countsByType.find((item) => item.type === "submit_project")?._count.type ?? 0],
                  ["点赞", filteredAnalytics.countsByType.find((item) => item.type === "like")?._count.type ?? 0],
                  ["收藏", filteredAnalytics.countsByType.find((item) => item.type === "bookmark")?._count.type ?? 0]
                ].map(([label, value]) => (
                  <div key={label as string} className="flex items-center justify-between gap-4">
                    <span className="text-text/70">{label}</span>
                    <span className="font-medium text-text">{value as number}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-white/70 p-4">
              <h3 className="text-sm font-semibold text-text">入口来源</h3>
              <div className="mt-4 space-y-3 text-sm">
                {filteredAnalytics.topReferrers.length === 0 ? (
                  <p className="text-text/60">暂无来源数据。</p>
                ) : (
                  filteredAnalytics.topReferrers.map((item) => (
                    <div key={item.referrer ?? "direct"} className="flex items-center justify-between gap-4">
                      <span className="truncate text-text/70">{item.referrer ?? "直接访问"}</span>
                      <span className="font-medium text-text">{item._count?.referrer ?? 0}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-border bg-white/70 p-4">
              <h3 className="text-sm font-semibold text-text">最近 7 天趋势</h3>
              <div className="mt-4 space-y-3">
              {analytics.dailySeries.map((day) => (
                <div key={day.day} className="grid gap-2 md:grid-cols-[96px_1fr_80px] md:items-center">
                  <span className="text-xs text-text/58">{day.day}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--border)/0.4)]">
                    <div
                      className="h-full rounded-full bg-[hsl(var(--primary))]"
                      style={{ width: `${Math.min(100, (day.pageViews / Math.max(1, analytics.weekEvents)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-text">{day.pageViews}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel mt-8 p-6 md:p-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-text">待审核项目</h2>
            <span className="text-xs text-text/46">{pendingProjects.length} 项</span>
          </div>
          <div className="mt-4 space-y-4">
            {pendingProjects.length === 0 ? (
              <p className="py-4 text-sm text-text/60">暂无待审核项目。</p>
            ) : (
              pendingProjects.map((project) => (
                <div key={project.id} className="rounded-lg border border-border bg-white/75 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <Link href={`/projects/${project.slug}`} className="font-medium text-text">
                        {project.title}
                      </Link>
                      <p className="mt-1 text-xs text-text/54">
                        @{project.author.username} · {project.category.name} · {project.status}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <form action={approveProjectAction.bind(null, project.slug)}>
                        <button type="submit" className="btn-primary px-4 py-2 text-xs">
                          通过
                        </button>
                      </form>
                      <form action={requestChangesProjectAction.bind(null, project.slug)}>
                        <button type="submit" className="btn-secondary px-4 py-2 text-xs">
                          需修改
                        </button>
                      </form>
                      <form action={rejectProjectAction.bind(null, project.slug)}>
                        <button type="submit" className="btn-secondary px-4 py-2 text-xs">
                          驳回
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="panel mt-8 p-6 md:p-7">
          <h2 className="text-lg font-semibold text-text">最新项目</h2>
          <div className="mt-4 divide-y divide-border">
            {latestProjects.map((project) => (
              <div key={project.id} className="grid gap-2 py-4 text-sm md:grid-cols-[1fr_160px_120px]">
                <Link href={`/projects/${project.slug}`} className="font-medium text-text">
                  {project.title}
                </Link>
                <span className="text-text/60">{project.category.name}</span>
                <span className="text-text/60">{project.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel mt-8 p-6 md:p-7">
          <h2 className="text-lg font-semibold text-text">项目排行</h2>
          <div className="mt-4 space-y-3">
            {filteredAnalytics.topProjects.map((project) => (
              <div key={project.slug} className="grid gap-2 rounded-lg border border-border bg-white/70 p-4 md:grid-cols-[1fr_120px_120px]">
                <Link href={`/projects/${project.slug}`} className="font-medium text-text">
                  {project.title}
                </Link>
                <span className="text-sm text-text/60">浏览 {project.viewCount}</span>
                <span className="text-sm text-text/60">外链 {project.externalClickCount}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel mt-8 p-6 md:p-7">
          <h2 className="text-lg font-semibold text-text">最新举报</h2>
          <div className="mt-4 divide-y divide-border">
            {reportCount === 0 ? (
              <p className="py-4 text-sm text-text/60">暂无举报。</p>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="grid gap-2 py-4 text-sm md:grid-cols-[1fr_160px_120px]">
                  <span className="font-medium text-text">{report.targetType}</span>
                  <span className="text-text/60">{report.reason}</span>
                  <span className="text-text/60">{report.status}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
