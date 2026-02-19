import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { CaseLibrary } from "@/components/case-library";

export default function CasesPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="案例集" subtitle="优秀党建课题案例库" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <CaseLibrary />
        </main>
      </div>
    </div>
  );
}
