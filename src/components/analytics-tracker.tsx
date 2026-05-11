"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "vcg_visitor_id";

type AnalyticsEvent = {
  type: "page_view" | "project_view" | "external_click";
  page?: string;
  projectSlug?: string;
  projectId?: string;
  referrer?: string;
};

function getVisitorId() {
  if (typeof window === "undefined") return null;

  const existing = window.localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(VISITOR_KEY, id);
  return id;
}

async function sendAnalyticsEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;

  const payload = {
    ...event,
    visitorId: getVisitorId(),
    referrer: event.referrer ?? document.referrer ?? null
  };

  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    });
  } catch {
    // best effort only
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastPath.current === pathname) return;
    lastPath.current = pathname;
    sendAnalyticsEvent({ type: "page_view", page: pathname });
  }, [pathname]);

  return null;
}

export function ProjectViewTracker({ slug, projectId }: { slug: string; projectId?: string }) {
  useEffect(() => {
    sendAnalyticsEvent({
      type: "project_view",
      page: `/projects/${slug}`,
      projectSlug: slug,
      projectId
    });
  }, [projectId, slug]);

  return null;
}

export function TrackedExternalLink({
  href,
  projectSlug,
  projectId,
  className,
  children
}: {
  href: string;
  projectSlug: string;
  projectId?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        void sendAnalyticsEvent({
          type: "external_click",
          page: `/projects/${projectSlug}`,
          projectSlug,
          projectId
        });
      }}
    >
      {children}
    </a>
  );
}
