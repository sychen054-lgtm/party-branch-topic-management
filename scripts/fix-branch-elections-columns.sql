-- 为 branch_elections 表补全列（若表是早期创建或列名不同，在 Supabase SQL Editor 中先执行本脚本，再执行 seed-member-and-branch.sql）
-- 若某列已存在会报错，可跳过该行或注释掉

ALTER TABLE branch_elections ADD COLUMN IF NOT EXISTS term_start text;
ALTER TABLE branch_elections ADD COLUMN IF NOT EXISTS term_end text;
ALTER TABLE branch_elections ADD COLUMN IF NOT EXISTS current_stage text;
ALTER TABLE branch_elections ADD COLUMN IF NOT EXISTS current_stage_index int DEFAULT 0;
ALTER TABLE branch_elections ADD COLUMN IF NOT EXISTS current_node text;
ALTER TABLE branch_elections ADD COLUMN IF NOT EXISTS progress int DEFAULT 0;
ALTER TABLE branch_elections ADD COLUMN IF NOT EXISTS start_date text;
ALTER TABLE branch_elections ADD COLUMN IF NOT EXISTS last_update_date text;
ALTER TABLE branch_elections ADD COLUMN IF NOT EXISTS status text DEFAULT '进行中';
