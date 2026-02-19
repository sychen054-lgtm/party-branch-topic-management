-- 在 Supabase Dashboard → SQL Editor 中执行（若表或列不存在时使用）
-- 为 organizations / notices / projects 补充 mock 数据所需的列

-- organizations 表（若已存在则只加缺失列）
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS parent_id text,
  ADD COLUMN IF NOT EXISTS code text,
  ADD COLUMN IF NOT EXISTS level text;

-- notices 表
ALTER TABLE notices
  ADD COLUMN IF NOT EXISTS batch_name text,
  ADD COLUMN IF NOT EXISTS publisher_id text,
  ADD COLUMN IF NOT EXISTS publisher_name text,
  ADD COLUMN IF NOT EXISTS publish_time timestamptz,
  ADD COLUMN IF NOT EXISTS deadline timestamptz,
  ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS is_top boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS read_count int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_count int DEFAULT 0;

-- projects 表
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS batch_id text,
  ADD COLUMN IF NOT EXISTS batch_name text,
  ADD COLUMN IF NOT EXISTS org_level text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS city_selection jsonb,
  ADD COLUMN IF NOT EXISTS province_selection jsonb,
  ADD COLUMN IF NOT EXISTS conclusion_report jsonb,
  ADD COLUMN IF NOT EXISTS recommended_at timestamptz;

-- 若表不存在则需先建表，可参考 Supabase 表编辑器中的结构创建
