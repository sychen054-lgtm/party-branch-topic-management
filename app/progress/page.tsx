import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { ProgressManagement } from "@/components/progress-management";

export default function ProgressPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="进展管理" subtitle="课题阶段性进展报告" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <ProgressManagement />
        </main>
      </div>
    </div>
  );
}
