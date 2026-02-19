import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("branch_elections")
    .select("*")
    .order("last_update_date", { ascending: false, nullsFirst: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const elections = (data || []).map((row: Record<string, unknown>) => ({
    id: row.id,
    branchName: row.branch_name,
    termStart: row.term_start,
    termEnd: row.term_end ?? row.term_end_date,
    currentStage: row.current_stage,
    currentStageIndex: row.current_stage_index,
    currentNode: row.current_node,
    progress: row.progress,
    status: row.status,
    startDate: row.start_date,
    lastUpdateDate: row.last_update_date,
  }));

  return NextResponse.json(elections);
}
