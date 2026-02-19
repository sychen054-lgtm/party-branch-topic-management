import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { SelectionManagement } from "@/components/selection-management";

export default function SelectionPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="评选管理" subtitle="优秀课题评选与推荐" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <SelectionManagement />
        </main>
      </div>
    </div>
  );
}
