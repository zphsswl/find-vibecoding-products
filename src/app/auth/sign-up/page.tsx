import Link from "next/link";
import { signUpAction } from "@/app/auth/sign-up/actions";

export default function SignUpPage() {
  return (
    <main className="page-band">
      <div className="page-shell mx-auto max-w-lg">
        <div className="text-center">
          <span className="page-kicker">Sign up</span>
          <h1 className="mt-4 text-4xl font-semibold text-text md:text-5xl">注册</h1>
        </div>
        <p className="mx-auto mt-4 max-w-md text-center text-sm leading-7 text-text/64">
          创建账号后可以投稿、评论和收藏。注册只需要用户名和密码，展示名会自动生成。
        </p>
        <form action={signUpAction} className="panel mt-8 space-y-5 p-6 md:p-8">
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-text">用户名</span>
            <input name="username" className="field" placeholder="yourname" />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-text">密码</span>
            <input name="password" type="password" className="field" placeholder="至少 6 位" />
          </label>
          <button type="submit" className="btn-primary">
            注册并进入
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-text/60">
          已有账号？{" "}
          <Link href="/auth/sign-in" className="font-medium text-text">
            登录
          </Link>
        </p>
      </div>
    </main>
  );
}
