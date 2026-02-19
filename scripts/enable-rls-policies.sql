-- 在 Supabase SQL Editor 中执行此脚本
-- 让前端（anon 密钥）能读取党员发展、支部换届等表的数据
-- 若某表报错 "policy already exists"，说明已配置过，可跳过该条

-- 党员发展：允许匿名只读
CREATE POLICY "Allow anon read member_developments"
ON public.member_developments FOR SELECT
TO anon
USING (true);

-- 支部换届：允许匿名只读
CREATE POLICY "Allow anon read branch_elections"
ON public.branch_elections FOR SELECT
TO anon
USING (true);
