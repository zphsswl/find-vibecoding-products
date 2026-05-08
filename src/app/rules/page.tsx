export default function RulesPage() {
  return (
    <main className="page-band">
      <div className="page-shell mx-auto max-w-4xl">
        <span className="page-kicker">Rules</span>
        <h1 className="mt-4 text-4xl font-semibold text-text">社区规则</h1>
        <div className="panel mt-8 space-y-4 p-6 text-sm leading-7 text-text/70 md:p-8">
          <p>1. 只提交真实可访问的项目链接。</p>
          <p>2. 项目必须说明使用方式和创作目的。</p>
          <p>3. 禁止垃圾内容、钓鱼链接、侵权内容和恶意广告。</p>
          <p>4. 评论保持建设性，重复违规会被折叠或封禁。</p>
        </div>
      </div>
    </main>
  );
}
