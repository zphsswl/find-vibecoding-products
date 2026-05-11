import { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";

const prisma = new PrismaClient();

const PASSWORD_PEPPER = process.env.PASSWORD_PEPPER ?? "local-vcg-password-pepper";
const defaultPassword = createHash("sha256").update(`${PASSWORD_PEPPER}:password123`).digest("hex");

const categories = [
  ["landing", "\u5b98\u7f51"],
  ["tool", "\u5de5\u5177"],
  ["saas", "SaaS"],
  ["plugin", "\u63d2\u4ef6"],
  ["game", "\u5c0f\u6e38\u620f"],
  ["experiment", "\u5b9e\u9a8c"],
  ["portfolio", "\u4f5c\u54c1\u96c6"],
  ["data-viz", "\u6570\u636e\u53ef\u89c6\u5316"]
];

const projects = [
  {
    slug: "ai-landing-builder",
    title: "AI Landing Builder",
    summary: "\u8f93\u5165\u4e00\u53e5\u8bdd\u5c31\u80fd\u751f\u6210\u9ad8\u8f6c\u5316\u843d\u5730\u9875\u3002",
    description: "\u4e00\u4e2a\u9762\u5411\u72ec\u7acb\u521b\u4f5c\u8005\u7684 landing page \u751f\u6210\u5668\u3002",
    purpose: "\u5e2e\u52a9\u72ec\u7acb\u521b\u4f5c\u8005\u5feb\u901f\u505a\u4ea7\u54c1\u5ba3\u4f20\u9875\u3002",
    howToUse: "\u8f93\u5165\u4ea7\u54c1\u540d\u79f0\u3001\u5356\u70b9\u548c\u53d7\u4f17\uff0c\u81ea\u52a8\u751f\u6210\u9875\u9762\u6587\u6848\u548c\u5e03\u5c40\u3002",
    category: "landing",
    tags: ["AI", "\u843d\u5730\u9875", "\u589e\u957f"],
    tech: ["Next.js", "Tailwind", "OpenAI"],
    author: "ming",
    coverImageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    likeCount: 128,
    commentCount: 2,
    bookmarkCount: 46,
    hotScore: 912,
    isFeatured: true
  },
  {
    slug: "focus-commit",
    title: "Focus Commit",
    summary: "\u628a\u5f85\u529e\u53d8\u6210\u6709\u8282\u594f\u7684\u4e13\u6ce8\u5de5\u4f5c\u6d41\u3002",
    description: "\u4e00\u4e2a\u8f7b\u91cf\u7684\u4e13\u6ce8\u4efb\u52a1\u5de5\u5177\uff0c\u9002\u5408\u5355\u4eba\u521b\u4f5c\u8005\u4f7f\u7528\u3002",
    purpose: "\u63d0\u9ad8\u65e5\u5e38\u6267\u884c\u529b\u548c\u4efb\u52a1\u6536\u655b\u901f\u5ea6\u3002",
    howToUse: "\u628a\u4eca\u5929\u8981\u505a\u7684\u4e8b\u62c6\u6210 3 \u6bb5\uff0c\u8ddf\u7740\u8ba1\u65f6\u5668\u5b8c\u6210\u3002",
    category: "tool",
    tags: ["\u6548\u7387", "\u4efb\u52a1", "\u4e60\u60ef"],
    tech: ["React", "Supabase"],
    author: "lina",
    coverImageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    likeCount: 93,
    commentCount: 1,
    bookmarkCount: 31,
    hotScore: 640,
    isFeatured: false
  },
  {
    slug: "indie-playground",
    title: "Indie Playground",
    summary: "\u4e00\u4e2a\u7ed9\u521b\u4f5c\u8005\u505a\u5b9e\u9a8c\u7684\u9879\u76ee\u96c6\u5408\u9875\u3002",
    description: "\u628a vibe coding \u7684\u5b9e\u9a8c\u3001\u6e90\u7801\u548c\u6784\u5efa\u8bf4\u660e\u7edf\u4e00\u5f52\u6863\u3002",
    purpose: "vibe coding \u7684\u5b9e\u9a8c\u6027\u4f5c\u54c1\u548c\u6784\u5efa\u8fc7\u7a0b\u3002",
    howToUse: "\u6d4f\u89c8\u6848\u4f8b\uff0c\u67e5\u770b\u6280\u672f\u6808\u548c\u6784\u5efa\u8bf4\u660e\uff0c\u518d\u8df3\u8f6c\u5230\u6e90\u7801\u3002",
    category: "portfolio",
    tags: ["\u5f00\u6e90", "\u5b9e\u9a8c", "\u793e\u533a"],
    tech: ["Next.js", "MDX"],
    author: "aaron",
    coverImageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    likeCount: 64,
    commentCount: 1,
    bookmarkCount: 25,
    hotScore: 508,
    isFeatured: true
  }
];

async function main() {
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {
      password: defaultPassword,
      displayName: "Gallery Admin",
      autoDisplayName: false,
      avatarPreset: "indigo",
      bio: "\u8d1f\u8d23\u5ba1\u6838\u548c\u7cbe\u9009 vibe coding \u4f5c\u54c1\u3002"
    },
    create: {
      username: "admin",
      password: defaultPassword,
      displayName: "Gallery Admin",
      autoDisplayName: false,
      avatarPreset: "indigo",
      role: "admin",
      bio: "\u8d1f\u8d23\u5ba1\u6838\u548c\u7cbe\u9009 vibe coding \u4f5c\u54c1\u3002"
    }
  });

  for (const [slug, name] of categories) {
    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { slug, name }
    });
  }

  for (const username of ["ming", "lina", "aaron"]) {
    await prisma.user.upsert({
      where: { username },
      update: {
        password: defaultPassword,
        displayName: username[0].toUpperCase() + username.slice(1),
        autoDisplayName: false,
        avatarPreset: username === "ming" ? "amber" : username === "lina" ? "rose" : "forest",
        bio: "vibe coding \u521b\u4f5c\u8005"
      },
      create: {
        username,
        password: defaultPassword,
        displayName: username[0].toUpperCase() + username.slice(1),
        autoDisplayName: false,
        avatarPreset: username === "ming" ? "amber" : username === "lina" ? "rose" : "forest",
        bio: "vibe coding \u521b\u4f5c\u8005"
      }
    });
  }

  await prisma.follow.deleteMany();

  const followPairs = [
    ["admin", "ming"],
    ["ming", "lina"],
    ["ming", "aaron"],
    ["lina", "ming"],
    ["aaron", "ming"]
  ];

  for (const [followerUsername, followingUsername] of followPairs) {
    const follower = await prisma.user.findUniqueOrThrow({ where: { username: followerUsername } });
    const following = await prisma.user.findUniqueOrThrow({ where: { username: followingUsername } });

    await prisma.follow.create({
      data: {
        followerId: follower.id,
        followingId: following.id
      }
    });
  }

  for (const item of projects) {
    const author = await prisma.user.findUniqueOrThrow({ where: { username: item.author } });
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: item.category } });

    const project = await prisma.project.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        summary: item.summary,
        description: item.description,
        purpose: item.purpose,
        howToUse: item.howToUse,
        coverImageUrl: item.coverImageUrl,
        status: "approved",
        likeCount: 0,
        bookmarkCount: 0,
        commentCount: 0,
        hotScore: item.hotScore,
        isFeatured: item.isFeatured,
        approvedAt: new Date()
      },
      create: {
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        description: item.description,
        purpose: item.purpose,
        howToUse: item.howToUse,
        projectUrl: "https://example.com",
        coverImageUrl: item.coverImageUrl,
        status: "approved",
        difficulty: "beginner",
        isOpenSource: true,
        isFeatured: item.isFeatured,
        likeCount: 0,
        bookmarkCount: 0,
        commentCount: 0,
        hotScore: item.hotScore,
        submittedAt: new Date(),
        approvedAt: new Date(),
        authorId: author.id,
        categoryId: category.id
      }
    });

    await prisma.projectTag.deleteMany({ where: { projectId: project.id } });
    await prisma.projectTechStack.deleteMany({ where: { projectId: project.id } });

    for (const tagName of item.tags) {
      const slug = tagName.toLowerCase().replace(/\s+/g, "-");
      const tag = await prisma.tag.upsert({
        where: { slug },
        update: { name: tagName },
        create: { slug, name: tagName }
      });
      await prisma.projectTag.upsert({
        where: { projectId_tagId: { projectId: project.id, tagId: tag.id } },
        update: {},
        create: { projectId: project.id, tagId: tag.id }
      });
    }

    for (const techName of item.tech) {
      const slug = techName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const tech = await prisma.techStack.upsert({
        where: { slug },
        update: { name: techName },
        create: { slug, name: techName }
      });
      await prisma.projectTechStack.upsert({
        where: { projectId_techStackId: { projectId: project.id, techStackId: tech.id } },
        update: {},
        create: { projectId: project.id, techStackId: tech.id }
      });
    }

    await prisma.comment.deleteMany({ where: { id: `${project.slug}-comment-1` } });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
