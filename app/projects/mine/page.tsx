import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { MyProjectList } from "@/components/my-project-list";

export default function MyProjectsPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="我的课题" subtitle="查看和管理我申报的课题" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <MyProjectList />
        </main>
      </div>
    </div>
  );
}
