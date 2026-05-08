import { submitProjectAction } from "@/app/submit/actions";
import { getCategoryNames } from "@/lib/projects";

export default async function SubmitPage() {
  const categories = await getCategoryNames();

  return (
    <main className="page-band">
      <div className="page-shell">
        <div className="mb-8 space-y-3">
          <span className="page-kicker">Submit</span>
          <h1 className="text-4xl font-semibold text-text md:text-5xl">提交你的作品</h1>
          <p className="text-sm leading-7 text-text/64 md:text-base">
            页面已经可以写入数据库，提交后会直接进入作品详情页。
          </p>
        </div>

        <form action={submitProjectAction} className="panel space-y-6 p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-text">项目链接</span>
              <input name="projectUrl" className="field" placeholder="https://..." />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-text">标题</span>
              <input name="title" className="field" placeholder="项目名称" />
            </label>
          </div>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-text">一句话简介</span>
            <textarea name="summary" className="field-area" />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-text">使用方式</span>
              <textarea name="howToUse" className="field-area" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-text">创作目的</span>
              <textarea name="purpose" className="field-area" />
            </label>
          </div>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-text">详细描述</span>
            <textarea name="description" className="field-area" />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-text">分类</span>
              <select name="category" className="field text-sm">
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm md:col-span-2">
              <span className="font-medium text-text">封面图链接</span>
              <input name="coverImageUrl" className="field" placeholder="https://..." />
            </label>
          </div>

          <button type="submit" className="btn-primary">
            提交审核
          </button>
        </form>
      </div>
    </main>
  );
}
