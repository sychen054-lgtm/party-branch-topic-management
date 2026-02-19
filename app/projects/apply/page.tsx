import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { ProjectApplyForm } from "@/components/project-apply-form";

export default function ProjectApplyPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="课题申报" subtitle="填写课题申报信息" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <ProjectApplyForm />
        </main>
      </div>
    </div>
  );
}
