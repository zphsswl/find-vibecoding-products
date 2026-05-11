import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

type AnalyticsPayload = {
  type: string;
  visitorId?: string | null;
  page?: string | null;
  projectSlug?: string | null;
  projectId?: string | null;
  referrer?: string | null;
};

export async function POST(req: Request) {
  const body = (await req.json()) as AnalyticsPayload;
  if (!body?.type) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const currentUser = await getCurrentUser();
  const userAgent = req.headers.get("user-agent");
  const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const actorKey = currentUser?.id ?? body.visitorId ?? body.projectSlug ?? `${Date.now()}`;

  await prisma.analyticsEvent.create({
    data: {
      type: body.type,
      actorKey,
      userId: currentUser?.id ?? null,
      visitorId: body.visitorId ?? null,
      page: body.page ?? null,
      projectSlug: body.projectSlug ?? null,
      projectId: body.projectId ?? null,
      referrer: body.referrer ?? null,
      userAgent,
      ipAddress
    }
  });

  return NextResponse.json({ ok: true });
}
