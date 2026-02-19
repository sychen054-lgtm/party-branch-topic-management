import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("member_developments")
    .select("*")
    .order("last_update_date", { ascending: false, nullsFirst: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const members = (data || []).map((row: Record<string, unknown>) => ({
    id: row.id,
    name: row.name,
    department: row.department,
    currentStage: row.current_stage,
    currentStageIndex: row.current_stage_index,
    currentNode: row.current_node,
    progress: row.progress,
    startDate: row.start_date,
    lastUpdateDate: row.last_update_date,
    status: row.status,
  }));

  return NextResponse.json(members);
}
