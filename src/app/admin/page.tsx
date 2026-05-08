import Link from "next/link";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return (
      <main className="page-band">
        <div className="page-shell mx-auto max-w-3xl">
          <span className="page-kicker">Admin</span>
          <h1 className="mt-4 text-4xl font-semibold text-text">管理后台</h1>
          <div className="panel mt-8 p-6">
            <p className="text-sm text-text/70">需要管理员身份。请使用 `admin` 登录。</p>
            <Link href="/auth/sign-in" className="btn-primary mt-4">
              去登录
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const [approvedCount, pendingCount, commentCount, reportCount, latestProjects, reports] = await Promise.all([
    prisma.project.count({ where: { status: "approved" } }),
    prisma.project.count({ where: { status: "pending" } }),
    prisma.comment.count(),
    prisma.report.count({ where: { status: "open" } }),
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { author: true, category: true }
    }),
    prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { project: true }
    })
  ]);

  return (
    <main className="page-band">
      <div className="page-shell">
        <span className="page-kicker">Admin</span>
        <h1 className="mt-4 text-4xl font-semibold text-text">管理后台</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            ["已发布", approvedCount],
            ["待审核", pendingCount],
            ["评论", commentCount],
            ["举报", reportCount]
          ].map(([label, value]) => (
            <div key={label} className="panel p-5">
              <p className="text-sm text-text/50">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-text">{value}</p>
            </div>
          ))}
        </div>

        <section className="panel mt-8 p-6">
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

        <section className="panel mt-8 p-6">
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
