import Link from "next/link";
import type { ReactNode } from "react";
import { ProjectCard } from "@/components/project-card";
import {
  getCategoryNames,
  getDiscoverProjectPage,
  getTagNames,
  getTechStackNames
} from "@/lib/projects";

type DiscoverSearchParams = {
  category?: string;
  q?: string;
  sort?: "hot" | "latest" | "bookmarks" | "comments";
  tech?: string;
  tag?: string;
  page?: string;
};

const sortOptions = [
  { value: "hot", label: "热门" },
  { value: "latest", label: "最新" },
  { value: "bookmarks", label: "收藏最多" },
  { value: "comments", label: "评论最多" }
] as const;

const PAGE_SIZE = 9;

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
  const currentPage = Math.max(1, Number(resolvedSearchParams.page ?? "1") || 1);

  const [categories, techStacks, tags, result] = await Promise.all([
    getCategoryNames(),
    getTechStackNames(),
    getTagNames(),
    getDiscoverProjectPage({
      category: activeCategory || undefined,
      search: activeQuery || undefined,
      sort: activeSort,
      tech: activeTech || undefined,
      tag: activeTag || undefined,
      page: currentPage,
      pageSize: PAGE_SIZE
    })
  ]);

  const discoverLink = (
    updates: Partial<DiscoverSearchParams>,
    clears: Array<keyof DiscoverSearchParams> = []
  ) => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    if (activeQuery) params.set("q", activeQuery);
    if (activeSort !== "hot") params.set("sort", activeSort);
    if (activeTech) params.set("tech", activeTech);
    if (activeTag) params.set("tag", activeTag);
    if (currentPage > 1) params.set("page", String(currentPage));

    clears.forEach((key) => params.delete(key));
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    if (updates.category || updates.q || updates.sort || updates.tech || updates.tag) {
      params.delete("page");
    }

    const query = params.toString();
    return `/discover${query ? `?${query}` : ""}`;
  };

  const activeFilterCount = [activeCategory, activeQuery, activeTech, activeTag, activeSort !== "hot"].filter(Boolean)
    .length;

  return (
    <main className="page-band">
      <div className="page-shell">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div className="max-w-3xl space-y-4">
            <span className="page-kicker">Discover</span>
            <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">发现项目</h1>
            <p className="text-sm leading-7 text-text/64 md:text-base">
              用排序、分类、技术栈和标签快速缩小范围，找到更符合当前灵感方向的作品。
            </p>
          </div>
          <div className="panel grid grid-cols-2 gap-4 p-5 text-sm">
            <div>
              <p className="text-3xl font-semibold text-text">{result.totalCount}</p>
              <p className="mt-1 text-xs text-text/48">可浏览项目</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-text">{activeFilterCount}</p>
              <p className="mt-1 text-xs text-text/48">当前筛选</p>
            </div>
          </div>
        </div>

        <form action="/discover" className="panel mt-8 grid gap-3 p-4 md:grid-cols-[1fr_180px]">
          {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
          {activeSort !== "hot" ? <input type="hidden" name="sort" value={activeSort} /> : null}
          {activeTech ? <input type="hidden" name="tech" value={activeTech} /> : null}
          {activeTag ? <input type="hidden" name="tag" value={activeTag} /> : null}
          <input name="q" defaultValue={activeQuery} placeholder="搜索项目、标签、技术栈" className="field" />
          <button type="submit" className="btn-primary">
            搜索
          </button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2 border-b border-border/70 pb-6">
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

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="panel h-fit p-5 lg:sticky lg:top-24">
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
              <span>{result.totalCount} 个项目</span>
              <span>
                第 {result.page} / {result.totalPages} 页
              </span>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {result.projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
              {result.projects.length === 0 ? <div className="panel p-6 text-sm text-text/60">没有找到匹配的项目。</div> : null}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <PaginationLink
                href={result.page > 1 ? discoverLink({ page: String(result.page - 1) }) : undefined}
                disabled={result.page <= 1}
              >
                上一页
              </PaginationLink>
              <PaginationLink
                href={result.page < result.totalPages ? discoverLink({ page: String(result.page + 1) }) : undefined}
                disabled={result.page >= result.totalPages}
              >
                下一页
              </PaginationLink>
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

function PaginationLink({
  href,
  disabled,
  children
}: {
  href?: string;
  disabled: boolean;
  children: ReactNode;
}) {
  const baseClass = "btn-secondary px-4 py-2 text-sm";
  if (disabled || !href) {
    return (
      <span className={`${baseClass} pointer-events-none opacity-40`} aria-disabled="true">
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={baseClass}>
      {children}
    </Link>
  );
}
