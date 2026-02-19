"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { BranchElectionList } from "@/components/branch-election-list";

export default function BranchElectionListPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="流程详情" subtitle="支部换届任务管理" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <BranchElectionList />
        </main>
      </div>
    </div>
  );
}
