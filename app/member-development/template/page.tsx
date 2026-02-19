"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { MemberDevelopmentTemplate } from "@/components/member-development-template";

export default function MemberDevelopmentTemplatePage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="流程模板" subtitle="党员发展流程配置" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <MemberDevelopmentTemplate />
        </main>
      </div>
    </div>
  );
}
