# 技术架构图

## 1. 推荐架构

```text
Browser
  │
  ▼
Next.js App Router
  ├─ Server Components
  ├─ Route Handlers
  ├─ Server Actions
  └─ Metadata / SEO
  │
  ▼
Application Layer
  ├─ Project service
  ├─ Comment service
  ├─ Moderation service
  ├─ Search service
  └─ Notification service
  │
  ▼
Data Layer
  ├─ PostgreSQL
  ├─ Supabase Auth
  ├─ Supabase Storage
  └─ Optional search service
```

## 2. 技术选型

| 层 | 选择 | 原因 |
| --- | --- | --- |
| Web 框架 | Next.js App Router | SEO、服务端渲染、全栈路由成熟 |
| 语言 | TypeScript | 降低长期维护风险 |
| UI | Tailwind CSS + shadcn/ui | 可快速搭建稳定、克制的产品界面 |
| 数据库 | PostgreSQL | 适合关系数据、全文搜索、统计查询 |
| BaaS | Supabase | Auth、Storage、Postgres 集成度高 |
| ORM | Prisma | 类型安全、迁移管理清晰 |
| 部署 | Vercel | 与 Next.js 集成顺畅 |
| 图片 | Supabase Storage | 投稿截图和封面图管理 |

## 3. 目录结构建议

```text
app/
├─ page.tsx
├─ discover/page.tsx
├─ projects/[slug]/page.tsx
├─ submit/page.tsx
├─ users/[username]/page.tsx
└─ admin/page.tsx

components/
├─ layout/
├─ projects/
├─ filters/
└─ comments/

lib/
├─ data/
├─ db/
├─ auth/
└─ utils/

docs/
├─ PRD.md
├─ IA.md
├─ DATABASE.md
└─ ARCHITECTURE.md
```

## 4. 前端架构

- 首页和发现页优先使用服务端渲染，保证 SEO。
- 项目详情页生成 metadata，用于搜索和分享。
- 筛选条件通过 URL query 表达，便于分享和索引。
- 投稿表单使用客户端组件，提交到 Server Action 或 Route Handler。
- 评论区使用客户端交互，列表可服务端首屏渲染。

## 5. 后端架构

- 普通读取走服务端查询。
- 投稿、评论、点赞、收藏走鉴权接口。
- 审核状态控制公开可见性。
- 管理接口必须校验管理员角色。
- 评论和投稿需要限流。

## 6. 权限模型

```text
guest
├─ view approved projects
└─ view visible comments

user
├─ guest permissions
├─ submit project
├─ edit own draft/pending project
├─ comment
├─ vote
├─ bookmark
└─ report

moderator
├─ user permissions
├─ review reports
├─ hide comments
└─ review projects

admin
├─ moderator permissions
├─ manage categories
├─ manage tags
└─ manage featured projects
```

## 7. 数据流

### 投稿

```text
Submit form
  → validate input
  → create project(status=pending)
  → upload cover image
  → notify moderator
  → show pending state
```

### 审核

```text
Admin review queue
  → inspect project
  → approve/reject/request changes
  → write moderation action
  → update project status
  → notify author
```

### 浏览

```text
Discover page
  → parse filters from URL
  → query approved projects
  → apply sort
  → render project cards
```

## 8. 安全要求

- 所有用户输入必须做 schema 校验。
- 评论和投稿正文渲染时必须转义。
- 外链统一加 `rel="noopener noreferrer"`.
- 管理后台必须校验服务端权限。
- 投稿和评论接口必须限流。
- 图片上传限制大小和 MIME 类型。
- 举报和审核操作必须记录审计日志。

## 9. 性能要求

- 首页图片使用固定尺寸和懒加载。
- 项目列表分页或无限滚动。
- 热门榜单定时计算或缓存。
- 搜索字段建立索引。
- 避免在项目卡片上加载重型客户端脚本。

## 10. 可演进路线

```text
MVP
  → PostgreSQL full-text search
  → manual moderation
  → simple ranking

Growth
  → project screenshots automation
  → weekly digest
  → collections
  → advanced ranking

Scale
  → search engine
  → CDN image processing
  → queue-based link checker
  → creator analytics
```

