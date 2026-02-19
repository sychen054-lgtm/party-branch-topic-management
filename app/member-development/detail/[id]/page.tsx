"use client";

import { useParams } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { MemberDevelopmentDetail } from "@/components/member-development-detail";

export default function MemberDevelopmentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="流程详情" subtitle="党员发展进度跟踪" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <MemberDevelopmentDetail memberId={id} />
        </main>
      </div>
    </div>
  );
}
