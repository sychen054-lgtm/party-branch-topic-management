"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { useProjects } from "@/lib/hooks/use-data";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  Eye,
} from "lucide-react";
import Link from "next/link";

export function MyProjectList() {
  const { data: projects = [] } = useProjects();
  const myProjects = projects;

  const stats = {
    total: myProjects.length,
    inProgress: myProjects.filter((p: { status: string }) => p.status === "in_progress").length,
    pending: myProjects.filter((p: { status: string }) =>
      ["pending_county", "pending_city", "pending_province"].includes(p.status)
    ).length,
    rejected: myProjects.filter((p: { status: string }) =>
      ["county_rejected", "city_rejected", "province_rejected"].includes(p.status)
    ).length,
  };
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">课题总数</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.inProgress}
              </p>
              <p className="text-sm text-muted-foreground">进行中</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-amber-100 p-3">
              <CheckCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.pending}
              </p>
              <p className="text-sm text-muted-foreground">待审核</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-red-100 p-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.rejected}
              </p>
              <p className="text-sm text-muted-foreground">待修改</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Button asChild className="gap-2">
          <Link href="/projects/apply">
            <Plus className="h-4 w-4" />
            申报新课题
          </Link>
        </Button>
      </div>

      {/* Project Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">我的课题列表</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">序号</TableHead>
                <TableHead className="w-[280px]">课题名称</TableHead>
                <TableHead>类别</TableHead>
                <TableHead>批次</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myProjects.map((project, index) => {
                const needsAction =
                  project.status === "draft" ||
                  project.status === "county_rejected" ||
                  project.status === "city_rejected" ||
                  project.status === "province_rejected";

                return (
                  <TableRow key={project.id}>
                    <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium line-clamp-1">
                          {project.title}
                        </span>
                        {needsAction && (
                          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            需处理
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                        {project.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {project.batchName}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={project.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(project.updatedAt).toLocaleDateString("zh-CN")}
                    </TableCell>
                    <TableCell className="text-right">
                      {needsAction ? (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="gap-1 bg-transparent"
                        >
                          <Link href={`/projects/${project.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            编辑
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" asChild className="gap-1">
                          <Link href={`/projects/${project.id}`}>
                            <Eye className="h-4 w-4" />
                            查看
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {myProjects.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    暂无课题，点击上方按钮申报新课题
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
