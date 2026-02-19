import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { projects as mockProjects } from "@/lib/mock-data";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  if (!supabase) {
    let list = [...mockProjects];
    if (status === "concluded") list = list.filter((p) => p.status === "concluded");
    else if (status === "active") list = list.filter((p) => p.status !== "concluded");
    else if (status) list = list.filter((p) => p.status === status);
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(list);
  }

  let query = supabase.from("projects").select("*").order("created_at", { ascending: false });

  if (status) {
    if (status === "concluded") {
      query = query.eq("status", "concluded");
    } else if (status === "active") {
      query = query.neq("status", "concluded");
    } else {
      query = query.eq("status", status);
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const projects = (data || []).map((row: Record<string, unknown>) => ({
    id: row.id,
    title: row.title,
    summary: row.summary ?? row.description ?? "",
    batchId: row.batch_id,
    batchName: row.batch_name,
    category: row.category,
    organizationId: row.organization_id,
    organizationName: row.organization_name,
    orgLevel: row.org_level,
    leader: row.leader,
    members: row.members || [],
    phone: row.phone ?? "",
    status: row.status,
    progress: row.progress,
    conclusionReport: row.conclusion_report,
    citySelection: row.city_selection,
    provinceSelection: row.province_selection,
    recommendedAt: row.recommended_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "请配置 Supabase（.env.local 中 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY）以使用课题创建功能" },
      { status: 503 }
    );
  }
  const body = await request.json();

  const { data, error } = await supabase.from("projects").insert({
    id: body.id || `proj-${Date.now()}`,
    title: body.title,
    description: body.summary ?? body.description ?? "",
    category: body.category,
    organization_id: body.organizationId,
    organization_name: body.organizationName,
    leader: body.leader,
    members: body.members || [],
    status: body.status || "draft",
    progress: body.progress || 0,
  }).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
