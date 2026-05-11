import { submitProjectAction } from "@/app/submit/actions";
import { getCategoryNames } from "@/lib/projects";

export default async function SubmitPage() {
  const categories = await getCategoryNames();

  return (
    <main className="page-band">
      <div className="page-shell">
        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div className="max-w-3xl space-y-3">
            <span className="page-kicker">Submit</span>
            <h1 className="text-4xl font-semibold text-text md:text-5xl">提交你的作品</h1>
            <p className="text-sm leading-7 text-text/64 md:text-base">
              提交后会进入待审核状态，管理员确认内容质量和链接可访问后再公开展示。
            </p>
          </div>
          <div className="panel p-5 text-sm leading-7 text-text/58">
            完整的标题、封面、使用方式和创作目的会让作品更容易被理解，也更容易通过审核。
          </div>
        </div>

        <form action={submitProjectAction} className="panel space-y-7 p-6 md:p-8">
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

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-text">本地上传封面</span>
              <input name="coverImageFile" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" className="field" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-text">文字封面</span>
              <input
                name="coverText"
                className="field"
                placeholder="例如：让作品一眼说明用途"
              />
            </label>
          </div>

          <p className="text-xs leading-6 text-text/52">
            你可以只填文字封面，不传图片；也可以上传本地封面图，或继续使用外部链接。
          </p>

          <button type="submit" className="btn-primary">
            提交审核
          </button>
        </form>
      </div>
    </main>
  );
}
