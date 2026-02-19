"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { useProjects } from "@/lib/hooks/use-data";
import {
  Plus,
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Paperclip,
} from "lucide-react";
import Link from "next/link";

export function ProgressManagement() {
  const { data: projects = [] } = useProjects();
  const inProgressProjects = projects.filter((p: { status: string }) => p.status === "in_progress");
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const totalReports = inProgressProjects.reduce(
    (acc, p) => acc + p.progressReports.length,
    0
  );
  const projectsWithReports = inProgressProjects.filter(
    (p) => p.progressReports.length > 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {inProgressProjects.length}
              </p>
              <p className="text-sm text-muted-foreground">进行中课题</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalReports}</p>
              <p className="text-sm text-muted-foreground">进展报告数</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-emerald-100 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {projectsWithReports}
              </p>
              <p className="text-sm text-muted-foreground">已提交报告</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-amber-100 p-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {inProgressProjects.length - projectsWithReports}
              </p>
              <p className="text-sm text-muted-foreground">待提交报告</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              提交进展报告
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>提交阶段性进展报告</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>选择课题</Label>
                <Select
                  value={selectedProjectId}
                  onValueChange={setSelectedProjectId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="请选择要提交进展的课题" />
                  </SelectTrigger>
                  <SelectContent>
                    {inProgressProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">阶段</Label>
                <Select>
                  <SelectTrigger id="stage">
                    <SelectValue placeholder="选择阶段" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">第一阶段</SelectItem>
                    <SelectItem value="2">第二阶段</SelectItem>
                    <SelectItem value="3">第三阶段</SelectItem>
                    <SelectItem value="4">第四阶段</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="progress-title">报告标题</Label>
                <Input id="progress-title" placeholder="如：第一阶段进展报告" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="progress-content">进展内容</Label>
                <Textarea
                  id="progress-content"
                  placeholder="详细描述本阶段的工作进展..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements">阶段成果</Label>
                <Textarea
                  id="achievements"
                  placeholder="描述本阶段取得的主要成果..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issues">存在问题</Label>
                <Textarea
                  id="issues"
                  placeholder="描述遇到的问题和困难..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="next-plan">下阶段计划</Label>
                <Textarea
                  id="next-plan"
                  placeholder="描述下一阶段的工作计划..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>附件材料</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Paperclip className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    点击或拖拽文件上传
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsSubmitOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsSubmitOpen(false)}>提交报告</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Project Progress List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">课题进展概览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inProgressProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg border border-border p-4"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground truncate">
                        {project.title}
                      </h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {project.organizationName} · {project.leader}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/projects/${project.id}`}>
                      查看详情
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>

                {/* Progress Timeline */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    进展报告 ({project.progressReports.length})
                  </div>

                  {project.progressReports.length > 0 ? (
                    <div className="space-y-2 pl-4 border-l-2 border-border">
                      {project.progressReports.map((report) => (
                        <div
                          key={report.id}
                          className="relative pl-4 py-2 rounded-r-lg hover:bg-muted/50"
                        >
                          <div className="absolute -left-1.5 top-3 w-3 h-3 rounded-full bg-primary" />
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-foreground">
                              {report.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(report.submittedAt).toLocaleDateString(
                                "zh-CN"
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {report.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground pl-6">
                      暂无进展报告
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
