"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import { useProjects } from "@/lib/hooks/use-data";
import {
  FileText,
  Clock,
  CheckCircle,
  Send,
  Paperclip,
  Building2,
  Users,
  Eye,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export function ConclusionManagement() {
  const { data: projects = [] } = useProjects();
  const readyForConclusion = projects.filter(
    (p: { status: string }) => p.status === "in_progress" || p.status === "pending_conclusion"
  );
  const concludedProjects = projects.filter((p: { status: string }) => p.status === "concluded");
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-amber-100 p-3">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {readyForConclusion.length}
              </p>
              <p className="text-sm text-muted-foreground">可结题课题</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {
                  projects.filter((p: { status: string }) => p.status === "pending_conclusion")
                    .length
                }
              </p>
              <p className="text-sm text-muted-foreground">待审核</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-emerald-100 p-3">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {concludedProjects.length}
              </p>
              <p className="text-sm text-muted-foreground">已结题</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              申请结题
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>提交结题申请</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>选择课题</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择要结题的课题" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects
                      .filter((p) => p.status === "in_progress")
                      .map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">研究总结</Label>
                <Textarea
                  id="summary"
                  placeholder="总结课题研究过程和主要工作..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements">主要成果</Label>
                <Textarea
                  id="achievements"
                  placeholder="详细描述课题取得的主要成果..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="innovations">创新点</Label>
                <Textarea
                  id="innovations"
                  placeholder="描述课题的创新之处..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applications">应用推广情况</Label>
                <Textarea
                  id="applications"
                  placeholder="描述成果的应用和推广情况..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>结题材料</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Paperclip className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    上传结题报告、成果材料等
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    支持 Word、PDF、图片等格式
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsSubmitOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsSubmitOpen(false)}>提交申请</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ready" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ready">
            可结题 ({readyForConclusion.length})
          </TabsTrigger>
          <TabsTrigger value="concluded">
            已结题 ({concludedProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ready">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {readyForConclusion.map((project) => (
                  <div key={project.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-foreground truncate">
                            {project.title}
                          </h3>
                          <StatusBadge status={project.status} />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {project.summary}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {project.organizationName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {project.leader}
                          </span>
                          <span>
                            进展报告：{project.progressReports.length} 份
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/projects/${project.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          查看
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="concluded">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {concludedProjects.length > 0 ? (
                  concludedProjects.map((project) => (
                    <div key={project.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-foreground truncate">
                              {project.title}
                            </h3>
                            <StatusBadge status={project.status} />
                            {project.conclusionReport?.status === "approved" && (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                审核通过
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                            {project.conclusionReport?.summary ||
                              project.summary}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" />
                              {project.organizationName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {project.leader}
                            </span>
                            {project.conclusionReport && (
                              <span>
                                结题时间：
                                {new Date(
                                  project.conclusionReport.submittedAt
                                ).toLocaleDateString("zh-CN")}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/projects/${project.id}`}>
                            查看详情
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">暂无已结题课题</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
