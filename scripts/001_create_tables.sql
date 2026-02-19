-- 组织机构表
CREATE TABLE IF NOT EXISTS organizations (
  id text PRIMARY KEY,
  name text NOT NULL,
  level text NOT NULL,
  parent_id text
);

-- 通知公告表
CREATE TABLE IF NOT EXISTS notices (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  content text NOT NULL,
  batch_name text,
  publisher_id text,
  publisher_name text,
  publish_time timestamptz DEFAULT now(),
  deadline timestamptz,
  is_top boolean DEFAULT false,
  read_count int DEFAULT 0,
  total_count int DEFAULT 0,
  attachments jsonb DEFAULT '[]'
);

-- 课题表
CREATE TABLE IF NOT EXISTS projects (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title text NOT NULL,
  description text,
  category text,
  organization_id text,
  organization_name text,
  leader text,
  members jsonb DEFAULT '[]',
  objectives text,
  plan text,
  expected_outcomes text,
  status text DEFAULT 'draft',
  progress int DEFAULT 0,
  conclusion_report text,
  city_selection jsonb,
  province_selection jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 进展报告表
CREATE TABLE IF NOT EXISTS progress_reports (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  project_id text NOT NULL,
  title text,
  content text,
  achievements text,
  issues text,
  next_plan text,
  attachments jsonb DEFAULT '[]',
  status text DEFAULT 'draft',
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 党员发展流程表
CREATE TABLE IF NOT EXISTS member_developments (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name text NOT NULL,
  department text,
  current_stage text,
  current_stage_index int DEFAULT 0,
  current_node text,
  progress int DEFAULT 0,
  start_date text,
  last_update_date text,
  status text DEFAULT '进行中'
);

-- 支部换届表
CREATE TABLE IF NOT EXISTS branch_elections (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  branch_name text NOT NULL,
  term_start text,
  term_end text,
  current_stage text,
  current_stage_index int DEFAULT 0,
  current_node text,
  progress int DEFAULT 0,
  start_date text,
  last_update_date text,
  status text DEFAULT '进行中'
);
