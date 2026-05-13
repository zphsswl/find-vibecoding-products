"use server";

import { headers } from "next/headers";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export type AnalyticsEventType =
  | "page_view"
  | "project_view"
  | "external_click"
  | "like"
  | "bookmark"
  | "sign_in"
  | "submit_project";

export async function recordAnalyticsEvent(input: {
  type: AnalyticsEventType;
  actorKey?: string | null;
  userId?: string | null;
  page?: string | null;
  projectId?: string | null;
  projectSlug?: string | null;
  referrer?: string | null;
  metadata?: Record<string, string | number | boolean | null | undefined> | null;
}) {
  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent");
  const ipAddress = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  await prisma.analyticsEvent.create({
    data: {
      actorKey:
        input.actorKey ??
        input.userId ??
        headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: input.type,
      userId: input.userId ?? null,
      page: input.page ?? null,
      projectId: input.projectId ?? null,
      projectSlug: input.projectSlug ?? null,
      referrer: input.referrer ?? null,
      userAgent,
      ipAddress,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null
    }
  });
}

export async function recordPageView(pathname: string, userId?: string | null, referrer?: string | null) {
  await recordAnalyticsEvent({
    type: "page_view",
    userId,
    page: pathname,
    referrer
  });
}

export async function recordCurrentUserPageView(pathname: string) {
  const user = await getCurrentUser();
  const headerStore = await headers();
  await recordPageView(pathname, user?.id ?? null, headerStore.get("referer"));
}

export async function getAnalyticsDashboardData() {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);
  const activeWindowStart = new Date(todayStart);
  activeWindowStart.setDate(activeWindowStart.getDate() - 29);

  const [
    totalEvents,
    todayEvents,
    weekEvents,
    pageViews,
    projectViews,
    externalClicks,
    signIns,
    submissions,
    likeEvents,
    bookmarkEvents,
    topProjects,
    sourcePages,
    dailySeries
  ] = await Promise.all([
    prisma.analyticsEvent.count(),
    prisma.analyticsEvent.count({ where: { createdAt: { gte: todayStart }, type: "page_view" } }),
    prisma.analyticsEvent.count({ where: { createdAt: { gte: weekStart }, type: "page_view" } }),
    prisma.analyticsEvent.count({ where: { type: "page_view" } }),
    prisma.analyticsEvent.count({ where: { type: "project_view" } }),
    prisma.analyticsEvent.count({ where: { type: "external_click" } }),
    prisma.analyticsEvent.count({ where: { type: "sign_in" } }),
    prisma.analyticsEvent.count({ where: { type: "submit_project" } }),
    prisma.analyticsEvent.count({ where: { type: "like" } }),
    prisma.analyticsEvent.count({ where: { type: "bookmark" } }),
    prisma.project.findMany({
      orderBy: [{ hotScore: "desc" }, { viewCount: "desc" }],
      take: 8,
      select: {
        slug: true,
        title: true,
        status: true,
        viewCount: true,
        externalClickCount: true,
        likeCount: true,
        bookmarkCount: true,
        commentCount: true
      }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["referrer"],
      where: {
        createdAt: { gte: activeWindowStart },
        type: "page_view"
      },
      _count: { referrer: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 8
    }),
    prisma.$queryRaw<
      Array<{ day: string; pageViews: number; projectViews: number; externalClicks: number; signIns: number; submissions: number }>
    >`
      SELECT
        date("createdAt") as day,
        SUM(CASE WHEN type = 'page_view' THEN 1 ELSE 0 END) as pageViews,
        SUM(CASE WHEN type = 'project_view' THEN 1 ELSE 0 END) as projectViews,
        SUM(CASE WHEN type = 'external_click' THEN 1 ELSE 0 END) as externalClicks,
        SUM(CASE WHEN type = 'sign_in' THEN 1 ELSE 0 END) as signIns,
        SUM(CASE WHEN type = 'submit_project' THEN 1 ELSE 0 END) as submissions
      FROM "AnalyticsEvent"
      WHERE "createdAt" >= ${activeWindowStart}
      GROUP BY date("createdAt")
      ORDER BY day ASC
    `
  ]);

  const formattedDailySeries = dailySeries.map((d) => ({
    ...d,
    day: typeof d.day === "string" ? d.day : new Date(d.day).toISOString().slice(0, 10)
  }));

  const uniqueVisitors = await prisma.analyticsEvent.findMany({
    where: {
      createdAt: { gte: activeWindowStart }
    },
    distinct: ["actorKey"],
    select: { actorKey: true }
  });

  return {
    totalEvents,
    todayEvents,
    weekEvents,
    activeUsers30d: uniqueVisitors.length,
    funnels: {
      pageViews,
      projectViews,
      externalClicks,
      signIns,
      submissions,
      likes: likeEvents,
      bookmarks: bookmarkEvents
    },
    topProjects,
    sourcePages,
    dailySeries: formattedDailySeries
  };
}

export type AnalyticsFilters = {
  from?: string;
  to?: string;
  type?: AnalyticsEventType | "all";
  source?: string;
  query?: string;
  status?: string;
  userId?: string;
};

export async function getAnalyticsFilteredData(filters: AnalyticsFilters = {}) {
  const where: Prisma.AnalyticsEventWhereInput = {};

  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = new Date(filters.from);
    if (filters.to) {
      const toDate = new Date(filters.to);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = toDate;
    }
  }

  if (filters.type && filters.type !== "all") {
    where.type = filters.type;
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.source) {
    where.referrer = { contains: filters.source };
  }

  if (filters.query) {
    where.OR = [
      { page: { contains: filters.query } },
      { projectSlug: { contains: filters.query } },
      { referrer: { contains: filters.query } }
    ];
  }

  const [events, countsByType, topPages, topReferrers, topProjects] = await Promise.all([
    prisma.analyticsEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: { select: { username: true, displayName: true } } }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["type"],
      where,
      _count: { type: true },
      orderBy: { _count: { type: "desc" } }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["page"],
      where,
      _count: { page: true },
      orderBy: { _count: { page: "desc" } },
      take: 10
    }),
    prisma.analyticsEvent.groupBy({
      by: ["referrer"],
      where,
      _count: { referrer: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 10
    }),
    prisma.project.findMany({
      where: {
        ...(filters.status && filters.status !== "all" ? { status: filters.status } : {})
      },
      orderBy: [{ hotScore: "desc" }, { viewCount: "desc" }],
      take: 10,
      select: {
        slug: true,
        title: true,
        status: true,
        viewCount: true,
        externalClickCount: true,
        likeCount: true,
        bookmarkCount: true,
        commentCount: true
      }
    })
  ]);

  return {
    events,
    countsByType,
    topPages,
    topReferrers,
    topProjects
  };
}

export async function getUserAnalytics() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [users, signIns, activeUsers, userProjects, userComments, userLikes] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        username: true,
        displayName: true,
        role: true,
        createdAt: true,
        _count: { select: { projects: true, comments: true } }
      }
    }),
    prisma.analyticsEvent.findMany({
      where: { type: "sign_in", createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { userId: true, createdAt: true, metadata: true }
    }),
    prisma.analyticsEvent.groupBy({
      by: ["userId"],
      where: { userId: { not: null }, createdAt: { gte: thirtyDaysAgo } },
      _count: { userId: true },
      orderBy: { _count: { userId: "desc" } },
      take: 10
    }),
    prisma.project.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { title: true, slug: true, author: { select: { username: true } }, createdAt: true, status: true }
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, body: true, createdAt: true, author: { select: { username: true } }, project: { select: { slug: true, title: true } } }
    }),
    prisma.vote.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { createdAt: true, user: { select: { username: true } }, project: { select: { slug: true, title: true } } }
    })
  ]);

  // Match sign-in events with usernames
  const signInsWithUsernames = signIns.map((s) => {
    const u = users.find((usr) => usr.id === s.userId);
    return { username: u?.username ?? "unknown", time: s.createdAt };
  });

  // Match active users with usernames
  const activeUsersWithNames = activeUsers
    .filter((a) => a.userId)
    .map((a) => {
      const u = users.find((usr) => usr.id === a.userId);
      return { userId: a.userId!, username: u?.username ?? "unknown", events: a._count.userId };
    });

  return {
    users,
    signIns: signInsWithUsernames,
    activeUsers: activeUsersWithNames,
    userProjects,
    userComments,
    userLikes: userLikes.map((l) => ({
      username: l.user.username,
      project: l.project.title,
      slug: l.project.slug,
      time: l.createdAt
    }))
  };
}
