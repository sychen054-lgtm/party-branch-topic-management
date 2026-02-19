"use client";

import { useParams } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { BranchElectionDetail } from "@/components/branch-election-detail";

export default function BranchElectionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="流程详情" subtitle="支部换届进度跟踪" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <BranchElectionDetail electionId={id} />
        </main>
      </div>
    </div>
  );
}
