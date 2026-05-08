# 数据库表设计

## 1. ER 图

```text
users
├─ projects
│  ├─ project_tags ─ tags
│  ├─ project_tech_stacks ─ tech_stacks
│  ├─ comments
│  ├─ votes
│  ├─ bookmarks
│  └─ reports
├─ comments
├─ votes
├─ bookmarks
└─ reports

categories
└─ projects

moderation_actions
└─ users/admins
```

## 2. users

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| username | text | 唯一用户名 |
| display_name | text | 展示名 |
| avatar_url | text | 头像 |
| bio | text | 个人简介 |
| role | enum | user/admin/moderator |
| created_at | timestamptz | 创建时间 |
| updated_at | timestamptz | 更新时间 |

## 3. projects

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| author_id | uuid | 作者 |
| category_id | uuid | 分类 |
| slug | text | 唯一路由 |
| title | text | 标题 |
| summary | text | 一句话简介 |
| description | text | 详细介绍 |
| purpose | text | 创作目的 |
| how_to_use | text | 使用方式 |
| build_notes | text | 构建说明 |
| project_url | text | 项目链接 |
| source_url | text | 源码链接 |
| cover_image_url | text | 封面图 |
| status | enum | draft/pending/approved/rejected/archived |
| difficulty | enum | beginner/intermediate/advanced |
| is_open_source | boolean | 是否开源 |
| is_featured | boolean | 是否精选 |
| view_count | integer | 浏览量 |
| external_click_count | integer | 外链点击 |
| like_count | integer | 点赞数 |
| bookmark_count | integer | 收藏数 |
| comment_count | integer | 评论数 |
| hot_score | numeric | 热度分 |
| submitted_at | timestamptz | 提交时间 |
| approved_at | timestamptz | 审核通过时间 |
| created_at | timestamptz | 创建时间 |
| updated_at | timestamptz | 更新时间 |

## 4. categories

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| slug | text | 唯一路由 |
| name | text | 分类名称 |
| description | text | 分类说明 |
| sort_order | integer | 排序 |
| created_at | timestamptz | 创建时间 |

## 5. tags

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| slug | text | 唯一路由 |
| name | text | 标签名称 |
| created_at | timestamptz | 创建时间 |

## 6. project_tags

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| project_id | uuid | 项目 |
| tag_id | uuid | 标签 |

## 7. tech_stacks

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| slug | text | 唯一路由 |
| name | text | 技术名 |
| created_at | timestamptz | 创建时间 |

## 8. project_tech_stacks

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| project_id | uuid | 项目 |
| tech_stack_id | uuid | 技术栈 |

## 9. comments

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| project_id | uuid | 项目 |
| author_id | uuid | 作者 |
| parent_id | uuid | 父评论，可为空 |
| body | text | 评论内容 |
| status | enum | visible/hidden/deleted |
| created_at | timestamptz | 创建时间 |
| updated_at | timestamptz | 更新时间 |

## 10. votes

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| user_id | uuid | 用户 |
| project_id | uuid | 项目 |
| value | integer | 1 或 -1，MVP 只用 1 |
| created_at | timestamptz | 创建时间 |

约束：`user_id + project_id` 唯一。

## 11. bookmarks

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| user_id | uuid | 用户 |
| project_id | uuid | 项目 |
| created_at | timestamptz | 创建时间 |

约束：`user_id + project_id` 唯一。

## 12. reports

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| reporter_id | uuid | 举报人 |
| target_type | enum | project/comment/user |
| target_id | uuid | 被举报对象 |
| reason | enum | spam/abuse/copyright/nsfw/malware/other |
| detail | text | 说明 |
| status | enum | open/reviewing/resolved/dismissed |
| created_at | timestamptz | 创建时间 |
| resolved_at | timestamptz | 处理时间 |

## 13. moderation_actions

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| actor_id | uuid | 管理员 |
| target_type | text | 操作对象类型 |
| target_id | uuid | 操作对象 |
| action | text | 操作 |
| note | text | 备注 |
| created_at | timestamptz | 创建时间 |

## 14. 关键索引

```sql
create index projects_status_hot_score_idx on projects (status, hot_score desc);
create index projects_category_status_idx on projects (category_id, status);
create index projects_created_at_idx on projects (created_at desc);
create index comments_project_created_at_idx on comments (project_id, created_at desc);
create unique index votes_user_project_idx on votes (user_id, project_id);
create unique index bookmarks_user_project_idx on bookmarks (user_id, project_id);
```

## 15. 搜索设计

MVP 使用 PostgreSQL 全文搜索：

```sql
to_tsvector('simple', title || ' ' || summary || ' ' || description)
```

后续如果搜索量和相关性要求更高，再迁移到 Meilisearch 或 Algolia。

