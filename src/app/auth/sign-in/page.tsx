import { signInAction } from "@/app/auth/sign-in/actions";

export default function SignInPage() {
  return (
    <main className="page-band">
      <div className="page-shell mx-auto max-w-md">
        <span className="page-kicker">Sign in</span>
        <h1 className="mt-4 text-4xl font-semibold text-text">登录</h1>
        <p className="mt-3 text-sm leading-7 text-text/64">
          可直接用 demo 用户名进入：`admin`、`ming`、`lina`、`aaron`。
        </p>
        <form action={signInAction} className="panel mt-8 space-y-4 p-6 md:p-8">
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-text">用户名</span>
            <input name="username" className="field" placeholder="admin" />
          </label>
          <button type="submit" className="btn-primary">
            登录
          </button>
        </form>
      </div>
    </main>
  );
}
