import Link from "next/link";
import { signInAction } from "@/app/auth/sign-in/actions";

export default async function SignInPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const error = resolvedSearchParams.error;
  return (
    <main className="page-band">
      <div className="page-shell mx-auto max-w-lg">
        <div className="text-center">
          <span className="page-kicker">Sign in</span>
          <h1 className="mt-4 text-4xl font-semibold text-text md:text-5xl">登录</h1>
        </div>
        <p className="mx-auto mt-4 max-w-md text-center text-sm leading-7 text-text/64">
          输入用户名和密码即可进入你的账号。
        </p>
        <form action={signInAction} className="panel mt-8 space-y-5 p-6 md:p-8">
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-text">用户名</span>
            <input name="username" className="field" placeholder="admin" />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-text">密码</span>
            <input name="password" type="password" className="field" placeholder="至少 6 位" />
          </label>
          <button type="submit" className="btn-primary">
            登录
          </button>
        </form>
        {error === "not_registered" ? (
          <p className="mt-4 text-center text-sm font-medium text-red-600">请先注册！</p>
        ) : null}
        <p className="mt-5 text-center text-sm text-text/60">
          还没有账号？{" "}
          <Link href="/auth/sign-up" className="font-medium text-text">
            注册
          </Link>
        </p>
      </div>
    </main>
  );
}
