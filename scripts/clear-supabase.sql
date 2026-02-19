-- ============================================================
-- 在 Supabase 里清空旧数据（详细步骤见 scripts/README-seed.md）
-- ============================================================
--
-- 操作步骤简要：
-- 1. 打开 https://app.supabase.com 并登录
-- 2. 左侧选择你的项目，进入项目控制台
-- 3. 左侧点击「SQL Editor」（SQL 编辑器）
-- 4. 在编辑器中粘贴本文件从下方 DELETE 开始到结尾的全部内容
-- 5. 点击「Run」/「运行」执行
-- 6. 看到 Success 即表示清空完成（若某表不存在会报错，可删掉该行或忽略）
--
-- 执行顺序：先删关联表，再删主表
-- ============================================================

DELETE FROM progress_reports;
DELETE FROM projects;
DELETE FROM notices;
DELETE FROM organizations;
DELETE FROM branch_elections;
DELETE FROM member_developments;
