"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projectCategories } from "@/lib/mock-data";
import { useStatistics } from "@/lib/hooks/use-data";
import { statusConfig } from "@/lib/types";
import {
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Building2,
  CalendarDays,
} from "lucide-react";

export function StatisticsView() {
  const { data: statistics } = useStatistics();

  const stats = statistics || {
    totalProjects: 0,
    inProgress: 0,
    concluded: 0,
    pendingReview: 0,
    approved: 0,
    draft: 0,
  };

  const statusDistribution = [
    { status: "in_progress", label: "进行中", count: stats.inProgress, percentage: stats.totalProjects ? ((stats.inProgress / stats.totalProjects) * 100).toFixed(1) : "0" },
    { status: "concluded", label: "已结题", count: stats.concluded, percentage: stats.totalProjects ? ((stats.concluded / stats.totalProjects) * 100).toFixed(1) : "0" },
    { status: "pending_city", label: "待审核", count: stats.pendingReview, percentage: stats.totalProjects ? ((stats.pendingReview / stats.totalProjects) * 100).toFixed(1) : "0" },
    { status: "approved", label: "已立项", count: stats.approved, percentage: stats.totalProjects ? ((stats.approved / stats.totalProjects) * 100).toFixed(1) : "0" },
    { status: "draft", label: "草稿", count: stats.draft, percentage: stats.totalProjects ? ((stats.draft / stats.totalProjects) * 100).toFixed(1) : "0" },
  ].filter(item => item.count > 0).sort((a, b) => b.count - a.count);

  const categoryDistribution = projectCategories.map((cat) => ({
    category: cat.name,
    categoryId: cat.id,
    count: 0,
    percentage: "0",
  }));

  const orgDistribution: { org: string; count: number; percentage: string }[] = [];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">
{stats.totalProjects}
              </p>
              <p className="text-sm text-muted-foreground">课题总数</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-emerald-100 p-3">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {stats.totalProjects ? ((stats.concluded / stats.totalProjects) * 100).toFixed(0) : 0}%
              </p>
              <p className="text-sm text-muted-foreground">审核通过率</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-blue-100 p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {stats.inProgress}
              </p>
              <p className="text-sm text-muted-foreground">进行中</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-amber-100 p-3">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">
                {stats.concluded}
              </p>
              <p className="text-sm text-muted-foreground">已结题</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              状态分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusDistribution.slice(0, 8).map((item) => (
                <div key={item.status} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.label}</span>
                    <span className="text-muted-foreground">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              类别分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryDistribution.map((item) => (
                <div key={item.categoryId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.category}</span>
                    <span className="text-muted-foreground">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-chart-2 transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Organization Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              地区分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orgDistribution.map((item, index) => (
                <div key={item.org} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.org}</span>
                    <span className="text-muted-foreground">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: `var(--chart-${(index % 5) + 1})`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submission Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              申报趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground text-sm">
                暂无趋势数据
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">汇总统计表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    指标
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    数值
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    占比
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">课题总数</td>
                  <td className="text-right py-3 px-4 font-medium">{stats.totalProjects}</td>
                  <td className="text-right py-3 px-4">100%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">待审核</td>
                  <td className="text-right py-3 px-4 font-medium">{stats.pendingReview}</td>
                  <td className="text-right py-3 px-4">{stats.totalProjects ? ((stats.pendingReview / stats.totalProjects) * 100).toFixed(1) : 0}%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">已立项</td>
                  <td className="text-right py-3 px-4 font-medium">{stats.approved}</td>
                  <td className="text-right py-3 px-4">{stats.totalProjects ? ((stats.approved / stats.totalProjects) * 100).toFixed(1) : 0}%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">进行中</td>
                  <td className="text-right py-3 px-4 font-medium">{stats.inProgress}</td>
                  <td className="text-right py-3 px-4">{stats.totalProjects ? ((stats.inProgress / stats.totalProjects) * 100).toFixed(1) : 0}%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4">已结题</td>
                  <td className="text-right py-3 px-4 font-medium">{stats.concluded}</td>
                  <td className="text-right py-3 px-4">{stats.totalProjects ? ((stats.concluded / stats.totalProjects) * 100).toFixed(1) : 0}%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">草稿</td>
                  <td className="text-right py-3 px-4 font-medium">{stats.draft}</td>
                  <td className="text-right py-3 px-4">{stats.totalProjects ? ((stats.draft / stats.totalProjects) * 100).toFixed(1) : 0}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
