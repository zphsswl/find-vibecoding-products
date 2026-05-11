import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";

export type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  purpose: string;
  howToUse: string;
  tags: string[];
  category: string;
  tech: string[];
  author: string;
  likes: number;
  comments: number;
  bookmarks: number;
  status: "\u7cbe\u9009" | "\u6700\u65b0";
  moderationStatus: string;
  image: string;
  url: string;
  sourceUrl: string | null;
};

export type CommunityStats = {
  followers: number;
  following: number;
  likesReceived: number;
  bookmarksReceived: number;
};

export type ProjectDetailData = ProjectCardData & {
  id: string;
  description: string;
  buildNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  githubStars: number | null;
  githubStarsCheckedAt: Date | null;
  authorDisplayName: string;
  authorAvatarUrl: string | null;
  authorAvatarPreset: string | null;
  commentList: Array<{
    id: string;
    body: string;
    author: string;
    authorDisplayName: string;
    authorAvatarUrl: string | null;
    authorAvatarPreset: string | null;
    createdAt: Date;
    parentId: string | null;
    replies: Array<{
      id: string;
      body: string;
      author: string;
      authorDisplayName: string;
      authorAvatarUrl: string | null;
      authorAvatarPreset: string | null;
      createdAt: Date;
    }>;
  }>;
};

type ProjectQueryOptions = {
  category?: string;
  author?: string;
  featuredOnly?: boolean;
  limit?: number;
  search?: string;
  sort?: "hot" | "latest" | "bookmarks" | "comments";
  tag?: string;
  tech?: string;
};

async function getProjectListRecords(options?: ProjectQueryOptions) {
  const orderBy =
    options?.sort === "latest"
      ? [{ createdAt: "desc" as const }]
      : options?.sort === "bookmarks"
        ? [{ bookmarkCount: "desc" as const }, { hotScore: "desc" as const }]
        : options?.sort === "comments"
          ? [{ commentCount: "desc" as const }, { hotScore: "desc" as const }]
          : [{ hotScore: "desc" as const }, { createdAt: "desc" as const }];

  const projects = await prisma.project.findMany({
    where: {
      status: "approved",
      isFeatured: options?.featuredOnly ? true : undefined,
      category: options?.category ? { name: options.category } : undefined,
      author: options?.author ? { username: options.author } : undefined,
      projectTags: options?.tag ? { some: { tag: { name: options.tag } } } : undefined,
      projectTechStacks: options?.tech
        ? { some: { techStack: { name: options.tech } } }
        : undefined
    },
    include: {
      author: true,
      category: true,
      projectTags: { include: { tag: true } },
      projectTechStacks: { include: { techStack: true } }
    },
    orderBy,
    take: options?.limit
  });

  if (!options?.search) {
    return projects;
  }

  const query = options.search.trim().toLowerCase();
  if (!query) {
    return projects;
  }

  return projects.filter((project) => {
    const haystacks = [
      project.title,
      project.summary,
      project.purpose,
      project.howToUse,
      project.category.name,
      ...project.projectTags.map((item) => item.tag.name),
      ...project.projectTechStacks.map((item) => item.techStack.name)
    ]
      .join(" ")
      .toLowerCase();

    return haystacks.includes(query);
  });
}

async function getProjectRecord(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      author: true,
      category: true,
      projectTags: { include: { tag: true } },
      projectTechStacks: { include: { techStack: true } },
      comments: {
        where: { status: "visible" },
        include: { author: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });
}

type ProjectListRecord = Awaited<ReturnType<typeof getProjectListRecords>>[number];

function statusLabel(project: { isFeatured: boolean }) {
  if (project.isFeatured) return "\u7cbe\u9009";
  return "\u6700\u65b0";
}

function mapProject(project: ProjectListRecord): ProjectCardData {
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    purpose: project.purpose,
    howToUse: project.howToUse,
    tags: project.projectTags.map((item) => item.tag.name),
    category: project.category.name,
    tech: project.projectTechStacks.map((item) => item.techStack.name),
    author: project.author.username,
    likes: project.likeCount,
    comments: project.commentCount,
    bookmarks: project.bookmarkCount,
    status: statusLabel(project),
    moderationStatus: project.status,
    image: project.coverImageUrl,
    url: project.projectUrl,
    sourceUrl: project.sourceUrl
  };
}

export async function getCategoryNames() {
  const categories = await prisma.category.findMany({
    where: {
      projects: {
        some: {
          status: "approved"
        }
      }
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });

  return categories.map((category) => category.name);
}

export async function getTechStackNames() {
  const techStacks = await prisma.techStack.findMany({
    where: {
      projectTechStacks: {
        some: {
          project: {
            status: "approved"
          }
        }
      }
    },
    orderBy: { name: "asc" }
  });

  return techStacks.map((techStack) => techStack.name);
}

export async function getTagNames() {
  const tags = await prisma.tag.findMany({
    where: {
      projectTags: {
        some: {
          project: {
            status: "approved"
          }
        }
      }
    },
    orderBy: { name: "asc" }
  });

  return tags.map((tag) => tag.name);
}

export async function getProjectCards(options?: ProjectQueryOptions) {
  const projects = await getProjectListRecords(options);
  return projects.map(mapProject);
}

export async function getBookmarkedProjectCards(username: string, options?: Omit<ProjectQueryOptions, "author">) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      bookmarks: {
        orderBy: { createdAt: "desc" },
        take: options?.limit,
        include: {
          project: {
            include: {
              author: true,
              category: true,
              projectTags: { include: { tag: true } },
              projectTechStacks: { include: { techStack: true } }
            }
          }
        }
      }
    }
  });

  return (
    user?.bookmarks
      .map((bookmark) => bookmark.project)
      .filter((project) => project.status === "approved")
      .map(mapProject) ?? []
  );
}

export async function getUserProfileData(username: string, viewerUsername?: string | null) {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) return null;

  const viewer = viewerUsername ? await prisma.user.findUnique({ where: { username: viewerUsername } }) : null;

  const [approvedCount, pendingCount, bookmarkCount, commentCount, likesReceived, bookmarksReceived, followers, following, follow] =
    await Promise.all([
      prisma.project.count({ where: { authorId: user.id, status: "approved" } }),
      prisma.project.count({ where: { authorId: user.id, status: { in: ["pending", "changes_requested"] } } }),
      prisma.bookmark.count({ where: { userId: user.id } }),
      prisma.comment.count({ where: { authorId: user.id } }),
      prisma.project.aggregate({
        where: { authorId: user.id, status: "approved" },
        _sum: { likeCount: true }
      }),
      prisma.project.aggregate({
        where: { authorId: user.id, status: "approved" },
        _sum: { bookmarkCount: true }
      }),
      prisma.follow.count({ where: { followingId: user.id } }),
      prisma.follow.count({ where: { followerId: user.id } }),
      viewer
        ? prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: viewer.id,
                followingId: user.id
              }
            }
          })
        : null
    ]);

  return {
    user,
    approvedCount,
    pendingCount,
    bookmarkCount,
    commentCount,
    followerCount: followers,
    followingCount: following,
    likedCount: likesReceived._sum.likeCount ?? 0,
    bookmarkedCount: bookmarksReceived._sum.bookmarkCount ?? 0,
    isFollowedByCurrentUser: Boolean(follow),
    communityStats: {
      followers,
      following,
      likesReceived: likesReceived._sum.likeCount ?? 0,
      bookmarksReceived: bookmarksReceived._sum.bookmarkCount ?? 0
    }
  };
}

export async function getProjectDetail(
  slug: string,
  viewer?: { username: string; role: string } | null
): Promise<ProjectDetailData | null> {
  const project = await getProjectRecord(slug);

  if (!project) return null;
  if (project.status !== "approved") {
    const canView = viewer?.role === "admin" || viewer?.username === project.author.username;
    if (!canView) {
      return null;
    }
  }
  const githubSnapshot = await getGithubSnapshot(project.sourceUrl ?? project.projectUrl);

  return {
    id: project.id,
    ...mapProject(project),
    description: project.description,
    buildNotes: project.buildNotes,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    githubStars: githubSnapshot?.stars ?? null,
    githubStarsCheckedAt: githubSnapshot?.checkedAt ?? null,
    authorDisplayName: project.author.displayName,
    authorAvatarUrl: project.author.avatarUrl,
    authorAvatarPreset: project.author.avatarPreset,
    commentList: project.comments
      .filter((c) => !c.parentId)
      .map((comment) => ({
        id: comment.id,
        body: comment.body,
        author: comment.author.username,
        authorDisplayName: comment.author.displayName,
        authorAvatarUrl: comment.author.avatarUrl,
        authorAvatarPreset: comment.author.avatarPreset,
        createdAt: comment.createdAt,
        parentId: comment.parentId as string | null,
        replies: project.comments
          .filter((r) => r.parentId === comment.id)
          .map((r) => ({
            id: r.id,
            body: r.body,
            author: r.author.username,
            authorDisplayName: r.author.displayName,
            authorAvatarUrl: r.author.avatarUrl,
            authorAvatarPreset: r.author.avatarPreset,
            createdAt: r.createdAt
          }))
      }))
  };
}

export async function getProjectSlugs() {
  const projects = await prisma.project.findMany({
    select: { slug: true },
    where: { status: "approved" }
  });

  return projects.map((project) => project.slug);
}

export async function getDiscoverProjectPage(options?: ProjectQueryOptions & { page?: number; pageSize?: number }) {
  const pageSize = Math.max(1, Math.min(options?.pageSize ?? 12, 24));
  const page = Math.max(1, options?.page ?? 1);

  const projects = await getProjectListRecords({
    category: options?.category,
    author: options?.author,
    featuredOnly: options?.featuredOnly,
    limit: undefined,
    search: options?.search,
    sort: options?.sort,
    tag: options?.tag,
    tech: options?.tech
  });

  const totalCount = projects.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    projects: projects.slice(start, start + pageSize).map(mapProject),
    totalCount,
    page: currentPage,
    pageSize,
    totalPages
  };
}

type GithubSnapshot = {
  stars: number;
  checkedAt: Date;
};

const githubSnapshotFiles = [
  "tmp-github-vibe.json",
  "tmp-github-ai-design-agent.json",
  "tmp-github-ai-app-builder.json"
];

async function getGithubSnapshot(url?: string | null): Promise<GithubSnapshot | null> {
  const repo = parseGithubRepo(url);
  if (!repo) return null;

  for (const file of githubSnapshotFiles) {
    const filePath = path.join(process.cwd(), file);
    const snapshot = await findGithubRepoSnapshot(filePath, repo);
    if (snapshot) return snapshot;
  }

  return null;
}

async function findGithubRepoSnapshot(filePath: string, repo: string): Promise<GithubSnapshot | null> {
  try {
    const [content, fileStat] = await Promise.all([readFile(filePath), stat(filePath)]);
    const payload = JSON.parse(decodeJsonFile(content));
    const items = Array.isArray(payload) ? payload : Array.isArray(payload.items) ? payload.items : [];
    const match = items.find((item: unknown) => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as { full_name?: unknown; html_url?: unknown };
      return (
        candidate.full_name === repo ||
        (typeof candidate.html_url === "string" && parseGithubRepo(candidate.html_url) === repo)
      );
    }) as { stargazers_count?: unknown } | undefined;

    if (typeof match?.stargazers_count !== "number") return null;

    return {
      stars: match.stargazers_count,
      checkedAt: fileStat.mtime
    };
  } catch {
    return null;
  }
}

function decodeJsonFile(content: Buffer) {
  if (content[0] === 0xff && content[1] === 0xfe) {
    return content.toString("utf16le").replace(/^\uFEFF/, "");
  }

  if (content[0] === 0xfe && content[1] === 0xff) {
    return Buffer.from(content.subarray(2).swap16()).toString("utf16le");
  }

  return content.toString("utf8").replace(/^\uFEFF/, "");
}

function parseGithubRepo(url?: string | null) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (!/(^|\.)github\.com$/i.test(parsed.hostname)) return null;
    const [owner, repo] = parsed.pathname.split("/").filter(Boolean);
    if (!owner || !repo) return null;
    return `${owner}/${repo.replace(/\.git$/, "")}`;
  } catch {
    return null;
  }
}
