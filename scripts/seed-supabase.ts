/**
 * 将 lib/mock-data 中的数据写入 Supabase。
 * 使用前请先在 Supabase SQL Editor 中执行 scripts/clear-supabase.sql 清空旧数据。
 *
 * 运行：pnpm run seed:supabase
 * 依赖：.env.local 中配置 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { organizations, notices, projects } from "../lib/mock-data";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.error("请配置 .env.local：NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  /** 组织架构 */
  const orgRows = organizations.map((o) => ({
    id: o.id,
    name: o.name,
    level: o.level,
    parent_id: o.parentId,
    code: o.code,
  }));
  const { error: eOrg } = await supabase.from("organizations").insert(orgRows);
  if (eOrg) {
    console.error("organizations 写入失败:", eOrg.message);
    process.exit(1);
  }
  console.log("organizations:", orgRows.length, "条");

  /** 通知公告 */
  const noticeRows = notices.map((n) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    batch_name: n.batchName,
    publisher_id: n.publisherId,
    publisher_name: n.publisherName,
    publish_time: n.publishTime,
    deadline: n.deadline,
    attachments: n.attachments ?? [],
    is_top: n.isTop ?? false,
    read_count: n.readCount ?? 0,
    total_count: n.totalCount ?? 0,
    created_at: n.publishTime,
  }));
  const { error: eNotice } = await supabase.from("notices").insert(noticeRows);
  if (eNotice) {
    console.error("notices 写入失败:", eNotice.message);
    process.exit(1);
  }
  console.log("notices:", noticeRows.length, "条");

  /** 课题 */
  const projectRows = projects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.summary,
    batch_id: p.batchId,
    batch_name: p.batchName,
    category: p.category,
    organization_id: p.organizationId,
    organization_name: p.organizationName,
    org_level: p.orgLevel,
    leader: p.leader,
    members: p.members ?? [],
    phone: p.phone ?? "",
    status: p.status,
    progress: 0,
    city_selection: p.citySelection ?? null,
    province_selection: p.provinceSelection ?? null,
    recommended_at: p.recommendedAt ?? null,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  }));
  const { error: eProj } = await supabase.from("projects").insert(projectRows);
  if (eProj) {
    console.error("projects 写入失败:", eProj.message);
    process.exit(1);
  }
  console.log("projects:", projectRows.length, "条");

  console.log("Supabase 种子数据写入完成。");
}

main();
