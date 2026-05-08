# 页面结构图与信息架构

## 1. 站点地图

```text
/
├─ /discover
│  ├─ ?category=
│  ├─ ?tag=
│  ├─ ?tech=
│  └─ ?sort=
├─ /projects/[slug]
├─ /submit
├─ /collections
│  ├─ /collections/featured
│  ├─ /collections/trending
│  └─ /collections/new
├─ /users/[username]
├─ /bookmarks
├─ /auth/sign-in
├─ /auth/sign-up
├─ /rules
└─ /admin
   ├─ /admin/projects
   ├─ /admin/reports
   ├─ /admin/comments
   ├─ /admin/categories
   └─ /admin/tags
```

## 2. 首页信息架构

```text
Header
├─ Logo
├─ Discover
├─ Collections
├─ Submit
└─ User menu

Hero/Search band
├─ 搜索框
├─ 分类快捷入口
└─ 投稿按钮

Main content
├─ 编辑精选
├─ 本周热门
├─ 最新提交
└─ 分类导航

Footer
├─ 投稿规则
├─ 社区规范
└─ 联系方式
```

## 3. 发现页结构

```text
Discover Page
├─ Search and sort bar
├─ Filter panel
│  ├─ Category
│  ├─ Purpose
│  ├─ Tech stack
│  ├─ Open source
│  └─ Difficulty
└─ Project grid
   └─ Project card
      ├─ Preview image
      ├─ Title
      ├─ Short description
      ├─ Tags
      ├─ Author
      └─ Stats
```

## 4. 项目详情页结构

```text
Project Detail
├─ Project header
│  ├─ Title
│  ├─ One-line summary
│  ├─ Tags
│  └─ Actions
├─ Preview area
├─ Content
│  ├─ Purpose
│  ├─ How to use
│  ├─ Build notes
│  └─ Tech stack
├─ Sidebar
│  ├─ Visit project
│  ├─ Author card
│  ├─ Metadata
│  └─ Report action
├─ Comments
└─ Related projects
```

## 5. 投稿页结构

```text
Submit Project
├─ Basic information
│  ├─ Project URL
│  ├─ Title
│  └─ Short description
├─ Details
│  ├─ Purpose
│  ├─ How to use
│  └─ Build notes
├─ Classification
│  ├─ Category
│  ├─ Tags
│  ├─ Tech stack
│  └─ Difficulty
├─ Media
│  ├─ Cover image
│  └─ Screenshots
└─ Submit for review
```

## 6. 核心导航原则

- 浏览路径优先：用户一进来就应该能找项目。
- 投稿入口明确：创作者不需要猜在哪里提交。
- 分类可扫读：分类应该是内容发现工具，不是装饰。
- 详情页要完整：用户应该能在详情页判断项目是否值得打开。
- 后台和前台分离：管理员操作不污染普通用户体验。

