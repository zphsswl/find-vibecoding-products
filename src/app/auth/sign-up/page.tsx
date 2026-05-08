import { signUpAction } from "@/app/auth/sign-up/actions";

export default function SignUpPage() {
  return (
    <main className="page-band">
      <div className="page-shell mx-auto max-w-md">
        <span className="page-kicker">Sign up</span>
        <h1 className="mt-4 text-4xl font-semibold text-text">注册</h1>
        <p className="mt-3 text-sm leading-7 text-text/64">创建一个账号后就可以投稿、评论和收藏。</p>
        <form action={signUpAction} className="panel mt-8 space-y-4 p-6 md:p-8">
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-text">用户名</span>
            <input name="username" className="field" placeholder="yourname" />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-text">展示名</span>
            <input name="displayName" className="field" placeholder="Your Name" />
          </label>
          <button type="submit" className="btn-primary">
            注册并进入
          </button>
        </form>
      </div>
    </main>
  );
}
