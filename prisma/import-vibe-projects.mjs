import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const author = {
  username: "curator",
  displayName: "Vibe Curator",
  bio: "整理来自 Product Hunt、GitHub 等公开来源的 vibe coding 项目。"
};

const categories = [
  ["ai-design", "AI 设计"],
  ["app-builder", "应用生成"],
  ["agent-tools", "智能体工具"],
  ["dev-workflow", "开发工作流"],
  ["learning", "学习资源"],
  ["showcase", "作品展示"]
];

const projects = [
  {
    slug: "flowstep",
    title: "Flowstep",
    summary: "AI design engineer，面向真实 UI 的设计与交付工具。",
    description:
      "Flowstep 来自 Product Hunt 的 vibe-coding 分类，定位为可以设计并交付真实 UI 的 AI design engineer，适合作为有审美项目的设计生成类入口。",
    purpose: "用 AI 把产品想法转成更成熟的界面方案，减少从概念到可交付 UI 的距离。",
    howToUse: "从 Product Hunt 页面进入产品，查看演示和官网，再用它生成或迭代页面设计。",
    buildNotes: "来源：Product Hunt vibe-coding 分类。封面使用 Product Hunt 产品页 OpenGraph 图。",
    category: "ai-design",
    tags: ["AI 设计", "UI", "Product Hunt", "Vibe Coding"],
    tech: ["AI", "Design Agent"],
    projectUrl: "https://www.producthunt.com/products/flowstep",
    sourceUrl: "https://www.producthunt.com/products/flowstep",
    coverImageUrl: "https://api.microlink.io/?url=https%3A%2F%2Fwww.producthunt.com%2Fproducts%2Fflowstep&screenshot=true&meta=false&embed=screenshot.url",
    likeCount: 156,
    commentCount: 8,
    bookmarkCount: 42,
    hotScore: 980,
    isFeatured: true
  },
  {
    slug: "magic-patterns-agent-2",
    title: "Magic Patterns Agent 2.0",
    summary: "从想法到生产界面的 AI design agent。",
    description:
      "Magic Patterns Agent 2.0 是 Product Hunt vibe-coding 分类里的高相关项目，主打把想法快速转成可用的产品界面和前端实现。",
    purpose: "帮助创作者把早期产品想法转成更可见、更可评审的界面原型。",
    howToUse: "打开 Product Hunt 发布页，查看产品演示，再进入官网体验 AI 生成界面的流程。",
    buildNotes: "来源：Product Hunt vibe-coding 分类。封面使用发布页截图服务。",
    category: "ai-design",
    tags: ["AI 设计", "原型", "前端", "Product Hunt"],
    tech: ["AI", "React", "Design Agent"],
    projectUrl: "https://www.producthunt.com/products/magicpatterns/launches/magic-patterns-agent-2-0",
    sourceUrl: "https://www.producthunt.com/products/magicpatterns/launches/magic-patterns-agent-2-0",
    coverImageUrl: "https://api.microlink.io/?url=https%3A%2F%2Fwww.producthunt.com%2Fproducts%2Fmagicpatterns%2Flaunches%2Fmagic-patterns-agent-2-0&screenshot=true&meta=false&embed=screenshot.url",
    likeCount: 142,
    commentCount: 11,
    bookmarkCount: 39,
    hotScore: 950,
    isFeatured: true
  },
  {
    slug: "rapidnative",
    title: "RapidNative",
    summary: "能生成完整移动应用的 AI app builder。",
    description:
      "RapidNative 来自 Product Hunt vibe-coding 分类，主张 AI 直接构建完整应用，适合放入应用生成类项目。",
    purpose: "让非传统开发流程也能快速得到完整应用雏形，适合验证移动产品想法。",
    howToUse: "从发布页进入产品，输入应用需求，观察它生成完整 app 的流程和结果。",
    buildNotes: "来源：Product Hunt vibe-coding 分类。",
    category: "app-builder",
    tags: ["App Builder", "移动应用", "AI", "Product Hunt"],
    tech: ["AI", "Mobile"],
    projectUrl: "https://www.producthunt.com/products/rapidnative/launches/rapidnative-2",
    sourceUrl: "https://www.producthunt.com/products/rapidnative/launches/rapidnative-2",
    coverImageUrl: "https://api.microlink.io/?url=https%3A%2F%2Fwww.producthunt.com%2Fproducts%2Frapidnative%2Flaunches%2Frapidnative-2&screenshot=true&meta=false&embed=screenshot.url",
    likeCount: 121,
    commentCount: 7,
    bookmarkCount: 33,
    hotScore: 910,
    isFeatured: true
  },
  {
    slug: "macaly-4",
    title: "Macaly 4.0",
    summary: "通过聊天交付完整网站和应用。",
    description:
      "Macaly 4.0 的发布语是从聊天中交付完整网站和应用，属于典型 vibe coding 产品形态。",
    purpose: "把自然语言需求转成完整网站或应用，适合快速做产品页面、工具和 MVP。",
    howToUse: "进入 Product Hunt 发布页，查看产品说明和官网入口，用聊天描述需求进行构建。",
    buildNotes: "来源：Product Hunt vibe-coding 分类。",
    category: "app-builder",
    tags: ["网站生成", "MVP", "聊天构建", "Product Hunt"],
    tech: ["AI", "Web App"],
    projectUrl: "https://www.producthunt.com/products/macaly/launches/macaly-4-0",
    sourceUrl: "https://www.producthunt.com/products/macaly/launches/macaly-4-0",
    coverImageUrl: "https://api.microlink.io/?url=https%3A%2F%2Fwww.producthunt.com%2Fproducts%2Fmacaly%2Flaunches%2Fmacaly-4-0&screenshot=true&meta=false&embed=screenshot.url",
    likeCount: 118,
    commentCount: 6,
    bookmarkCount: 35,
    hotScore: 900,
    isFeatured: true
  },
  {
    slug: "dyad",
    title: "Dyad",
    summary: "本地优先、开源的 AI app builder，定位 v0 / Lovable / Bolt 替代品。",
    description:
      "Dyad 是 GitHub 上高星的开源 AI app builder，强调本地运行和面向 power users 的应用生成体验。",
    purpose: "给想要本地掌控代码和数据的创作者提供开源应用生成工作台。",
    howToUse: "访问 GitHub 仓库或官网 dyad.sh，根据 README 安装并启动本地构建环境。",
    buildNotes: "来源：GitHub API 搜索 AI app builder。封面使用 GitHub OpenGraph 仓库图。",
    category: "app-builder",
    tags: ["开源", "本地优先", "AI App Builder", "GitHub"],
    tech: ["TypeScript", "AI", "Local-first"],
    projectUrl: "https://dyad.sh",
    sourceUrl: "https://github.com/dyad-sh/dyad",
    coverImageUrl: "https://opengraph.githubassets.com/vibegallery/dyad-sh/dyad",
    likeCount: 520,
    commentCount: 24,
    bookmarkCount: 180,
    hotScore: 1250,
    isFeatured: true
  },
  {
    slug: "vibe-kanban",
    title: "Vibe Kanban",
    summary: "管理 Claude Code、Codex 等 coding agent 的可视化看板。",
    description:
      "Vibe Kanban 是 BloopAI 开源项目，用看板方式组织 AI coding agent 的任务和产出，适合长时间、多任务 vibe coding 工作流。",
    purpose: "让多个 AI coding agent 的任务拆分、状态和产物更可见，降低并行构建的混乱。",
    howToUse: "访问官网或 GitHub，根据 README 启动服务，把 coding agent 任务放入看板管理。",
    buildNotes: "来源：GitHub API 搜索 vibe coding。封面使用 GitHub OpenGraph 仓库图。",
    category: "agent-tools",
    tags: ["Agent", "看板", "Claude Code", "Codex"],
    tech: ["TypeScript", "AI Agent"],
    projectUrl: "https://www.vibekanban.com/",
    sourceUrl: "https://github.com/BloopAI/vibe-kanban",
    coverImageUrl: "https://opengraph.githubassets.com/vibegallery/BloopAI/vibe-kanban",
    likeCount: 640,
    commentCount: 31,
    bookmarkCount: 210,
    hotScore: 1300,
    isFeatured: true
  },
  {
    slug: "cloudflare-vibesdk",
    title: "Cloudflare VibeSDK",
    summary: "基于 Cloudflare 技术栈搭建自己的 vibe-coding 平台。",
    description:
      "Cloudflare VibeSDK 是开源 vibe coding 平台模板，帮助团队用 Cloudflare stack 构建自己的 AI coding 平台。",
    purpose: "为想自建 vibe coding 平台的团队提供基础架构和示例。",
    howToUse: "访问 build.cloudflare.dev 或 GitHub 仓库，按文档部署到 Cloudflare。",
    buildNotes: "来源：GitHub API 搜索 vibe coding。封面使用 GitHub OpenGraph 仓库图。",
    category: "dev-workflow",
    tags: ["Cloudflare", "平台", "开源", "Vibe Coding"],
    tech: ["Cloudflare", "TypeScript"],
    projectUrl: "https://build.cloudflare.dev",
    sourceUrl: "https://github.com/cloudflare/vibesdk",
    coverImageUrl: "https://opengraph.githubassets.com/vibegallery/cloudflare/vibesdk",
    likeCount: 430,
    commentCount: 18,
    bookmarkCount: 146,
    hotScore: 1160,
    isFeatured: true
  },
  {
    slug: "refly",
    title: "Refly",
    summary: "开源 agent skills builder，把技能工作流交给 Claude Code、Cursor、Codex 等工具运行。",
    description:
      "Refly 是开源 agent skills builder，围绕技能、工作流和多工具运行构建，适合把 vibe workflow 固化为可复用技能。",
    purpose: "让创作者把重复的 AI 工作流沉淀成技能，跨多个 AI coding 工具复用。",
    howToUse: "访问 refly.ai 或 GitHub 仓库，按文档定义 skill 并在支持的 agent 工具中运行。",
    buildNotes: "来源：GitHub API 搜索 vibe coding。封面使用 GitHub OpenGraph 仓库图。",
    category: "agent-tools",
    tags: ["Agent Skills", "工作流", "开源", "Codex"],
    tech: ["TypeScript", "AI Agent"],
    projectUrl: "https://refly.ai",
    sourceUrl: "https://github.com/refly-ai/refly",
    coverImageUrl: "https://opengraph.githubassets.com/vibegallery/refly-ai/refly",
    likeCount: 390,
    commentCount: 17,
    bookmarkCount: 132,
    hotScore: 1120,
    isFeatured: false
  },
  {
    slug: "superdesign",
    title: "Superdesign",
    summary: "开源 AI product design agent，面向产品设计工作流。",
    description:
      "Superdesign 是 GitHub 上高星的开源 AI product design agent，适合收录到有审美、设计生成相关项目。",
    purpose: "用 AI 辅助产品设计探索，从需求到界面方案更快形成可评审产物。",
    howToUse: "访问官网或 GitHub 仓库，安装 IDE extension 或按项目说明体验。",
    buildNotes: "来源：GitHub API 搜索 AI design agent。封面使用 GitHub OpenGraph 仓库图。",
    category: "ai-design",
    tags: ["Product Design", "AI Agent", "开源", "UI"],
    tech: ["AI", "IDE Extension"],
    projectUrl: "http://superdesign.dev/ide-extension",
    sourceUrl: "https://github.com/superdesigndev/superdesign",
    coverImageUrl: "https://opengraph.githubassets.com/vibegallery/superdesigndev/superdesign",
    likeCount: 360,
    commentCount: 16,
    bookmarkCount: 126,
    hotScore: 1080,
    isFeatured: true
  },
  {
    slug: "chef-convex",
    title: "Chef by Convex",
    summary: "懂后端的 AI app builder。",
    description:
      "Chef by Convex 是 GitHub 上高星项目，强调 AI app builder 不只生成界面，也理解后端数据和业务逻辑。",
    purpose: "帮助创作者更快生成带后端能力的应用，而不是停留在静态页面原型。",
    howToUse: "打开 chef.convex.dev 或 GitHub 仓库，按提示描述应用需求并生成项目。",
    buildNotes: "来源：GitHub API 搜索 AI app builder。封面使用 GitHub OpenGraph 仓库图。",
    category: "app-builder",
    tags: ["后端", "AI App Builder", "Convex", "GitHub"],
    tech: ["TypeScript", "Convex", "AI"],
    projectUrl: "https://chef.convex.dev",
    sourceUrl: "https://github.com/get-convex/chef",
    coverImageUrl: "https://opengraph.githubassets.com/vibegallery/get-convex/chef",
    likeCount: 330,
    commentCount: 14,
    bookmarkCount: 118,
    hotScore: 1040,
    isFeatured: false
  },
  {
    slug: "srcbook",
    title: "Srcbook",
    summary: "TypeScript-centric 的 app development notebook 与 AI app builder。",
    description:
      "Srcbook 把 notebook 和 AI app builder 结合，围绕 TypeScript 应用开发提供更交互式的构建体验。",
    purpose: "让开发者用更可探索的方式组织代码、实验和应用生成。",
    howToUse: "访问 srcbook.com 或 GitHub 仓库，安装并创建 TypeScript app notebook。",
    buildNotes: "来源：GitHub API 搜索 AI app builder。封面使用 GitHub OpenGraph 仓库图。",
    category: "dev-workflow",
    tags: ["Notebook", "TypeScript", "AI App Builder", "开源"],
    tech: ["TypeScript", "AI"],
    projectUrl: "https://srcbook.com",
    sourceUrl: "https://github.com/srcbookdev/srcbook",
    coverImageUrl: "https://opengraph.githubassets.com/vibegallery/srcbookdev/srcbook",
    likeCount: 300,
    commentCount: 13,
    bookmarkCount: 104,
    hotScore: 990,
    isFeatured: false
  },
  {
    slug: "vibe-vibe",
    title: "VibeVibe",
    summary: "系统化 Vibe Coding 开源教程，从零基础到全栈实战。",
    description:
      "VibeVibe 是 DatawhaleChina 的开源教程项目，面向大众学习 vibe coding，并通过实战把想法做成作品。",
    purpose: "为初学者提供系统化路径，降低用 AI 实现创意项目的门槛。",
    howToUse: "访问 vibevibe.cn 或 GitHub 仓库，根据教程从基础概念进入全栈实战。",
    buildNotes: "来源：GitHub API 搜索 vibe coding。封面使用 GitHub OpenGraph 仓库图。",
    category: "learning",
    tags: ["教程", "中文", "开源", "Vibe Coding"],
    tech: ["AI", "Full-stack"],
    projectUrl: "https://www.vibevibe.cn",
    sourceUrl: "https://github.com/datawhalechina/vibe-vibe",
    coverImageUrl: "https://opengraph.githubassets.com/vibegallery/datawhalechina/vibe-vibe",
    likeCount: 260,
    commentCount: 10,
    bookmarkCount: 92,
    hotScore: 930,
    isFeatured: false
  }
];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  const user = await prisma.user.upsert({
    where: { username: author.username },
    update: {
      displayName: author.displayName,
      bio: author.bio
    },
    create: author
  });

  for (const [slug, name] of categories) {
    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { slug, name }
    });
  }

  for (const item of projects) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: item.category } });
    const project = await prisma.project.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        summary: item.summary,
        description: item.description,
        purpose: item.purpose,
        howToUse: item.howToUse,
        buildNotes: item.buildNotes,
        projectUrl: item.projectUrl,
        sourceUrl: item.sourceUrl,
        coverImageUrl: item.coverImageUrl,
        status: "approved",
        difficulty: "beginner",
        isOpenSource: item.tags.includes("开源"),
        isFeatured: item.isFeatured,
        likeCount: 0,
        commentCount: 0,
        bookmarkCount: 0,
        hotScore: item.hotScore,
        submittedAt: new Date(),
        approvedAt: new Date(),
        authorId: user.id,
        categoryId: category.id
      },
      create: {
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        description: item.description,
        purpose: item.purpose,
        howToUse: item.howToUse,
        buildNotes: item.buildNotes,
        projectUrl: item.projectUrl,
        sourceUrl: item.sourceUrl,
        coverImageUrl: item.coverImageUrl,
        status: "approved",
        difficulty: "beginner",
        isOpenSource: item.tags.includes("开源"),
        isFeatured: item.isFeatured,
        likeCount: 0,
        commentCount: 0,
        bookmarkCount: 0,
        hotScore: item.hotScore,
        submittedAt: new Date(),
        approvedAt: new Date(),
        authorId: user.id,
        categoryId: category.id
      }
    });

    await prisma.projectTag.deleteMany({ where: { projectId: project.id } });
    await prisma.projectTechStack.deleteMany({ where: { projectId: project.id } });

    for (const tagName of item.tags) {
      const slug = slugify(tagName);
      const tag = await prisma.tag.upsert({
        where: { slug },
        update: { name: tagName },
        create: { slug, name: tagName }
      });
      await prisma.projectTag.create({
        data: { projectId: project.id, tagId: tag.id }
      });
    }

    for (const techName of item.tech) {
      const slug = slugify(techName);
      const tech = await prisma.techStack.upsert({
        where: { slug },
        update: { name: techName },
        create: { slug, name: techName }
      });
      await prisma.projectTechStack.create({
        data: { projectId: project.id, techStackId: tech.id }
      });
    }
  }

  console.log(`Imported ${projects.length} curated vibe coding projects.`);
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
