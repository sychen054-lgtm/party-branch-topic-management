import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { ConclusionManagement } from "@/components/conclusion-management";

export default function ConclusionPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="结题管理" subtitle="课题结题申请与审核" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <ConclusionManagement />
        </main>
      </div>
    </div>
  );
}
