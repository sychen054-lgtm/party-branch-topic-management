import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { notices as mockNotices } from "@/lib/mock-data";

export async function GET() {
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json(mockNotices);
  }

  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const notices = (data || []).map((row: Record<string, unknown>) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    batchName: row.batch_name ?? "",
    publisherId: row.publisher_id ?? "",
    publisherName: row.publisher_name ?? "",
    publishTime: row.publish_time ?? row.created_at,
    deadline: row.deadline ?? "",
    attachments: row.attachments ?? [],
    isTop: row.is_top ?? false,
    readCount: row.read_count ?? 0,
    totalCount: row.total_count ?? 0,
    type: row.type,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));

  return NextResponse.json(notices);
}
