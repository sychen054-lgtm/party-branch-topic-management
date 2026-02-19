import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { organizations as mockOrgs } from "@/lib/mock-data";

export async function GET() {
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json(mockOrgs);
  }

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .order("id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const organizations = (data || []).map((row: Record<string, unknown>) => ({
    id: row.id,
    name: row.name,
    level: row.level,
    parentId: row.parent_id,
    code: row.code,
  }));

  return NextResponse.json(organizations);
}
