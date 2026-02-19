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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status-badge";
import { LifecycleTracker } from "@/components/lifecycle-tracker";
import { useProject } from "@/lib/hooks/use-data";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  Clock,
  Download,
  FileText,
  Phone,
  RotateCcw,
  Users,
  X,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProjectDetailProps {
  projectId: string;
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const { data: project, isLoading } = useProject(projectId);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve");

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">课题不存在</p>
        <Button variant="link" asChild className="mt-2">
          <Link href="/projects">返回课题列表</Link>
        </Button>
      </div>
    );
  }

  const handleReview = (action: "approve" | "reject") => {
    setReviewAction(action);
    setIsReviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="gap-2 -ml-2">
        <Link href="/projects">
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{project.title}</h1>
            <StatusBadge status={project.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {project.organizationName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {project.batchName}
            </span>
            <span className="rounded-full bg-secondary px-2 py-0.5">
              {project.category}
            </span>
          </div>
        </div>

        {/* Review Actions */}
        {(project.status === "pending_county" ||
          project.status === "pending_city" ||
          project.status === "pending_province") && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
              onClick={() => handleReview("reject")}
            >
              <X className="h-4 w-4" />
              退回修改
            </Button>
            <Button className="gap-2" onClick={() => handleReview("approve")}>
              <Check className="h-4 w-4" />
              审核通过
            </Button>
          </div>
        )}
      </div>

      {/* Lifecycle Tracker */}
      <Card>
        <CardContent className="py-6">
          <div className="flex justify-center">
            <LifecycleTracker currentStatus={project.status} />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">基本信息</TabsTrigger>
          <TabsTrigger value="progress">
            进展报告 ({project.progressReports.length})
          </TabsTrigger>
          <TabsTrigger value="audit">审核记录 ({project.auditLogs.length})</TabsTrigger>
          {project.conclusionReport && (
            <TabsTrigger value="conclusion">结题报告</TabsTrigger>
          )}
          {project.scores && project.scores.length > 0 && (
            <TabsTrigger value="scores">评分结果</TabsTrigger>
          )}
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">项目简介</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {project.summary}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    团队信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">课题负责人</p>
                    <p className="font-medium text-foreground">{project.leader}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">联系电话</p>
                    <p className="font-medium text-foreground flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {project.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">课题成员</p>
                    <div className="flex flex-wrap gap-2">
                      {project.members.map((member, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    附件材料
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {project.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {project.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between rounded-lg border border-border p-3"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate">
                              {attachment.name}
                            </span>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">暂无附件</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    时间信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">创建时间</span>
                    <span className="text-sm font-medium">
                      {new Date(project.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">更新时间</span>
                    <span className="text-sm font-medium">
                      {new Date(project.updatedAt).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">阶段性进展报告</CardTitle>
              {project.status === "in_progress" && (
                <Button size="sm" asChild>
                  <Link href={`/progress/submit?projectId=${project.id}`}>
                    提交进展报告
                  </Link>
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {project.progressReports.length > 0 ? (
                <div className="space-y-4">
                  {project.progressReports.map((report, index) => (
                    <div
                      key={report.id}
                      className="rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-foreground">
                          {report.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(report.submittedAt).toLocaleDateString("zh-CN")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {report.content}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">阶段成果：</span>
                          <span className="text-foreground">{report.achievements}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">存在问题：</span>
                          <span className="text-foreground">{report.issues}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">下阶段计划：</span>
                          <span className="text-foreground">{report.nextPlan}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  暂无进展报告
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">审核记录</CardTitle>
            </CardHeader>
            <CardContent>
              {project.auditLogs.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-6">
                    {project.auditLogs.map((log, index) => (
                      <div key={log.id} className="relative pl-10">
                        <div
                          className={cn(
                            "absolute left-2.5 w-3 h-3 rounded-full border-2",
                            log.action === "approve"
                              ? "bg-emerald-500 border-emerald-500"
                              : log.action === "reject"
                              ? "bg-destructive border-destructive"
                              : "bg-primary border-primary"
                          )}
                        />
                        <div className="rounded-lg border border-border p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">
                                {log.operatorName}
                              </span>
                              <span
                                className={cn(
                                  "text-xs px-2 py-0.5 rounded-full",
                                  log.action === "approve"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : log.action === "reject"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-primary/10 text-primary"
                                )}
                              >
                                {log.action === "approve"
                                  ? "审核通过"
                                  : log.action === "reject"
                                  ? "退回修改"
                                  : "提交申报"}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.createdAt).toLocaleString("zh-CN")}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 mt-0.5" />
                            {log.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  暂无审核记录
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conclusion Tab */}
        {project.conclusionReport && (
          <TabsContent value="conclusion">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">结题报告</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">研究总结</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {project.conclusionReport.summary}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">主要成果</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {project.conclusionReport.achievements}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">创新点</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {project.conclusionReport.innovations}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">应用推广情况</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {project.conclusionReport.applications}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Scores Tab */}
        {project.scores && project.scores.length > 0 && (
          <TabsContent value="scores">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">评分结果</CardTitle>
                {project.finalScore && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">最终得分</p>
                    <p className="text-2xl font-bold text-primary">
                      {project.finalScore}
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.scores.map((score) => (
                    <div
                      key={score.id}
                      className="rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-foreground">
                          {score.judgeName}
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {score.total} 分
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">创新性</p>
                          <p className="font-semibold">{score.innovation}/30</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">实效性</p>
                          <p className="font-semibold">{score.effectiveness}/30</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">推广性</p>
                          <p className="font-semibold">{score.promotion}/20</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">规范性</p>
                          <p className="font-semibold">{score.documentation}/20</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        评语：{score.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve" ? "审核通过" : "退回修改"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comment">审核意见</Label>
              <Textarea
                id="comment"
                placeholder={
                  reviewAction === "approve"
                    ? "请输入审核通过意见..."
                    : "请输入退回修改的原因和建议..."
                }
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsReviewDialogOpen(false)}
              >
                取消
              </Button>
              <Button
                variant={reviewAction === "approve" ? "default" : "destructive"}
                onClick={() => setIsReviewDialogOpen(false)}
              >
                {reviewAction === "approve" ? "确认通过" : "确认退回"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
