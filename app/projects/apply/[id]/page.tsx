import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { ProjectEditForm } from "@/components/project-edit-form";

interface ProjectEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectEditPage({ params }: ProjectEditPageProps) {
  const { id } = await params;
  
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="编辑课题" subtitle="修改课题申报信息" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <ProjectEditForm projectId={id} />
        </main>
      </div>
    </div>
  );
}
