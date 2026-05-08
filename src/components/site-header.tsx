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
    <header className="sticky top-0 z-30 border-b border-border/80 bg-white/75 backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.12em] text-text">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-[11px]">
            VC
          </span>
          <span>Vibe Coding Gallery</span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-text/65">
          <nav className="hidden items-center gap-2 sm:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 transition hover:bg-white hover:text-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href={`/users/${user.username}`} className="font-medium text-text">
                  @{user.username}
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
