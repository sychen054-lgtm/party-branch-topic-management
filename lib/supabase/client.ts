import { createBrowserClient } from '@supabase/ssr'

/**
 * 创建浏览器端 Supabase 客户端。未配置 URL/Key 时返回 null（仅做展示时可无需配置）。
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createBrowserClient(url, key)
}
