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
        date(createdAt) as day,
        SUM(CASE WHEN type = 'page_view' THEN 1 ELSE 0 END) as pageViews,
        SUM(CASE WHEN type = 'project_view' THEN 1 ELSE 0 END) as projectViews,
        SUM(CASE WHEN type = 'external_click' THEN 1 ELSE 0 END) as externalClicks,
        SUM(CASE WHEN type = 'sign_in' THEN 1 ELSE 0 END) as signIns,
        SUM(CASE WHEN type = 'submit_project' THEN 1 ELSE 0 END) as submissions
      FROM AnalyticsEvent
      WHERE createdAt >= ${activeWindowStart.toISOString()}
      GROUP BY date(createdAt)
      ORDER BY day ASC
    `
  ]);

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
    dailySeries
  };
}

export type AnalyticsFilters = {
  from?: string;
  to?: string;
  type?: AnalyticsEventType | "all";
  source?: string;
  query?: string;
  status?: string;
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
      take: 100
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
