import Link from "next/link";
import type { ReactNode } from "react";
import { ProjectCard } from "@/components/project-card";
import { getCategoryNames, getProjectCards, getTagNames, getTechStackNames } from "@/lib/projects";

type DiscoverSearchParams = {
  category?: string;
  q?: string;
  sort?: "hot" | "latest" | "bookmarks" | "comments";
  tech?: string;
  tag?: string;
};

const sortOptions = [
  { value: "hot", label: "热门" },
  { value: "latest", label: "最新" },
  { value: "bookmarks", label: "收藏最多" },
  { value: "comments", label: "评论最多" }
] as const;

export default async function DiscoverPage({
  searchParams
}: {
  searchParams?: Promise<DiscoverSearchParams>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const activeCategory = resolvedSearchParams.category;
  const activeQuery = resolvedSearchParams.q ?? "";
  const activeSort = resolvedSearchParams.sort ?? "hot";
  const activeTech = resolvedSearchParams.tech;
  const activeTag = resolvedSearchParams.tag;

  const [categories, techStacks, tags, projects] = await Promise.all([
    getCategoryNames(),
    getTechStackNames(),
    getTagNames(),
    getProjectCards({
      category: activeCategory || undefined,
      search: activeQuery || undefined,
      sort: activeSort,
      tech: activeTech || undefined,
      tag: activeTag || undefined
    })
  ]);

  const discoverLink = (updates: Partial<DiscoverSearchParams>, clears: Array<keyof DiscoverSearchParams> = []) => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (activeQuery) params.set("q", activeQuery);
    if (activeSort !== "hot") params.set("sort", activeSort);
    if (activeTech) params.set("tech", activeTech);
    if (activeTag) params.set("tag", activeTag);

    clears.forEach((key) => params.delete(key));
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    const query = params.toString();
    return `/discover${query ? `?${query}` : ""}`;
  };

  const activeFilterCount = [activeCategory, activeQuery, activeTech, activeTag, activeSort !== "hot"].filter(Boolean).length;

  return (
    <main className="page-band">
      <div className="page-shell">
        <div className="max-w-3xl space-y-4">
          <span className="page-kicker">Discover</span>
          <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">
            发现项目
          </h1>
          <p className="text-sm leading-7 text-text/64 md:text-base">
            用排序、分类、技术栈和标签快速缩小范围，找到更符合当前灵感方向的作品。
          </p>
        </div>

        <form action="/discover" className="panel mt-8 grid gap-3 p-4 md:grid-cols-[1fr_180px]">
          {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
          {activeSort !== "hot" ? <input type="hidden" name="sort" value={activeSort} /> : null}
          {activeTech ? <input type="hidden" name="tech" value={activeTech} /> : null}
          {activeTag ? <input type="hidden" name="tag" value={activeTag} /> : null}
          <input
            name="q"
            defaultValue={activeQuery}
            placeholder="搜索项目、标签、技术栈"
            className="field"
          />
          <button type="submit" className="btn-primary">
            搜索
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={discoverLink({ category: undefined }, ["category"])} className={`chip ${!activeCategory ? "chip-active" : ""}`}>
            全部
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={discoverLink({ category })}
              className={`chip transition hover:border-primary/20 hover:text-text ${
                activeCategory === category ? "chip-active" : ""
              }`}
            >
              {category}
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="panel h-fit p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-text">筛选</h2>
              {activeFilterCount > 0 ? (
                <Link href="/discover" className="text-xs font-medium text-text/52 transition hover:text-text">
                  清除
                </Link>
              ) : null}
            </div>

            <FilterGroup title="排序">
              {sortOptions.map((option) => (
                <Link
                  key={option.value}
                  href={discoverLink({ sort: option.value })}
                  className={`filter-chip ${activeSort === option.value ? "filter-chip-active" : ""}`}
                >
                  {option.label}
                </Link>
              ))}
            </FilterGroup>

            <FilterGroup title="技术栈">
              {techStacks.slice(0, 12).map((tech) => (
                <Link
                  key={tech}
                  href={discoverLink({ tech: activeTech === tech ? undefined : tech })}
                  className={`filter-chip ${activeTech === tech ? "filter-chip-active" : ""}`}
                >
                  {tech}
                </Link>
              ))}
            </FilterGroup>

            <FilterGroup title="标签">
              {tags.slice(0, 16).map((tag) => (
                <Link
                  key={tag}
                  href={discoverLink({ tag: activeTag === tag ? undefined : tag })}
                  className={`filter-chip ${activeTag === tag ? "filter-chip-active" : ""}`}
                >
                  {tag}
                </Link>
              ))}
            </FilterGroup>
          </aside>

          <section>
            <div className="mb-4 flex items-center justify-between gap-3 text-sm text-text/54">
              <span>{projects.length} 个项目</span>
              {activeFilterCount > 0 ? <span>已应用 {activeFilterCount} 个筛选</span> : null}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
              {projects.length === 0 ? (
                <div className="panel p-6 text-sm text-text/60">没有找到匹配的项目。</div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-5 border-t border-border pt-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-text/44">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
