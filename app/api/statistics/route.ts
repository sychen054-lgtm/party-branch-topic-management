import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { statistics as mockStatistics } from "@/lib/mock-data";

export async function GET() {
  const supabase = await createClient();

  if (!supabase) {
    return NextResponse.json(mockStatistics);
  }

  const { data: projects, error } = await supabase.from("projects").select("status");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const list = projects || [];
  const statistics = {
    totalProjects: list.length,
    inProgress: list.filter((p: { status: string }) => p.status === "in_progress").length,
    concluded: list.filter((p: { status: string }) => p.status === "concluded").length,
    pendingReview: list.filter((p: { status: string }) => p.status === "pending_city").length,
    approved: list.filter((p: { status: string }) => p.status === "approved").length,
    draft: list.filter((p: { status: string }) => p.status === "draft").length,
  };

  return NextResponse.json(statistics);
}
