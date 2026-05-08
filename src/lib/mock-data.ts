export type Project = {
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
  status: "精选" | "热门" | "最新";
  image: string;
  url: string;
};

export const categories = [
  "官网",
  "工具",
  "SaaS",
  "插件",
  "小游戏",
  "实验",
  "作品集",
  "数据可视化"
];

export const projects: Project[] = [
  {
    slug: "ai-landing-builder",
    title: "AI Landing Builder",
    summary: "输入一句话就能生成高转化落地页。",
    purpose: "帮助独立创作者快速做产品宣传页。",
    howToUse: "输入产品名称、卖点和受众，自动生成页面文案和布局。",
    tags: ["AI", "落地页", "增长"],
    category: "官网",
    tech: ["Next.js", "Tailwind", "OpenAI"],
    author: "Ming",
    likes: 128,
    comments: 21,
    bookmarks: 46,
    status: "精选",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    url: "https://example.com"
  },
  {
    slug: "focus-commit",
    title: "Focus Commit",
    summary: "把待办变成有节奏的专注工作流。",
    purpose: "提高日常执行力和任务收敛速度。",
    howToUse: "把今天要做的事拆成 3 段，跟着计时器完成。",
    tags: ["效率", "任务", "习惯"],
    category: "工具",
    tech: ["React", "Supabase"],
    author: "Lina",
    likes: 93,
    comments: 17,
    bookmarks: 31,
    status: "热门",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    url: "https://example.com"
  },
  {
    slug: "indie-playground",
    title: "Indie Playground",
    summary: "一个给创作者做实验的项目集合页。",
    purpose: "展示 vibe coding 的实验性作品和构建过程。",
    howToUse: "浏览案例，查看技术栈和构建说明，再跳转到源码。",
    tags: ["开源", "实验", "社区"],
    category: "作品集",
    tech: ["Next.js", "MDX"],
    author: "Aaron",
    likes: 64,
    comments: 9,
    bookmarks: 25,
    status: "最新",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    url: "https://example.com"
  }
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

