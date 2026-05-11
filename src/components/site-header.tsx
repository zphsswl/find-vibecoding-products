import Link from "next/link";
import { signOutAction } from "@/app/auth/sign-in/actions";
import { getCurrentUser } from "@/lib/session";

const navItems = [
  { href: "/discover", label: "发现" },
  { href: "/collections", label: "榜单" },
  { href: "/submit", label: "投稿" }
];

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-[hsl(var(--surface)/0.82)] backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between py-4 lg:py-5">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-text">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-[hsl(var(--surface-strong)/0.92)] text-[10px] tracking-[0.16em]">
            VC
          </span>
          <span className="hidden sm:block">Vibe Coding Gallery</span>
          <span className="sm:hidden">Gallery</span>
        </Link>

        <div className="flex items-center gap-3 text-sm text-text/65 sm:gap-4">
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 transition hover:bg-[hsl(var(--surface-strong)/0.92)] hover:text-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <Link href="/messages" className="font-medium text-text transition hover:text-text/70">
                  私信
                </Link>
                <Link href="/me" className="font-medium text-text transition hover:text-text/70">
                  我的
                </Link>
                <form action={signOutAction}>
                  <button type="submit" className="btn-secondary px-3 py-1.5 text-xs">
                    退出
                  </button>
                </form>
              </>
            ) : (
              <Link href="/auth/sign-in" className="btn-secondary px-3 py-1.5 text-xs">
                登录
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
