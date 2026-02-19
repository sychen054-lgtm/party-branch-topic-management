import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { ProjectList } from "@/components/project-list";

export default function ProjectsPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="课题管理" subtitle="查看课题进展、提交阶段性报告" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <ProjectList />
        </main>
      </div>
    </div>
  );
}
