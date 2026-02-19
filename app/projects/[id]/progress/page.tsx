import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { ProjectProgressForm } from "@/components/project-progress-form";

interface ProgressPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProgressPage({ params }: ProgressPageProps) {
  const { id } = await params;
  
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="课题进展" subtitle="提交阶段性进展报告" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <ProjectProgressForm projectId={id} />
        </main>
      </div>
    </div>
  );
}
