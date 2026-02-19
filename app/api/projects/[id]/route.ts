import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { projects as mockProjects } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;

  if (!supabase) {
    const project = mockProjects.find((p) => p.id === id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      ...project,
      progressReports: project.progressReports || [],
    });
  }

  const { data: row, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  // Also fetch progress reports for this project
  const { data: reports } = await supabase
    .from("progress_reports")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  const project = {
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
    progressReports: (reports || []).map((r: Record<string, unknown>) => ({
      id: r.id,
      projectId: r.project_id,
      title: r.title,
      reportDate: r.report_date,
      submittedAt: r.submitted_at,
      content: r.content,
      achievements: r.achievements,
      issues: r.issues,
      nextPlan: r.next_plan,
      attachments: r.attachments || [],
      status: r.status,
      createdAt: r.created_at,
    })),
  };

  return NextResponse.json(project);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "请配置 Supabase 以使用课题修改功能" },
      { status: 503 }
    );
  }
  const { id } = await params;
  const body = await request.json();

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (body.title !== undefined) updateData.title = body.title;
  if (body.summary !== undefined) updateData.description = body.summary;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.batchId !== undefined) updateData.batch_id = body.batchId;
  if (body.batchName !== undefined) updateData.batch_name = body.batchName;
  if (body.category !== undefined) updateData.category = body.category;
  if (body.organizationId !== undefined) updateData.organization_id = body.organizationId;
  if (body.organizationName !== undefined) updateData.organization_name = body.organizationName;
  if (body.orgLevel !== undefined) updateData.org_level = body.orgLevel;
  if (body.leader !== undefined) updateData.leader = body.leader;
  if (body.members !== undefined) updateData.members = body.members;
  if (body.phone !== undefined) updateData.phone = body.phone;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.progress !== undefined) updateData.progress = body.progress;
  if (body.conclusionReport !== undefined) updateData.conclusion_report = body.conclusionReport;
  if (body.citySelection !== undefined) updateData.city_selection = body.citySelection;
  if (body.provinceSelection !== undefined) updateData.province_selection = body.provinceSelection;
  if (body.recommendedAt !== undefined) updateData.recommended_at = body.recommendedAt;

  const { data, error } = await supabase
    .from("projects")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "请配置 Supabase 以使用课题删除功能" },
      { status: 503 }
    );
  }
  const { id } = await params;

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
