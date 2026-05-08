import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const removeSlugs = [
  "google-ai-studio-2",
  "ai-landing-builder",
  "cloudflare-vibesdk",
  "softr-ai-cobuilder",
  "runner-ai-store",
  "devally",
  "clearmesh",
  "exploreyc",
  "gpu-fund",
  "aicw-video",
  "picsart-cli"
];

const updates = {
  "claude-code-best-practice": {
    summary: "从 vibe coding 走向 agentic engineering 的高质量 Claude Code 实践指南。",
    description:
      "这是一个围绕 Claude Code、上下文工程、子代理和工作流治理整理的大型实践库。它不像单纯的工具列表，更像一份把随手 vibe coding 变成可复用工程方法的路线图。",
    purpose: "帮助创作者减少随意提示带来的混乱，把 AI 编程沉淀成稳定、可复盘的工作方式。",
    howToUse: "从 README 的最佳实践和命令组织方式开始，挑选适合自己项目的上下文、技能和代理流程逐步迁移。",
    buildNotes: "来源：GitHub 公共搜索中高热度 vibe coding / Claude Code 实践仓库。已保留为学习资源。"
  },
  "vibe-coding-cn": {
    summary: "面向中文用户的 vibe coding 资料与项目索引。",
    description:
      "这个仓库整理了中文语境下的 vibe coding 资料，适合放在作品集分类中作为本地化资料入口。它的价值在于降低中文用户理解 AI 编程方法的门槛。",
    purpose: "让中文读者更容易找到 vibe coding 的概念、工具和实践材料。",
    howToUse: "打开 GitHub 仓库，按 README 和目录索引浏览工具、教程和案例。",
    buildNotes: "来源：GitHub 公共搜索。保留为中文资源型作品集。"
  },
  "open-lovart": {
    summary: "开源视觉设计智能体，用来生成海报、品牌套件和广告创意。",
    description:
      "Open-Lovart 是偏创意生产的开源设计 agent，适合这个站点的审美方向。它不是普通的大厂功能页，而是能启发创作者搭建自己视觉工作流的项目。",
    purpose: "给想做品牌视觉、海报、广告图的创作者一个可自托管的 AI 设计起点。",
    howToUse: "查看 GitHub README，按说明部署或体验示例，再把它用于品牌稿、活动图或产品视觉探索。",
    buildNotes: "来源：GitHub 公共搜索 AI design agent。保留为 AI 设计类。"
  },
  "wonder-design-agent": {
    summary: "在画布上工作的 AI 设计智能体，适合从想法直接探索界面。",
    description:
      "Wonder 的核心亮点是把 AI 设计放在 canvas 上，而不是只返回一段文字或静态图。这种工作方式更接近真实产品设计，也更符合有审美的 vibe coding。",
    purpose: "让产品想法更快变成可看、可改、可比较的视觉方案。",
    howToUse: "从 Product Hunt 页面进入产品，观察画布式生成流程，用一个小产品页面或组件想法做测试。",
    buildNotes: "来源：OpenCLI Product Hunt design-tools。保留为 AI 设计类。"
  },
  "cosine-swarm": {
    summary: "用并行 AI agents 处理复杂、长周期的软件任务。",
    description:
      "Cosine Swarm 关注多 agent 协作，适合那些已经不满足于单轮 prompt 的构建者。它更像一个复杂任务协作实验场，而不是普通代码助手。",
    purpose: "让大型 vibe coding 任务可以被拆分、并行推进并持续追踪。",
    howToUse: "先阅读 Product Hunt 介绍，再用一个较复杂的功能或重构任务测试多 agent 协作方式。",
    buildNotes: "来源：OpenCLI Product Hunt vibe-coding 分类。保留为智能体工具。"
  },
  "baton-agents": {
    summary: "把多个 AI coding agents 编排成可管理的工作流。",
    description:
      "Baton 解决的是 agent 多了以后如何分配、跟踪和接力的问题。对于严肃使用 vibe coding 的团队，这类编排工具比单个聊天框更有价值。",
    purpose: "让多个 coding agent 的任务分工和执行状态更清晰。",
    howToUse: "从 Product Hunt 页面了解编排模型，再把它用于多步骤构建或多人协作项目。",
    buildNotes: "来源：OpenCLI Product Hunt vibe-coding 分类。保留为智能体工具。"
  },
  "facts-product-specs": {
    summary: "把模糊想法压成更清晰的产品事实和规格。",
    description:
      "Facts 的价值不在于直接写代码，而是在 vibe coding 前把需求讲清楚。好的规格会显著提升 AI 生成项目的质量，因此适合作为开发工作流工具。",
    purpose: "减少 AI 编程里的含糊需求，让项目开始前就有更清晰的判断依据。",
    howToUse: "在让 agent 开发前，用它整理目标用户、功能边界、约束和验收标准。",
    buildNotes: "来源：OpenCLI Product Hunt vibe-coding 分类。保留为开发工作流。"
  },
  "codehealth-mcp": {
    summary: "给 AI 生成代码加上可维护性检查的 MCP 工具。",
    description:
      "CodeHealth MCP Server 适合用来对冲 vibe coding 的副作用：代码生成很快，但结构和维护成本容易失控。它把代码健康检查接入 agent 工作流。",
    purpose: "让快速生成的代码在进入项目之前经过结构和维护性审查。",
    howToUse: "按 CodeScene 的 MCP 说明接入你的编码环境，在生成或重构后运行健康检查。",
    buildNotes: "来源：OpenCLI Product Hunt vibe-coding 分类。保留为开发工作流。"
  },
  "gastown-agent-patterns": {
    summary: "关于 agent 模式、设计瓶颈和规模化 vibe coding 的深度案例。",
    description:
      "这篇文章不是工具，而是非常适合学习的案例材料。它讨论了当 AI 编程进入真实产品和设计流程后，会遇到哪些协作、审美和系统问题。",
    purpose: "帮助创作者理解 vibe coding 放大后会遇到的设计和工程瓶颈。",
    howToUse: "阅读文章后，把其中的 agent pattern 和瓶颈清单对照到自己的项目流程里。",
    buildNotes: "来源：OpenCLI Hacker News 搜索。保留为学习资源。"
  },
  "startups-rip": {
    summary: "用 AI 重建已经消失的 YC 创业想法，像一个项目灵感游乐场。",
    description:
      "Startups.RIP 很适合作为作品展示：它把失败创业项目变成可重建的灵感库，有趣、轻量，也很符合 vibe coding 的探索精神。",
    purpose: "给创作者提供大量可重新设计、重新实现的小产品灵感。",
    howToUse: "浏览项目里的 startup idea，挑一个感兴趣的方向，用 AI 快速做一个新版本。",
    buildNotes: "来源：OpenCLI Product Hunt vibe-coding 分类。保留为作品展示。"
  },
  "vibe-marketplace-greta": {
    summary: "把你 vibe coding 做出来的东西直接变成可出售作品。",
    description:
      "Vibe Marketplace by Greta 的方向很直接：不是只生成 demo，而是鼓励创作者把小作品上架、展示和交易。它很符合好玩且有价值的作品展示定位。",
    purpose: "推动创作者把 AI 快速构建的作品产品化，而不是停留在截图和 demo。",
    howToUse: "查看 Product Hunt 发布页，理解它如何包装和售卖小型 AI 构建作品。",
    buildNotes: "来源：OpenCLI Product Hunt vibe-coding 分类。保留为作品展示。"
  },
  "bookshelf-claude-code": {
    summary: "一个用 Claude Code 做书架项目的 Show HN 作品故事。",
    description:
      "这是一个具体的小作品案例，比泛泛而谈的工具更接近用户想看的 vibe coding 成果。它展示了如何把一个轻量想法做成可展示项目。",
    purpose: "给读者一个可模仿的小型 Claude Code 项目样本。",
    howToUse: "阅读作者的构建过程，再挑一个自己的小想法复刻类似的作品记录。",
    buildNotes: "来源：OpenCLI Hacker News 搜索。保留为作品展示。"
  },
  "lovable-mobile-app": {
    summary: "把 AI 应用构建带到手机上的移动工作台。",
    description:
      "Lovable Mobile App 虽然是成熟产品的延伸，但它仍然贴合 vibe coding：灵感出现时就能继续构建和调整。它比大厂平台更接近独立创作者日常。",
    purpose: "让创作者不必坐到桌前，也能继续推进应用想法。",
    howToUse: "从 Product Hunt 页面进入产品，体验用手机查看、调整或继续构建项目。",
    buildNotes: "来源：OpenCLI Product Hunt design-tools。保留为官网/入口类。"
  },
  "magic-studio-once-ui": {
    summary: "把 Once UI 设计系统变成可交付的网站和代理工作流。",
    description:
      "Magic Studio by Once UI 的价值在于它围绕设计系统和高质量 UI 交付展开，适合想做有审美网站的 vibe coding 用户。",
    purpose: "让设计系统、模板和 AI 构建更紧密地结合。",
    howToUse: "查看 Product Hunt 页面，观察它如何把组件系统包装成高质量交付流程。",
    buildNotes: "来源：OpenCLI Product Hunt developer-tools。保留为官网/设计入口。"
  },
  "motn-ai": {
    summary: "在一个画布里 vibe-code 动态图形和视觉动效。",
    description:
      "Motn AI 很符合“好玩、有审美”的筛选标准。它把 prompt、画布和 motion graphics 放在一起，适合做短视频、动效概念和视觉实验。",
    purpose: "让创作者不用复杂动效软件，也能快速尝试动态视觉。",
    howToUse: "从 Product Hunt 发布页进入产品，用一个标题、品牌或场景测试动态生成效果。",
    buildNotes: "来源：OpenCLI Product Hunt vibe-coding 分类。保留为工具类。"
  },
  "slicer-dev": {
    summary: "把网页上的交互组件复制成 AI 能理解的提示词。",
    description:
      "slicer.dev 是一个很实用的桥梁工具：看到喜欢的 UI 后，不是手动描述半天，而是把组件结构转成更适合 AI 复刻的提示。",
    purpose: "帮助创作者从优秀界面中提取可复用的设计和实现线索。",
    howToUse: "打开产品页，选择一个网页组件，生成 prompt 后交给你的 coding agent 重建。",
    buildNotes: "来源：OpenCLI Product Hunt vibe-coding 分类。保留为工具类。"
  },
  "openclick": {
    summary: "用自然语言驱动 macOS 点击和桌面自动化。",
    description:
      "Openclick 偏自动化，但它和 vibe coding 的连接在于能把重复操作交给 prompt。对调试、录入和跨工具流程很有帮助。",
    purpose: "把无法写 API 的桌面操作变成可以被 AI 执行的步骤。",
    howToUse: "按产品说明在 macOS 上配置，先用低风险的点击和表单任务测试。",
    buildNotes: "来源：OpenCLI Product Hunt developer-tools。保留为工具类。"
  },
  "design-md": {
    summary: "给 AI coding agent 读取的设计系统说明文件。",
    description:
      "Design.MD 很适合这个站点，因为它直接解决 AI 做 UI 时最常见的问题：不懂你的设计系统。它把设计约束写成 agent 可读格式。",
    purpose: "让 AI 生成页面时遵守品牌、组件和设计规则。",
    howToUse: "把 Design.MD 放入项目，让 coding agent 在实现 UI 前读取并遵循其中规范。",
    buildNotes: "来源：OpenCLI Product Hunt design-tools。保留为插件类。"
  },
  "kilo-code-v7": {
    summary: "VS Code 里的并行 agents、diff review 和多模型比较工具。",
    description:
      "Kilo Code v7 属于真正贴合 AI 编程的插件。它不是泛泛的编辑器扩展，而是把多 agent、审查和模型比较放进日常开发环境。",
    purpose: "让开发者在编辑器里更系统地使用多个 AI coding agents。",
    howToUse: "安装 VS Code 插件后，用一个小 issue 测试并行 agent 和 diff reviewer。",
    buildNotes: "来源：OpenCLI Product Hunt developer-tools。保留为插件类。"
  },
  "aion-quest": {
    summary: "一个让 AI agents 比赛写代码和交付的软件游戏。",
    description:
      "Aion Quest 是非常符合“好玩”的项目。它把 agentic coding 做成游戏化体验，让 AI agents 的构建过程变得可观看、可比较。",
    purpose: "用游戏方式展示和测试 AI agents 的软件交付能力。",
    howToUse: "打开项目网站，观察 agents 如何竞争、推进任务和交付结果。",
    buildNotes: "来源：OpenCLI Hacker News Show HN。保留为小游戏。"
  },
  "makko-ai": {
    summary: "用 AI 生成 2D 游戏美术和可玩的小游戏原型。",
    description:
      "Makko AI 把游戏资产生成和 playable prototype 结合起来，很适合创作者快速探索小游戏概念。",
    purpose: "降低做 2D 小游戏视觉和原型的门槛。",
    howToUse: "从 Product Hunt 页面进入产品，试着生成一组角色、场景或小游戏概念。",
    buildNotes: "来源：OpenCLI Product Hunt design-tools。保留为小游戏。"
  },
  "gas-city": {
    summary: "一个关于 AI 软件工厂的实验性产品。",
    description:
      "Gas City 探索的是“自己的软件工厂”这种更大的 AI 构建系统。虽然偏实验，但和 vibe coding 的未来形态高度相关。",
    purpose: "帮助创作者理解多步骤软件生产如何被 AI 化和系统化。",
    howToUse: "阅读 Product Hunt 发布页，观察它如何组织构建、运行和交付流程。",
    buildNotes: "来源：OpenCLI Product Hunt developer-tools。保留为实验类。"
  },
  "duck-duck-duck-ideo": {
    summary: "给 Claude Code 配一个有观点的设计评审伙伴。",
    description:
      "Duck, Duck, Duck! by IDEO 很有趣：它不是帮你多写代码，而是让 AI 编程过程多一个审美和判断维度。",
    purpose: "在快速生成代码时加入设计批评和反思，减少低质量输出。",
    howToUse: "查看发布页，理解它如何作为 Claude Code 的评审伙伴参与工作流。",
    buildNotes: "来源：OpenCLI Product Hunt vibe-coding 分类。保留为实验类。"
  },
  "imgcmd": {
    summary: "直接从命令行生成真实 PNG 文件的安全 CLI。",
    description:
      "imgcmd 是一个小而明确的实验：让 AI 图像生成直接进入项目文件系统。它适合给 vibe coding 项目快速补视觉素材。",
    purpose: "让创作者在写代码时顺手生成可用的位图资产。",
    howToUse: "按发布页说明安装 CLI，在测试目录里生成一张图标、封面或插图。",
    buildNotes: "来源：OpenCLI Product Hunt vibe-coding 分类。保留为实验类。"
  },
  "awesome-vibe-coding": {
    summary: "一个收集 vibe coding 工具和资源的精选列表。",
    description:
      "Awesome Vibe Coding 适合作为入口型作品集。它帮助用户继续发现更多工具、教程和案例，是这个项目库的外部延展。",
    purpose: "给读者提供更广的 vibe coding 工具地图。",
    howToUse: "打开 GitHub 仓库，按工具类型和资源类型继续探索。",
    buildNotes: "来源：GitHub 公共搜索。保留为作品集。"
  },
  "palette-inspiration": {
    summary: "从大师绘画里提取色彩灵感，帮助 AI UI 更有审美。",
    description:
      "Palette Inspiration 虽不是 coding 工具，但它解决了 AI 生成 UI 的审美短板。对于想做漂亮作品的人，色彩灵感非常有价值。",
    purpose: "帮助创作者在生成界面前先确定更成熟的色彩方向。",
    howToUse: "浏览喜欢的画作配色，把色板用于下一次页面或组件生成。",
    buildNotes: "来源：OpenCLI Hacker News Show HN。保留为作品集/审美资源。"
  },
  "indie-playground": {
    summary: "一个 VS Code 风格的开源 Postgres UI，界面完成度很高。",
    description:
      "SereneUI 展示了数据库工具也可以有清爽、熟悉且有质感的界面。它适合作为高完成度 UI 参考，而不只是工具链接。",
    purpose: "给数据和开发工具类界面提供可学习的视觉参考。",
    howToUse: "打开 GitHub 项目，查看 serene-ui 的结构和界面实现，把布局思路用于自己的工具页面。",
    buildNotes: "来源：OpenCLI Hacker News Show HN。保留为作品集。"
  },
  "lumi-ai-builder": {
    summary: "一个面向应用和网站生成的轻量 AI builder。",
    description:
      "Lumi 来自 Show HN 的 AI app builder 结果。它更偏独立产品和小团队工具，符合应用生成类的筛选方向。",
    purpose: "帮助创作者快速把 app 或网站想法变成可运行版本。",
    howToUse: "打开项目页，输入一个小型应用想法，观察生成结果和可编辑程度。",
    buildNotes: "来源：OpenCLI Hacker News 搜索。保留为应用生成。"
  },
  "zoer-ai": {
    summary: "从数据库结构开始生成全栈 Web 应用。",
    description:
      "Zoer.ai 的特点是从 database up 构建应用，比单纯页面生成更接近真实产品。它适合需要数据模型支撑的 vibe coding 项目。",
    purpose: "让创作者围绕数据结构快速生成全栈应用。",
    howToUse: "从 Product Hunt 页面进入产品，先描述数据对象，再迭代页面和功能。",
    buildNotes: "来源：OpenCLI Product Hunt vibe-coding 分类。保留为应用生成。"
  }
};

async function main() {
  await prisma.project.updateMany({
    where: { slug: { in: removeSlugs } },
    data: { status: "archived", isFeatured: false }
  });

  for (const [slug, data] of Object.entries(updates)) {
    await prisma.project.update({
      where: { slug },
      data
    });
  }

  console.log(`Archived ${removeSlugs.length} less-relevant projects and localized ${Object.keys(updates).length} retained projects.`);
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
