"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { MemberDevelopmentList } from "@/components/member-development-list";

export default function MemberDevelopmentListPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="流程详情" subtitle="党员发展人员管理" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <MemberDevelopmentList />
        </main>
      </div>
    </div>
  );
}
