import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const author = {
  username: "deep-curator",
  displayName: "Deep Vibe Curator",
  bio: "Curates playful, aesthetic, and useful vibe-coding-adjacent projects from Product Hunt, Hacker News, GitHub, and public project pages."
};

const categories = [
  ["ai-design", "AI \u8bbe\u8ba1"],
  ["app-builder", "\u5e94\u7528\u751f\u6210"],
  ["agent-tools", "\u667a\u80fd\u4f53\u5de5\u5177"],
  ["dev-workflow", "\u5f00\u53d1\u5de5\u4f5c\u6d41"],
  ["learning", "\u5b66\u4e60\u8d44\u6e90"],
  ["showcase", "\u4f5c\u54c1\u5c55\u793a"],
  ["landing", "\u5b98\u7f51"],
  ["tool", "\u5de5\u5177"],
  ["saas", "SaaS"],
  ["plugin", "\u63d2\u4ef6"],
  ["game", "\u5c0f\u6e38\u620f"],
  ["experiment", "\u5b9e\u9a8c"],
  ["portfolio", "\u4f5c\u54c1\u96c6"],
  ["data-viz", "\u6570\u636e\u53ef\u89c6\u5316"]
];

const screenshot = (url) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

const githubOg = (repo) => `https://opengraph.githubassets.com/vibegallery/${repo}`;

const projects = [
  {
    slug: "ai-landing-builder",
    title: "Google Pomelli Catalog",
    summary: "Turn a product catalog into branded campaign assets.",
    description:
      "Google Pomelli Catalog was found at the top of Product Hunt's design tools feed. It is useful for founders who want to quickly turn product material into polished campaign pages and assets.",
    purpose: "Help small teams generate branded landing and campaign material from existing product catalogs.",
    howToUse: "Open the Product Hunt page, review the campaign examples, then follow the product link to create branded launch assets.",
    buildNotes: "Source: OpenCLI Product Hunt design-tools feed. Cover: Product Hunt page screenshot.",
    category: "landing",
    tags: ["Landing", "Campaign", "Google", "Product Hunt"],
    tech: ["AI", "Brand Assets"],
    projectUrl: "https://www.producthunt.com/products/google",
    sourceUrl: "https://www.producthunt.com/products/google",
    coverImageUrl: screenshot("https://www.producthunt.com/products/google"),
    likeCount: 320,
    commentCount: 22,
    bookmarkCount: 118,
    hotScore: 1040,
    isFeatured: true
  },
  {
    slug: "focus-commit",
    title: "Snapr",
    summary: "Screenshot, record, annotate, and edit video in one app.",
    description:
      "Snapr was discovered in Product Hunt's design tools feed. It is a practical tool for creating polished project documentation, demos, and launch visuals.",
    purpose: "Help builders capture better visual evidence for the products they are vibe coding.",
    howToUse: "Open the Product Hunt page, review the capture and annotation workflow, then use it to document a project demo.",
    buildNotes: "Source: OpenCLI Product Hunt design-tools feed. Cover: Product Hunt page screenshot.",
    category: "tool",
    tags: ["Screenshot", "Video", "Annotation", "Product Hunt"],
    tech: ["Creative Tool", "Video"],
    projectUrl: "https://www.producthunt.com/products/snapr-5",
    sourceUrl: "https://www.producthunt.com/products/snapr-5",
    coverImageUrl: screenshot("https://www.producthunt.com/products/snapr-5"),
    likeCount: 180,
    commentCount: 12,
    bookmarkCount: 74,
    hotScore: 830,
    isFeatured: false
  },
  {
    slug: "indie-playground",
    title: "SereneUI",
    summary: "A VS Code-inspired, open-source UI for Postgres.",
    description:
      "SereneUI was found in Hacker News Show HN. It is a strong portfolio/showcase entry because it demonstrates a refined open-source interface for database work.",
    purpose: "Show how a familiar editor-inspired interface can make database work more approachable.",
    howToUse: "Open the GitHub path from the Show HN item, review the UI package, and use it as interface inspiration for data-heavy tools.",
    buildNotes: "Source: OpenCLI Hacker News Show HN feed. Cover: GitHub OpenGraph image.",
    category: "portfolio",
    tags: ["Show HN", "Postgres", "Open Source", "UI"],
    tech: ["TypeScript", "Postgres"],
    projectUrl: "https://github.com/serenedb/serenedb/tree/main/serene-ui",
    sourceUrl: "https://news.ycombinator.com/item?id=48047702",
    coverImageUrl: githubOg("serenedb/serenedb"),
    likeCount: 110,
    commentCount: 8,
    bookmarkCount: 52,
    hotScore: 760,
    isFeatured: false
  },
  {
    slug: "wonder-design-agent",
    title: "Wonder",
    summary: "An AI design agent that works directly on a visual canvas.",
    description:
      "Wonder was surfaced from Product Hunt's design tools feed. It fits the AI design category because it treats the canvas as the working surface instead of only producing text prompts.",
    purpose: "Explore visual ideas faster and keep AI-generated design work close to an editable canvas.",
    howToUse: "Open the Product Hunt page, review the launch materials, then follow through to the product site to try the canvas workflow.",
    buildNotes: "Source: OpenCLI Product Hunt design-tools feed, 2026-04-28. Cover: live Product Hunt page screenshot.",
    category: "ai-design",
    tags: ["AI Design", "Canvas", "Product Hunt"],
    tech: ["AI", "Design Agent"],
    projectUrl: "https://www.producthunt.com/products/wonder-public-alpha",
    sourceUrl: "https://www.producthunt.com/products/wonder-public-alpha",
    coverImageUrl: screenshot("https://www.producthunt.com/products/wonder-public-alpha"),
    likeCount: 220,
    commentCount: 18,
    bookmarkCount: 74,
    hotScore: 1090,
    isFeatured: true
  },
  {
    slug: "open-lovart",
    title: "Open-Lovart",
    summary: "Open-source creative design agent for posters, brand kits, ads, and video concepts.",
    description:
      "Open-Lovart is a GitHub project positioned as an open-source design agent and alternative to Lovart, Runway Agent, Luma Labs Agent, Krea Agent, and Magic Patterns.",
    purpose: "Give designers and builders a self-hosted creative agent for visual assets and branded content.",
    howToUse: "Open the GitHub repository, review the README and deployment instructions, then run or self-host the creative agent.",
    buildNotes: "Source: GitHub public API search for AI design agents. Cover: GitHub OpenGraph image.",
    category: "ai-design",
    tags: ["Open Source", "AI Design", "Creative Agent", "GitHub"],
    tech: ["JavaScript", "AI"],
    projectUrl: "https://dev.muapi.ai/assistant",
    sourceUrl: "https://github.com/Anil-matcha/Open-Lovart",
    coverImageUrl: githubOg("Anil-matcha/Open-Lovart"),
    likeCount: 644,
    commentCount: 21,
    bookmarkCount: 168,
    hotScore: 1210,
    isFeatured: true
  },
  {
    slug: "lumi-ai-builder",
    title: "Lumi",
    summary: "AI apps and websites builder highlighted as a Base44/Lovable alternative.",
    description:
      "Lumi appeared in Hacker News search results for Show HN AI app builders. It is relevant for fast app and website generation workflows.",
    purpose: "Turn early product ideas into runnable apps and websites with less manual setup.",
    howToUse: "Open the Show HN-linked product page, describe the app or website you want, then iterate on the generated result.",
    buildNotes: "Source: OpenCLI Hacker News search for Show HN AI app builder. Cover: product page screenshot.",
    category: "app-builder",
    tags: ["Show HN", "AI App Builder", "Website Builder"],
    tech: ["AI", "Web App"],
    projectUrl: "https://lumi.new",
    sourceUrl: "https://lumi.new",
    coverImageUrl: screenshot("https://lumi.new"),
    likeCount: 108,
    commentCount: 8,
    bookmarkCount: 44,
    hotScore: 820,
    isFeatured: false
  },
  {
    slug: "zoer-ai",
    title: "Zoer.ai",
    summary: "Build full-stack web apps from the database up.",
    description:
      "Zoer.ai was found in the Product Hunt vibe-coding category. It is valuable because it starts from the data model rather than only screen mockups.",
    purpose: "Help builders create full-stack apps where database structure and UI evolve together.",
    howToUse: "Open the Product Hunt launch, review the app-building flow, then follow the product link to create a database-backed app.",
    buildNotes: "Source: OpenCLI Product Hunt vibe-coding feed. Cover: Product Hunt launch screenshot.",
    category: "app-builder",
    tags: ["Full Stack", "Database", "Product Hunt", "AI App Builder"],
    tech: ["AI", "Database"],
    projectUrl: "https://www.producthunt.com/products/zoer-ai-2/launches/zoer-ai-2",
    sourceUrl: "https://www.producthunt.com/products/zoer-ai-2/launches/zoer-ai-2",
    coverImageUrl: screenshot("https://www.producthunt.com/products/zoer-ai-2/launches/zoer-ai-2"),
    likeCount: 190,
    commentCount: 12,
    bookmarkCount: 62,
    hotScore: 880,
    isFeatured: false
  },
  {
    slug: "cosine-swarm",
    title: "Cosine Swarm",
    summary: "Parallel AI agents for long-horizon, complex software tasks.",
    description:
      "Cosine Swarm came from Product Hunt's vibe-coding feed and is a strong fit for multi-agent build workflows.",
    purpose: "Coordinate parallel AI agents when a software task is too broad for a single prompt or single agent.",
    howToUse: "Read the Product Hunt launch, inspect the examples, then use the product for longer-running agentic engineering tasks.",
    buildNotes: "Source: OpenCLI Product Hunt vibe-coding feed. Cover: Product Hunt launch screenshot.",
    category: "agent-tools",
    tags: ["Agents", "Swarm", "Product Hunt", "Long Horizon"],
    tech: ["AI Agent", "Developer Tool"],
    projectUrl: "https://www.producthunt.com/products/cosine/launches/cosine-swarm",
    sourceUrl: "https://www.producthunt.com/products/cosine/launches/cosine-swarm",
    coverImageUrl: screenshot("https://www.producthunt.com/products/cosine/launches/cosine-swarm"),
    likeCount: 260,
    commentCount: 18,
    bookmarkCount: 92,
    hotScore: 1030,
    isFeatured: true
  },
  {
    slug: "baton-agents",
    title: "Baton",
    summary: "Orchestrate AI coding agents from one workflow surface.",
    description:
      "Baton was discovered in the Product Hunt vibe-coding feed and focuses on orchestration, which is one of the main bottlenecks in multi-agent coding.",
    purpose: "Keep coding agents organized, assigned, and reviewable as tasks move through a build process.",
    howToUse: "Open the Product Hunt launch, review the orchestration model, then connect your preferred coding agents.",
    buildNotes: "Source: OpenCLI Product Hunt vibe-coding feed. Cover: Product Hunt launch screenshot.",
    category: "agent-tools",
    tags: ["Agent Orchestration", "Coding Agents", "Product Hunt"],
    tech: ["AI Agent", "Workflow"],
    projectUrl: "https://www.producthunt.com/products/baton-2/launches/baton-2",
    sourceUrl: "https://www.producthunt.com/products/baton-2/launches/baton-2",
    coverImageUrl: screenshot("https://www.producthunt.com/products/baton-2/launches/baton-2"),
    likeCount: 210,
    commentCount: 14,
    bookmarkCount: 80,
    hotScore: 960,
    isFeatured: false
  },
  {
    slug: "facts-product-specs",
    title: "Facts",
    summary: "A sharper way to write product specs that are not fluffy.",
    description:
      "Facts appeared near the top of Product Hunt's vibe-coding feed. It belongs in development workflow because better specs make AI-generated implementation more reliable.",
    purpose: "Convert vague product ideas into clearer implementation-ready facts and decisions.",
    howToUse: "Open the Product Hunt page, review the product workflow, then use it before asking coding agents to build.",
    buildNotes: "Source: OpenCLI Product Hunt vibe-coding feed. Cover: Product Hunt page screenshot.",
    category: "dev-workflow",
    tags: ["Specs", "Product", "Vibe Coding", "Product Hunt"],
    tech: ["AI", "Workflow"],
    projectUrl: "https://www.producthunt.com/products/facts-fc3505e0-6206-4a1b-b6b4-01b7ffbb7783",
    sourceUrl: "https://www.producthunt.com/products/facts-fc3505e0-6206-4a1b-b6b4-01b7ffbb7783",
    coverImageUrl: screenshot("https://www.producthunt.com/products/facts-fc3505e0-6206-4a1b-b6b4-01b7ffbb7783"),
    likeCount: 180,
    commentCount: 11,
    bookmarkCount: 70,
    hotScore: 900,
    isFeatured: false
  },
  {
    slug: "codehealth-mcp",
    title: "CodeHealth MCP Server",
    summary: "Keep AI-generated code healthy and maintainable.",
    description:
      "CodeHealth MCP Server by CodeScene was surfaced in Product Hunt's vibe-coding feed. It is a useful counterweight to fast AI coding because it checks maintainability.",
    purpose: "Add maintainability checks into agentic coding workflows before code quality drifts.",
    howToUse: "Open the Product Hunt page and follow the CodeScene MCP setup instructions for your coding environment.",
    buildNotes: "Source: OpenCLI Product Hunt vibe-coding feed. Cover: Product Hunt page screenshot.",
    category: "dev-workflow",
    tags: ["MCP", "Code Quality", "AI Code", "Product Hunt"],
    tech: ["MCP", "Static Analysis"],
    projectUrl: "https://www.producthunt.com/products/codescene-codehealth-mcp-server",
    sourceUrl: "https://www.producthunt.com/products/codescene-codehealth-mcp-server",
    coverImageUrl: screenshot("https://www.producthunt.com/products/codescene-codehealth-mcp-server"),
    likeCount: 170,
    commentCount: 9,
    bookmarkCount: 69,
    hotScore: 870,
    isFeatured: false
  },
  {
    slug: "claude-code-best-practice",
    title: "Claude Code Best Practice",
    summary: "A large guide for moving from vibe coding to agentic engineering.",
    description:
      "This GitHub repository ranked highly in GitHub public API search for vibe coding and Claude Code best practices.",
    purpose: "Help builders use Claude Code and agentic engineering workflows with more structure and less guesswork.",
    howToUse: "Open the GitHub repository and read the best-practice sections relevant to your agent workflow.",
    buildNotes: "Source: GitHub public API search. Cover: GitHub OpenGraph image.",
    category: "learning",
    tags: ["Claude Code", "Best Practices", "Agentic Engineering", "GitHub"],
    tech: ["Claude Code", "AI Agent"],
    projectUrl: "https://github.com/shanraisshan/claude-code-best-practice",
    sourceUrl: "https://github.com/shanraisshan/claude-code-best-practice",
    coverImageUrl: githubOg("shanraisshan/claude-code-best-practice"),
    likeCount: 51550,
    commentCount: 120,
    bookmarkCount: 4600,
    hotScore: 1800,
    isFeatured: true
  },
  {
    slug: "vibe-coding-tips-tricks",
    title: "Vibe Coding Tips and Tricks",
    summary: "AWS Labs notes on practical vibe-coding patterns.",
    description:
      "This Hacker News result points to an AWS Labs GitHub document about vibe coding tips and tricks.",
    purpose: "Give learners a compact reference for safer and more useful AI-assisted coding.",
    howToUse: "Open the GitHub document from the Hacker News result and adapt the tips to your coding-agent setup.",
    buildNotes: "Source: OpenCLI Hacker News search for vibe coding. Cover: GitHub OpenGraph image.",
    category: "learning",
    tags: ["Tips", "AWS Labs", "Hacker News", "Vibe Coding"],
    tech: ["MCP", "AI"],
    projectUrl: "https://github.com/awslabs/mcp/blob/main/VIBE_CODING_TIPS_TRICKS.md",
    sourceUrl: "https://news.ycombinator.com/item?id=44940089",
    coverImageUrl: githubOg("awslabs/mcp"),
    likeCount: 227,
    commentCount: 93,
    bookmarkCount: 88,
    hotScore: 760,
    isFeatured: false
  },
  {
    slug: "gastown-agent-patterns",
    title: "Gas Town Agent Patterns",
    summary: "A field report on design bottlenecks and vibecoding at scale.",
    description:
      "This Hacker News result links to Maggie Appleton's Gas Town writeup, a useful learning artifact about agent patterns and design bottlenecks.",
    purpose: "Teach builders what breaks when vibe coding grows from a single prompt into a broader product workflow.",
    howToUse: "Read the article, then map the agent patterns and bottlenecks to your own build process.",
    buildNotes: "Source: OpenCLI Hacker News search for vibe coding. Cover: article screenshot.",
    category: "learning",
    tags: ["Agent Patterns", "Design Bottlenecks", "Hacker News"],
    tech: ["AI Agent", "Process"],
    projectUrl: "https://maggieappleton.com/gastown",
    sourceUrl: "https://news.ycombinator.com/item?id=46734302",
    coverImageUrl: screenshot("https://maggieappleton.com/gastown"),
    likeCount: 403,
    commentCount: 433,
    bookmarkCount: 150,
    hotScore: 980,
    isFeatured: true
  },
  {
    slug: "startups-rip",
    title: "Startups.RIP",
    summary: "Rebuild thousands of dead YC startup ideas with AI.",
    description:
      "Startups.RIP was found in Product Hunt's vibe-coding feed and is a playful showcase of idea archaeology plus AI rebuilding.",
    purpose: "Inspire builders by turning failed startup ideas into prompts and rebuild opportunities.",
    howToUse: "Open the Product Hunt launch, browse dead startup ideas, then pick one to rebuild as a vibe-coding exercise.",
    buildNotes: "Source: OpenCLI Product Hunt vibe-coding feed. Cover: Product Hunt launch screenshot.",
    category: "showcase",
    tags: ["Showcase", "YC", "Ideas", "Product Hunt"],
    tech: ["AI", "Web App"],
    projectUrl: "https://www.producthunt.com/products/startups-rip/launches/startups-rip-2",
    sourceUrl: "https://www.producthunt.com/products/startups-rip/launches/startups-rip-2",
    coverImageUrl: screenshot("https://www.producthunt.com/products/startups-rip/launches/startups-rip-2"),
    likeCount: 230,
    commentCount: 16,
    bookmarkCount: 76,
    hotScore: 920,
    isFeatured: true
  },
  {
    slug: "vibe-marketplace-greta",
    title: "Vibe Marketplace by Greta",
    summary: "Sell what you ship, instantly.",
    description:
      "Vibe Marketplace by Greta came from Product Hunt's vibe-coding feed and belongs in showcase because it turns shipped vibe-coded artifacts into a marketplace surface.",
    purpose: "Encourage builders to publish, package, and sell small AI-built projects instead of leaving them as demos.",
    howToUse: "Open the Product Hunt launch and inspect how productized vibe-coded work is presented for buyers.",
    buildNotes: "Source: OpenCLI Product Hunt vibe-coding feed. Cover: Product Hunt launch screenshot.",
    category: "showcase",
    tags: ["Marketplace", "Showcase", "Product Hunt"],
    tech: ["AI", "Commerce"],
    projectUrl: "https://www.producthunt.com/products/gretabyquestera/launches/vibe-marketplace-by-greta",
    sourceUrl: "https://www.producthunt.com/products/gretabyquestera/launches/vibe-marketplace-by-greta",
    coverImageUrl: screenshot("https://www.producthunt.com/products/gretabyquestera/launches/vibe-marketplace-by-greta"),
    likeCount: 190,
    commentCount: 10,
    bookmarkCount: 65,
    hotScore: 820,
    isFeatured: false
  },
  {
    slug: "bookshelf-claude-code",
    title: "Vibe Coding a Bookshelf",
    summary: "A Show HN project about building a bookshelf with Claude Code.",
    description:
      "This Hacker News Show HN item is a concrete personal showcase of a vibe-coded project, useful for readers who want to see the process and outcome.",
    purpose: "Show how a small creative product can be built and narrated with Claude Code.",
    howToUse: "Open the article, review the build story, then use the pattern for your own small showcase project.",
    buildNotes: "Source: OpenCLI Hacker News search for vibe coding. Cover: article screenshot.",
    category: "showcase",
    tags: ["Show HN", "Claude Code", "Showcase"],
    tech: ["Claude Code", "Web"],
    projectUrl: "https://balajmarius.com/writings/vibe-coding-a-bookshelf-with-claude-code/",
    sourceUrl: "https://news.ycombinator.com/item?id=46420453",
    coverImageUrl: screenshot("https://balajmarius.com/writings/vibe-coding-a-bookshelf-with-claude-code/"),
    likeCount: 284,
    commentCount: 210,
    bookmarkCount: 96,
    hotScore: 860,
    isFeatured: false
  },
  {
    slug: "lovable-mobile-app",
    title: "Lovable Mobile App",
    summary: "A mobile surface for building ideas whenever they arrive.",
    description:
      "Lovable mobile app was surfaced in Product Hunt's design tools feed and extends AI app building into mobile workflows.",
    purpose: "Let founders and designers capture app ideas and continue building away from the desk.",
    howToUse: "Open the Product Hunt launch, review the mobile workflow, then try creating or revisiting a Lovable project from mobile.",
    buildNotes: "Source: OpenCLI Product Hunt design-tools feed. Cover: Product Hunt page screenshot.",
    category: "landing",
    tags: ["Landing", "Mobile", "AI App Builder", "Product Hunt"],
    tech: ["AI", "Mobile"],
    projectUrl: "https://www.producthunt.com/products/lovable",
    sourceUrl: "https://www.producthunt.com/products/lovable",
    coverImageUrl: screenshot("https://www.producthunt.com/products/lovable"),
    likeCount: 300,
    commentCount: 24,
    bookmarkCount: 110,
    hotScore: 990,
    isFeatured: true
  },
  {
    slug: "google-ai-studio-2",
    title: "Google AI Studio 2.0",
    summary: "Full-stack vibe coding powered by Antigravity and Firebase.",
    description:
      "Google AI Studio 2.0 appeared in Product Hunt's vibe-coding feed and represents a polished official product surface for full-stack AI building.",
    purpose: "Explore how full-stack AI building can be packaged as an approachable product experience.",
    howToUse: "Open the Product Hunt launch, review the feature set, then follow the Google AI Studio product link.",
    buildNotes: "Source: OpenCLI Product Hunt vibe-coding feed. Cover: Product Hunt page screenshot.",
    category: "landing",
    tags: ["Google", "Firebase", "Full Stack", "Product Hunt"],
    tech: ["Firebase", "AI"],
    projectUrl: "https://www.producthunt.com/products/google-ai-studio-8/launches/google-ai-studio-2-0",
    sourceUrl: "https://www.producthunt.com/products/google-ai-studio-8/launches/google-ai-studio-2-0",
    coverImageUrl: screenshot("https://www.producthunt.com/products/google-ai-studio-8/launches/google-ai-studio-2-0"),
    likeCount: 360,
    commentCount: 28,
    bookmarkCount: 130,
    hotScore: 1100,
    isFeatured: true
  },
  {
    slug: "magic-studio-once-ui",
    title: "Magic Studio by Once UI",
    summary: "Turn Once UI into a high-value agency workflow.",
    description:
      "Magic Studio by Once UI came from Product Hunt's developer tools feed and is valuable for builders who care about reusable UI systems.",
    purpose: "Show how a polished component system can become an AI-assisted site and agency workflow.",
    howToUse: "Open the Product Hunt page and inspect how Once UI packages templates, blocks, and agency-style delivery.",
    buildNotes: "Source: OpenCLI Product Hunt developer-tools feed. Cover: Product Hunt page screenshot.",
    category: "landing",
    tags: ["Once UI", "Design System", "Landing", "Product Hunt"],
    tech: ["UI Kit", "AI"],
    projectUrl: "https://www.producthunt.com/products/magic-studio-by-once-ui",
    sourceUrl: "https://www.producthunt.com/products/magic-studio-by-once-ui",
    coverImageUrl: screenshot("https://www.producthunt.com/products/magic-studio-by-once-ui"),
    likeCount: 210,
    commentCount: 14,
    bookmarkCount: 78,
    hotScore: 870,
    isFeatured: false
  },
  {
    slug: "motn-ai",
    title: "Motn AI",
    summary: "Vibe-code motion graphics on one canvas.",
    description:
      "Motn AI was discovered in Product Hunt's vibe-coding feed. It is a playful tool for motion design through vibe-coding style prompts.",
    purpose: "Let creators generate and iterate motion graphics without a heavyweight animation workflow.",
    howToUse: "Open the Product Hunt launch, review the motion canvas examples, then try building a short visual sequence.",
    buildNotes: "Source: OpenCLI Product Hunt vibe-coding feed. Cover: Product Hunt launch screenshot.",
    category: "tool",
    tags: ["Motion", "Canvas", "Creative Tool", "Product Hunt"],
    tech: ["AI", "Motion"],
    projectUrl: "https://www.producthunt.com/products/motn-ai/launches/motn-ai",
    sourceUrl: "https://www.producthunt.com/products/motn-ai/launches/motn-ai",
    coverImageUrl: screenshot("https://www.producthunt.com/products/motn-ai/launches/motn-ai"),
    likeCount: 250,
    commentCount: 16,
    bookmarkCount: 90,
    hotScore: 960,
    isFeatured: true
  },
  {
    slug: "slicer-dev",
    title: "slicer.dev",
    summary: "Copy interactive web components as AI prompts.",
    description:
      "slicer.dev came from Product Hunt's vibe-coding feed and is useful because it bridges visual UI references and promptable code generation.",
    purpose: "Capture interesting UI components and turn them into prompts that coding agents can understand.",
    howToUse: "Open the Product Hunt launch, inspect the capture workflow, then use it on components you want to recreate.",
    buildNotes: "Source: OpenCLI Product Hunt vibe-coding feed. Cover: Product Hunt launch screenshot.",
    category: "tool",
    tags: ["Components", "Prompting", "UI Capture", "Product Hunt"],
    tech: ["Web", "AI"],
    projectUrl: "https://www.producthunt.com/products/slicer-dev-any-component-as-ai-prompt/launches/slicer-dev",
    sourceUrl: "https://www.producthunt.com/products/slicer-dev-any-component-as-ai-prompt/launches/slicer-dev",
    coverImageUrl: screenshot("https://www.producthunt.com/products/slicer-dev-any-component-as-ai-prompt/launches/slicer-dev"),
    likeCount: 180,
    commentCount: 12,
    bookmarkCount: 84,
    hotScore: 850,
    isFeatured: false
  },
  {
    slug: "openclick",
    title: "Openclick",
    summary: "A macOS agent that turns prompts into automated clicks.",
    description:
      "Openclick was found in Product Hunt's developer tools feed. It is a practical automation tool for bridging natural language and desktop actions.",
    purpose: "Automate repetitive desktop workflows from prompts, useful when building or testing without custom integrations.",
    howToUse: "Open the Product Hunt page and follow the product instructions for macOS automation.",
    buildNotes: "Source: OpenCLI Product Hunt developer-tools feed. Cover: Product Hunt page screenshot.",
    category: "tool",
    tags: ["Automation", "macOS", "Agent", "Product Hunt"],
    tech: ["AI Agent", "macOS"],
    projectUrl: "https://www.producthunt.com/products/openclick",
    sourceUrl: "https://www.producthunt.com/products/openclick",
    coverImageUrl: screenshot("https://www.producthunt.com/products/openclick"),
    likeCount: 160,
    commentCount: 9,
    bookmarkCount: 60,
    hotScore: 810,
    isFeatured: false
  },
  {
    slug: "softr-ai-cobuilder",
    title: "Softr AI Co-Builder",
    summary: "Build business apps with AI that actually work.",
    description:
      "Softr AI Co-Builder appeared in Product Hunt's vibe-coding feed and fits SaaS because it helps create operational business software.",
    purpose: "Build practical internal tools and business apps without starting from a blank codebase.",
    howToUse: "Open the Product Hunt launch, review example business apps, then create a workflow-backed app in Softr.",
    buildNotes: "Source: OpenCLI Product Hunt vibe-coding feed. Cover: Product Hunt launch screenshot.",
    category: "saas",
    tags: ["SaaS", "Business Apps", "No Code", "Product Hunt"],
    tech: ["AI", "No Code"],
    projectUrl: "https://www.producthunt.com/products/softr/launches/softr-ai-co-builder",
    sourceUrl: "https://www.producthunt.com/products/softr/launches/softr-ai-co-builder",
    coverImageUrl: screenshot("https://www.producthunt.com/products/softr/launches/softr-ai-co-builder"),
    likeCount: 260,
    commentCount: 16,
    bookmarkCount: 100,
    hotScore: 980,
    isFeatured: true
  },
  {
    slug: "runner-ai-store",
    title: "Runner AI",
    summary: "Build, optimize, and scale an AI-native store.",
    description:
      "Runner AI was discovered in Product Hunt's vibe-coding feed and fits SaaS because it packages AI-native commerce building into a product.",
    purpose: "Help founders build and improve commerce products with AI-native workflows.",
    howToUse: "Open the Product Hunt page, review the store-building flow, then follow the product link to create or optimize a store.",
    buildNotes: "Source: OpenCLI Product Hunt vibe-coding feed. Cover: Product Hunt page screenshot.",
    category: "saas",
    tags: ["SaaS", "Commerce", "AI Store", "Product Hunt"],
    tech: ["AI", "Commerce"],
    projectUrl: "https://www.producthunt.com/products/runner-ai-2/launches/runner-ai-2",
    sourceUrl: "https://www.producthunt.com/products/runner-ai-2/launches/runner-ai-2",
    coverImageUrl: screenshot("https://www.producthunt.com/products/runner-ai-2/launches/runner-ai-2"),
    likeCount: 170,
    commentCount: 9,
    bookmarkCount: 66,
    hotScore: 820,
    isFeatured: false
  },
  {
    slug: "devally",
    title: "DevAlly",
    summary: "AI-powered accessibility compliance for teams who ship fast.",
    description:
      "DevAlly came from Product Hunt's developer tools feed. It belongs in SaaS because it provides a focused productized workflow for accessibility compliance.",
    purpose: "Catch accessibility issues earlier in fast AI-assisted product teams.",
    howToUse: "Open the Product Hunt page, review the compliance workflow, and connect it to your product QA process.",
    buildNotes: "Source: OpenCLI Product Hunt developer-tools feed. Cover: Product Hunt page screenshot.",
    category: "saas",
    tags: ["Accessibility", "Compliance", "SaaS", "Product Hunt"],
    tech: ["AI", "QA"],
    projectUrl: "https://www.producthunt.com/products/devally",
    sourceUrl: "https://www.producthunt.com/products/devally",
    coverImageUrl: screenshot("https://www.producthunt.com/products/devally"),
    likeCount: 150,
    commentCount: 8,
    bookmarkCount: 58,
    hotScore: 790,
    isFeatured: false
  },
  {
    slug: "design-md",
    title: "Design.MD",
    summary: "Drop-in design systems your AI coding agent can read.",
    description:
      "Design.MD appeared in Product Hunt's design tools feed and fits plugin/resources because it packages design-system context for AI coding agents.",
    purpose: "Give agents readable design-system constraints so generated UI stays on brand.",
    howToUse: "Open the Product Hunt launch and follow the setup instructions to add design context to your AI coding workflow.",
    buildNotes: "Source: OpenCLI Product Hunt design-tools feed. Cover: Product Hunt launch screenshot.",
    category: "plugin",
    tags: ["Design System", "AI Agent", "Plugin", "Product Hunt"],
    tech: ["Markdown", "Design System"],
    projectUrl: "https://www.producthunt.com/products/figma-for-ai-agents/launches/design-md",
    sourceUrl: "https://www.producthunt.com/products/figma-for-ai-agents/launches/design-md",
    coverImageUrl: screenshot("https://www.producthunt.com/products/figma-for-ai-agents/launches/design-md"),
    likeCount: 240,
    commentCount: 15,
    bookmarkCount: 96,
    hotScore: 930,
    isFeatured: true
  },
  {
    slug: "picsart-cli",
    title: "Picsart CLI",
    summary: "Picsart's image-editing power from your AI chat box.",
    description:
      "Picsart CLI came from Product Hunt's design tools feed and is a practical plugin-style tool for AI-assisted image editing.",
    purpose: "Let builders call creative image tools directly from agent or chat workflows.",
    howToUse: "Open the Product Hunt page and follow the CLI setup to connect image editing to your AI workflow.",
    buildNotes: "Source: OpenCLI Product Hunt design-tools feed. Cover: Product Hunt page screenshot.",
    category: "plugin",
    tags: ["CLI", "Image Editing", "Plugin", "Product Hunt"],
    tech: ["CLI", "AI Image"],
    projectUrl: "https://www.producthunt.com/products/picsart",
    sourceUrl: "https://www.producthunt.com/products/picsart",
    coverImageUrl: screenshot("https://www.producthunt.com/products/picsart"),
    likeCount: 190,
    commentCount: 11,
    bookmarkCount: 72,
    hotScore: 850,
    isFeatured: false
  },
  {
    slug: "kilo-code-v7",
    title: "Kilo Code v7 for VS Code",
    summary: "Parallel agents, diff reviewer, and multi-model comparisons.",
    description:
      "Kilo Code v7 was surfaced in Product Hunt's developer tools feed and fits the plugin category because it extends VS Code with agentic coding capabilities.",
    purpose: "Bring multi-agent coding, review, and model comparison into the editor.",
    howToUse: "Open the Product Hunt page, follow the VS Code install path, and test the parallel-agent workflow on a small issue.",
    buildNotes: "Source: OpenCLI Product Hunt developer-tools feed. Cover: Product Hunt page screenshot.",
    category: "plugin",
    tags: ["VS Code", "Coding Agent", "Plugin", "Product Hunt"],
    tech: ["VS Code", "AI Agent"],
    projectUrl: "https://www.producthunt.com/products/kilocode",
    sourceUrl: "https://www.producthunt.com/products/kilocode",
    coverImageUrl: screenshot("https://www.producthunt.com/products/kilocode"),
    likeCount: 230,
    commentCount: 17,
    bookmarkCount: 88,
    hotScore: 910,
    isFeatured: true
  },
  {
    slug: "aion-quest",
    title: "Aion Quest",
    summary: "A game where AI agents compete to ship code.",
    description:
      "Aion Quest was found in Hacker News Show HN. It is playful, clearly AI-agent related, and belongs in the game category.",
    purpose: "Make agentic coding visible and fun by turning code shipping into a competitive game loop.",
    howToUse: "Open the Show HN-linked game page and inspect how agents compete and progress.",
    buildNotes: "Source: OpenCLI Hacker News Show HN feed. Cover: product page screenshot.",
    category: "game",
    tags: ["Game", "AI Agents", "Show HN"],
    tech: ["AI Agent", "Web Game"],
    projectUrl: "https://aion.quest/",
    sourceUrl: "https://news.ycombinator.com/item?id=48041926",
    coverImageUrl: screenshot("https://aion.quest/"),
    likeCount: 80,
    commentCount: 4,
    bookmarkCount: 34,
    hotScore: 720,
    isFeatured: true
  },
  {
    slug: "makko-ai",
    title: "Makko AI",
    summary: "Make 2D game art and playable games without drawing or coding.",
    description:
      "Makko AI came from Product Hunt's design tools feed and is a strong fit for playful vibe-coding because it connects art generation with playable games.",
    purpose: "Help creators make small game concepts and 2D assets faster.",
    howToUse: "Open the Product Hunt launch, review the examples, then try making game art or a playable prototype.",
    buildNotes: "Source: OpenCLI Product Hunt design-tools feed. Cover: Product Hunt launch screenshot.",
    category: "game",
    tags: ["Game", "2D Art", "Playable Prototype", "Product Hunt"],
    tech: ["AI", "Game Art"],
    projectUrl: "https://www.producthunt.com/products/makko-ai/launches/makko-ai",
    sourceUrl: "https://www.producthunt.com/products/makko-ai/launches/makko-ai",
    coverImageUrl: screenshot("https://www.producthunt.com/products/makko-ai/launches/makko-ai"),
    likeCount: 210,
    commentCount: 15,
    bookmarkCount: 82,
    hotScore: 880,
    isFeatured: true
  },
  {
    slug: "aicw-video",
    title: "AICW Video",
    summary: "Open-source tool to cut videos into clips with captions and voiceover.",
    description:
      "AICW Video was discovered in Hacker News Show HN and is a playful creative tool that can support game trailers and creator workflows.",
    purpose: "Turn longer videos into shareable clips with captions and narration.",
    howToUse: "Open the GitHub repository from the Show HN item and follow the README to process a sample video.",
    buildNotes: "Source: OpenCLI Hacker News Show HN feed. Cover: GitHub OpenGraph image.",
    category: "game",
    tags: ["Video", "Show HN", "Open Source", "Creative Tool"],
    tech: ["Python", "AI Video"],
    projectUrl: "https://github.com/aicw-io/aicw-video",
    sourceUrl: "https://news.ycombinator.com/item?id=48047914",
    coverImageUrl: githubOg("aicw-io/aicw-video"),
    likeCount: 70,
    commentCount: 6,
    bookmarkCount: 31,
    hotScore: 690,
    isFeatured: false
  },
  {
    slug: "gas-city",
    title: "Gas City 1.0",
    summary: "Build your own software factory.",
    description:
      "Gas City was surfaced in Product Hunt's developer tools feed and fits experiments because it explores what an AI software factory can look like.",
    purpose: "Experiment with packaging multiple software-building steps into one AI-native factory.",
    howToUse: "Open the Product Hunt page, inspect the launch materials, then compare the workflow with your own agent setup.",
    buildNotes: "Source: OpenCLI Product Hunt developer-tools feed. Cover: Product Hunt page screenshot.",
    category: "experiment",
    tags: ["Software Factory", "Experiment", "Product Hunt"],
    tech: ["AI Agent", "Workflow"],
    projectUrl: "https://www.producthunt.com/products/gas-city",
    sourceUrl: "https://www.producthunt.com/products/gas-city",
    coverImageUrl: screenshot("https://www.producthunt.com/products/gas-city"),
    likeCount: 280,
    commentCount: 22,
    bookmarkCount: 120,
    hotScore: 1060,
    isFeatured: true
  },
  {
    slug: "duck-duck-duck-ideo",
    title: "Duck, Duck, Duck! by IDEO",
    summary: "An opinionated robot rubber duck for Claude Code.",
    description:
      "This Product Hunt launch is playful and experimental: it gives Claude Code a critique-oriented companion.",
    purpose: "Add a design-minded sparring partner to coding-agent sessions.",
    howToUse: "Open the Product Hunt launch and review the interaction model before using it alongside Claude Code.",
    buildNotes: "Source: OpenCLI Product Hunt vibe-coding feed. Cover: Product Hunt launch screenshot.",
    category: "experiment",
    tags: ["Claude Code", "Critique", "Experiment", "Product Hunt"],
    tech: ["Claude Code", "AI Agent"],
    projectUrl: "https://www.producthunt.com/products/duck-duck-duck-by-ideo/launches/duck-duck-duck-by-ideo",
    sourceUrl: "https://www.producthunt.com/products/duck-duck-duck-by-ideo/launches/duck-duck-duck-by-ideo",
    coverImageUrl: screenshot("https://www.producthunt.com/products/duck-duck-duck-by-ideo/launches/duck-duck-duck-by-ideo"),
    likeCount: 170,
    commentCount: 12,
    bookmarkCount: 62,
    hotScore: 820,
    isFeatured: false
  },
  {
    slug: "imgcmd",
    title: "imgcmd",
    summary: "A secure CLI that generates real PNGs directly to disk.",
    description:
      "imgcmd appeared in Product Hunt's vibe-coding feed and is a useful experiment in command-line image generation.",
    purpose: "Make generated visual assets directly available in local project folders.",
    howToUse: "Open the Product Hunt launch, follow setup instructions, and generate a small PNG asset into a test project.",
    buildNotes: "Source: OpenCLI Product Hunt vibe-coding feed. Cover: Product Hunt launch screenshot.",
    category: "experiment",
    tags: ["CLI", "Image Generation", "Experiment", "Product Hunt"],
    tech: ["CLI", "AI Image"],
    projectUrl: "https://www.producthunt.com/products/imgcmd/launches/imgcmd",
    sourceUrl: "https://www.producthunt.com/products/imgcmd/launches/imgcmd",
    coverImageUrl: screenshot("https://www.producthunt.com/products/imgcmd/launches/imgcmd"),
    likeCount: 150,
    commentCount: 9,
    bookmarkCount: 56,
    hotScore: 780,
    isFeatured: false
  },
  {
    slug: "awesome-vibe-coding",
    title: "Awesome Vibe Coding",
    summary: "A curated GitHub list of vibe-coding tools and resources.",
    description:
      "This GitHub repository appeared in public API search with topics around awesome-vibe-coding and vibecoding tools.",
    purpose: "Give builders a broad map of tools, references, and examples in one place.",
    howToUse: "Open the GitHub repository and browse by tool type or learning need.",
    buildNotes: "Source: GitHub public API search. Cover: GitHub OpenGraph image.",
    category: "portfolio",
    tags: ["Awesome List", "GitHub", "Resources", "Vibe Coding"],
    tech: ["Markdown", "AI"],
    projectUrl: "https://github.com/ai-vibe/awesome-vibe-coding",
    sourceUrl: "https://github.com/ai-vibe/awesome-vibe-coding",
    coverImageUrl: githubOg("ai-vibe/awesome-vibe-coding"),
    likeCount: 692,
    commentCount: 17,
    bookmarkCount: 180,
    hotScore: 980,
    isFeatured: true
  },
  {
    slug: "vibe-coding-cn",
    title: "Vibe Coding CN",
    summary: "A Chinese-language vibe-coding resource repository.",
    description:
      "Vibe Coding CN ranked highly in GitHub public API search and is useful as a Chinese-language portfolio of vibe-coding resources.",
    purpose: "Help Chinese readers discover local explanations, references, and project materials for vibe coding.",
    howToUse: "Open the GitHub repository and use the README or files as a learning and discovery index.",
    buildNotes: "Source: GitHub public API search. Cover: GitHub OpenGraph image.",
    category: "portfolio",
    tags: ["Chinese", "GitHub", "Resources", "Portfolio"],
    tech: ["Python", "Markdown"],
    projectUrl: "https://github.com/2025Emma/vibe-coding-cn",
    sourceUrl: "https://github.com/2025Emma/vibe-coding-cn",
    coverImageUrl: githubOg("2025Emma/vibe-coding-cn"),
    likeCount: 20283,
    commentCount: 40,
    bookmarkCount: 1600,
    hotScore: 1400,
    isFeatured: true
  },
  {
    slug: "palette-inspiration",
    title: "Palette Inspiration",
    summary: "Explore color palettes inspired by thousands of master painter artworks.",
    description:
      "Palette Inspiration was found in Hacker News Show HN and is valuable for improving visual taste in AI-generated interfaces.",
    purpose: "Help builders choose richer palettes before asking AI to generate UI.",
    howToUse: "Open the site, browse artwork-inspired palettes, and reuse one as design direction for a vibe-coded interface.",
    buildNotes: "Source: OpenCLI Hacker News Show HN feed. Cover: website screenshot.",
    category: "portfolio",
    tags: ["Color", "Design Taste", "Show HN", "Palette"],
    tech: ["Web", "Design"],
    projectUrl: "https://paletteinspiration.com/",
    sourceUrl: "https://news.ycombinator.com/item?id=48026342",
    coverImageUrl: screenshot("https://paletteinspiration.com/"),
    likeCount: 207,
    commentCount: 81,
    bookmarkCount: 92,
    hotScore: 860,
    isFeatured: false
  },
  {
    slug: "exploreyc",
    title: "ExploreYC",
    summary: "A data layer for Y Combinator's startup ecosystem.",
    description:
      "ExploreYC came from Product Hunt's developer tools feed and fits data visualization because it turns startup ecosystem data into a browsable product.",
    purpose: "Explore company, batch, and ecosystem patterns in YC data.",
    howToUse: "Open the Product Hunt page, follow the product link, and browse YC company data by the provided views.",
    buildNotes: "Source: OpenCLI Product Hunt developer-tools feed. Cover: Product Hunt page screenshot.",
    category: "data-viz",
    tags: ["Data", "YC", "Visualization", "Product Hunt"],
    tech: ["Data", "Web App"],
    projectUrl: "https://www.producthunt.com/products/yc-company-explorer",
    sourceUrl: "https://www.producthunt.com/products/yc-company-explorer",
    coverImageUrl: screenshot("https://www.producthunt.com/products/yc-company-explorer"),
    likeCount: 190,
    commentCount: 12,
    bookmarkCount: 74,
    hotScore: 850,
    isFeatured: true
  },
  {
    slug: "clearmesh",
    title: "ClearMesh",
    summary: "A Git-like platform for datasets, models, and binary folders.",
    description:
      "ClearMesh appeared at the top of Product Hunt's developer tools feed and belongs in data visualization/data workflow because it makes heavyweight data assets manageable.",
    purpose: "Give teams a clearer way to version and inspect datasets and models.",
    howToUse: "Open the Product Hunt page, review the asset workflow, and use it for dataset or model-folder projects.",
    buildNotes: "Source: OpenCLI Product Hunt developer-tools feed. Cover: Product Hunt page screenshot.",
    category: "data-viz",
    tags: ["Data", "Models", "Versioning", "Product Hunt"],
    tech: ["Data", "ML"],
    projectUrl: "https://www.producthunt.com/products/clearmesh",
    sourceUrl: "https://www.producthunt.com/products/clearmesh",
    coverImageUrl: screenshot("https://www.producthunt.com/products/clearmesh"),
    likeCount: 230,
    commentCount: 14,
    bookmarkCount: 86,
    hotScore: 900,
    isFeatured: false
  },
  {
    slug: "gpu-fund",
    title: "gpu.fund",
    summary: "Live GPU cloud rental prices.",
    description:
      "gpu.fund was found in Hacker News Show HN and fits data visualization because it turns infrastructure pricing into a live comparison surface.",
    purpose: "Help AI builders compare GPU rental prices before choosing infrastructure.",
    howToUse: "Open the live site and compare GPU cloud prices before running model or agent workloads.",
    buildNotes: "Source: OpenCLI Hacker News Show HN feed. Cover: website screenshot.",
    category: "data-viz",
    tags: ["GPU", "Pricing", "Show HN", "Data"],
    tech: ["Data Viz", "Cloud"],
    projectUrl: "https://gpu.fund/",
    sourceUrl: "https://news.ycombinator.com/item?id=48043273",
    coverImageUrl: screenshot("https://gpu.fund/"),
    likeCount: 90,
    commentCount: 8,
    bookmarkCount: 46,
    hotScore: 700,
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
    const isOpenSource = item.sourceUrl?.includes("github.com") ?? false;
    const now = new Date();

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
        isOpenSource,
        isFeatured: item.isFeatured,
        likeCount: 0,
        commentCount: 0,
        bookmarkCount: 0,
        hotScore: item.hotScore,
        submittedAt: now,
        approvedAt: now,
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
        isOpenSource,
        isFeatured: item.isFeatured,
        likeCount: 0,
        commentCount: 0,
        bookmarkCount: 0,
        hotScore: item.hotScore,
        submittedAt: now,
        approvedAt: now,
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
      const techStack = await prisma.techStack.upsert({
        where: { slug },
        update: { name: techName },
        create: { slug, name: techName }
      });
      await prisma.projectTechStack.create({
        data: { projectId: project.id, techStackId: techStack.id }
      });
    }
  }

  console.log(`Imported ${projects.length} deep curated projects.`);
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
