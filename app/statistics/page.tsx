import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { StatisticsView } from "@/components/statistics-view";

export default function StatisticsPage() {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title="统计分析" subtitle="课题数据统计与分析" />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6">
          <StatisticsView />
        </main>
      </div>
    </div>
  );
}
