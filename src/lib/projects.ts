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
  image: string;
  url: string;
  sourceUrl: string | null;
};

export type ProjectDetailData = ProjectCardData & {
  description: string;
  buildNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  githubStars: number | null;
  githubStarsCheckedAt: Date | null;
  commentList: Array<{
    id: string;
    body: string;
    author: string;
    createdAt: Date;
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

export async function getProjectDetail(slug: string): Promise<ProjectDetailData | null> {
  const project = await getProjectRecord(slug);

  if (!project) return null;
  const githubSnapshot = await getGithubSnapshot(project.sourceUrl ?? project.projectUrl);

  return {
    ...mapProject(project),
    description: project.description,
    buildNotes: project.buildNotes,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    githubStars: githubSnapshot?.stars ?? null,
    githubStarsCheckedAt: githubSnapshot?.checkedAt ?? null,
    commentList: project.comments.map((comment) => ({
      id: comment.id,
      body: comment.body,
      author: comment.author.username,
      createdAt: comment.createdAt
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
