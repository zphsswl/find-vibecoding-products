import Link from "next/link";
import {
  approveProjectAction,
  rejectProjectAction,
  requestChangesProjectAction
} from "@/app/admin/actions";
import { getAnalyticsDashboardData, getAnalyticsFilteredData, getUserAnalytics } from "@/lib/analytics";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

type AdminSearchParams = {
  from?: string;
  to?: string;
  type?: string;
  source?: string;
  query?: string;
  status?: string;
  userId?: string;
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
    status: resolvedSearchParams.status,
    userId: resolvedSearchParams.userId
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
            <Link href="/auth/sign-in?redirect=/admin" className="btn-primary mt-4">
              去登录
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const [approvedCount, pendingCount, commentCount, reportCount, pendingProjects, latestProjects, reports, analytics, filteredAnalytics, userAnalytics] =
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
      getAnalyticsFilteredData(filters),
      getUserAnalytics()
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
            {resolvedSearchParams.userId && <input name="userId" type="hidden" value={resolvedSearchParams.userId} />}
            {resolvedSearchParams.userId && (
              <p className="text-xs text-accent lg:col-span-6">
                当前筛选用户 ID：{resolvedSearchParams.userId}
                <Link href="/admin" className="ml-2 text-text/40 hover:text-text">清除</Link>
              </p>
            )}
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
            <h2 className="text-lg font-semibold text-text">事件明细</h2>
            <span className="text-xs text-text/46">{filteredAnalytics.events.length} 条</span>
          </div>
          <p className="mt-1 text-sm text-text/60">最近记录的具体事件，按时间倒序。</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-text/50">
                  <th className="whitespace-nowrap py-2 pr-3 font-medium">时间</th>
                  <th className="whitespace-nowrap py-2 pr-3 font-medium">类型</th>
                  <th className="whitespace-nowrap py-2 pr-3 font-medium">页面</th>
                  <th className="whitespace-nowrap py-2 pr-3 font-medium">项目</th>
                  <th className="whitespace-nowrap py-2 pr-3 font-medium">用户</th>
                  <th className="whitespace-nowrap py-2 pr-3 font-medium">来源</th>
                  <th className="whitespace-nowrap py-2 font-medium">IP</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalytics.events.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-text/50">暂无事件数据。</td>
                  </tr>
                ) : (
                  filteredAnalytics.events.map((e) => (
                    <tr key={e.id} className="border-b border-border/50 text-text/70">
                      <td className="whitespace-nowrap py-2 pr-3 text-xs">
                        {new Date(e.createdAt).toLocaleString("zh-CN")}
                      </td>
                      <td className="whitespace-nowrap py-2 pr-3">
                        <span className="rounded bg-accent/8 px-1.5 py-0.5 text-xs font-medium text-accent">
                          {{
                            page_view: "页面浏览",
                            project_view: "项目访问",
                            external_click: "外链点击",
                            like: "点赞",
                            bookmark: "收藏",
                            sign_in: "登录",
                            submit_project: "投稿"
                          }[e.type] ?? e.type}
                        </span>
                      </td>
                      <td className="max-w-[200px] truncate py-2 pr-3 text-xs">{e.page ?? "-"}</td>
                      <td className="max-w-[120px] truncate py-2 pr-3 text-xs">
                        {e.projectSlug ? (
                          <Link href={`/projects/${e.projectSlug}`} className="text-accent hover:underline">{e.projectSlug}</Link>
                        ) : "-"}
                      </td>
                      <td className="whitespace-nowrap py-2 pr-3 text-xs">
                        {e.user ? (
                          <Link href={`/users/${e.user.username}`} className="text-accent hover:underline">@{e.user.username}</Link>
                        ) : e.userId ? e.userId.slice(0, 8) : "-"}
                      </td>
                      <td className="max-w-[150px] truncate py-2 pr-3 text-xs">{e.referrer ?? "-"}</td>
                      <td className="whitespace-nowrap py-2 text-xs font-mono">{e.ipAddress ?? "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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

        <section className="panel mt-8 p-6 md:p-7">
          <h2 className="text-lg font-semibold text-text">注册用户</h2>
          <p className="mt-1 text-sm text-text/60">最近注册的用户列表，含角色和内容贡献统计。</p>
          <div className="mt-4 divide-y divide-border">
            {userAnalytics.users.length === 0 ? (
              <p className="py-4 text-sm text-text/60">暂无用户。</p>
            ) : (
              userAnalytics.users.map((u) => (
                <div key={u.id} className="grid gap-2 py-3 text-sm md:grid-cols-[1fr_100px_80px_80px_60px]">
                  <div>
                    <Link href={`/admin?userId=${u.id}`} className="font-medium text-text hover:text-accent">{u.displayName}</Link>
                    <Link href={`/admin?userId=${u.id}`} className="ml-2 text-xs text-text/40 hover:text-accent">@{u.username}</Link>
                    {u.role === "admin" && <span className="ml-2 rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">管理员</span>}
                  </div>
                  <span className="text-xs text-text/50">{new Date(u.createdAt).toLocaleDateString("zh-CN")}</span>
                  <span className="text-xs text-text/50">{u._count.projects} 投稿</span>
                  <span className="text-xs text-text/50">{u._count.comments} 评论</span>
                  <Link href={`/users/${u.username}`} className="text-xs text-accent hover:underline">查看</Link>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="panel mt-8 p-6 md:p-7">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold text-text">近 30 天登录记录</h2>
              <div className="mt-4 divide-y divide-border">
                {userAnalytics.signIns.length === 0 ? (
                  <p className="py-4 text-sm text-text/60">暂无登录记录。</p>
                ) : (
                  userAnalytics.signIns.slice(0, 15).map((s, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 py-2 text-sm">
                      <span className="font-medium text-text">@{s.username}</span>
                      <span className="text-xs text-text/50">{new Date(s.time).toLocaleString("zh-CN")}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text">活跃用户排行</h2>
              <p className="mt-1 text-sm text-text/60">近 30 天事件数最多的用户。</p>
              <div className="mt-4 divide-y divide-border">
                {userAnalytics.activeUsers.length === 0 ? (
                  <p className="py-4 text-sm text-text/60">暂无数据。</p>
                ) : (
                  userAnalytics.activeUsers.map((a, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 py-2 text-sm">
                      <span className="font-medium text-text">@{a.username}</span>
                      <Link href={`/admin?userId=${a.userId}`} className="text-xs text-accent hover:underline">
                        {a.events} 次事件 →
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="panel mt-8 p-6 md:p-7">
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <h2 className="text-lg font-semibold text-text">最近投稿</h2>
              <div className="mt-4 divide-y divide-border">
                {userAnalytics.userProjects.length === 0 ? (
                  <p className="py-4 text-sm text-text/60">暂无投稿。</p>
                ) : (
                  userAnalytics.userProjects.map((p, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 py-2 text-sm">
                      <Link href={`/projects/${p.slug}`} className="truncate font-medium text-text hover:underline">{p.title}</Link>
                      <span className="shrink-0 text-xs text-text/50">@{p.author.username}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text">最近评论</h2>
              <div className="mt-4 divide-y divide-border">
                {userAnalytics.userComments.length === 0 ? (
                  <p className="py-4 text-sm text-text/60">暂无评论。</p>
                ) : (
                  userAnalytics.userComments.map((c) => (
                    <div key={c.id} className="py-2 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-text">@{c.author.username}</span>
                        <Link href={`/projects/${c.project.slug}`} className="truncate text-xs text-text/40 hover:underline">{c.project.title}</Link>
                      </div>
                      <p className="mt-1 truncate text-xs text-text/60">{c.body.slice(0, 60)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-text">最近点赞</h2>
              <div className="mt-4 divide-y divide-border">
                {userAnalytics.userLikes.length === 0 ? (
                  <p className="py-4 text-sm text-text/60">暂无点赞。</p>
                ) : (
                  userAnalytics.userLikes.map((l, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 py-2 text-sm">
                      <span className="text-xs font-medium text-text">@{l.username}</span>
                      <span className="truncate text-xs text-text/50">赞了 {l.project}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
