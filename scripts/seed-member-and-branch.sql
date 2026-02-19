-- 党员发展、支部换届测试数据（在 Supabase SQL Editor 中执行）
-- 执行前若表中有旧数据，可先执行 scripts/clear-member-and-branch.sql
-- 若报错 column "term_start" (或其它列) does not exist，请先执行 scripts/fix-branch-elections-columns.sql 补全列

-- 党员发展：董科研，海宁综合党支部，入党积极分子，培养教育考察
INSERT INTO member_developments (
  id, name, department, current_stage, current_stage_index, current_node,
  progress, start_date, last_update_date, status
) VALUES (
  'member-dong',
  '董科研',
  '海宁综合党支部',
  '入党积极分子',
  2,
  '培养教育考察',
  35,
  '2025-12-08',
  '2026-02-19',
  '进行中'
);

-- 支部换届：海宁专卖党支部，届期截止 2026.4.26，换届准备，制定换届工作方案
INSERT INTO branch_elections (
  id, branch_name, term_start, term_end, current_stage, current_stage_index, current_node,
  progress, start_date, last_update_date, status
) VALUES (
  'election-haining',
  '海宁专卖党支部',
  '2023-04-26',
  '2026-04-26',
  '换届准备',
  1,
  '制定换届工作方案',
  16,
  '2026-02-19',
  '2026-02-19',
  '进行中'
);
