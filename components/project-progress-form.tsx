"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useProject } from "@/lib/hooks/use-data";
import type { ProgressReport, ProgressReportStatus } from "@/lib/types";
import {
  ArrowLeft,
  Send,
  Upload,
  FileText,
  X,
  CheckCircle,
  Plus,
  Clock,
  Edit,
  Save,
  AlertCircle,
  Flag,
} from "lucide-react";
import Link from "next/link";

interface ProjectProgressFormProps {
  projectId: string;
}

// 进展报告状态配置
const statusConfig: Record<
  ProgressReportStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  draft: { label: "草稿", variant: "secondary" },
  submitted: { label: "已提交", variant: "default" },
  returned: { label: "已退回", variant: "destructive" },
};

export function ProjectProgressForm({ projectId }: ProjectProgressFormProps) {
  const { data: project, isLoading } = useProject(projectId);

  const [isAddingReport, setIsAddingReport] = useState(false);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [form, setForm] = useState({
    stage: "",
    situation: "",
    progress: "",
  });

  const [attachments, setAttachments] = useState<string[]>([]);
  
  // 结题相关状态
  const [isAddingConclusion, setIsAddingConclusion] = useState(false);
  const [conclusionForm, setConclusionForm] = useState({
    summary: "",
    achievements: "",
    innovations: "",
  });
  const [conclusionAttachments, setConclusionAttachments] = useState<string[]>([]);

  if (!project) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild className="gap-2 -ml-2">
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Link>
        </Button>
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            课题不存在
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddAttachment = () => {
    setAttachments([...attachments, `附件${attachments.length + 1}.pdf`]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // 保存草稿
  const handleSaveDraft = () => {
    alert("草稿已保存，您可以稍后继续编辑");
    setIsAddingReport(false);
    setEditingReportId(null);
    setForm({ stage: "", situation: "", progress: "" });
    setAttachments([]);
  };

  // 提交进展
  const handleSubmit = () => {
    alert("阶段性汇报已提交，提交后将无法修改");
    setIsAddingReport(false);
    setEditingReportId(null);
    setForm({ stage: "", situation: "", progress: "" });
    setAttachments([]);
  };

  // 取消编辑
  const handleCancel = () => {
    setIsAddingReport(false);
    setEditingReportId(null);
    setForm({ stage: "", situation: "", progress: "" });
    setAttachments([]);
  };

  // 编辑进展报告
  const handleEdit = (report: ProgressReport) => {
    setEditingReportId(report.id);
    setForm({
      stage: report.title,
      situation: report.content,
      progress: report.achievements,
    });
    setAttachments(report.attachments?.map((a) => a.name) || []);
  };

  // 判断进展报告是否可编辑
  const canEditReport = (report: ProgressReport) => {
    const status = report.status || "draft";
    return status === "draft" || status === "returned";
  };

  // 结题相关函数
  const handleAddConclusionAttachment = () => {
    setConclusionAttachments([...conclusionAttachments, `结题附件${conclusionAttachments.length + 1}.pdf`]);
  };

  const handleRemoveConclusionAttachment = (index: number) => {
    setConclusionAttachments(conclusionAttachments.filter((_, i) => i !== index));
  };

  const handleSaveConclusionDraft = () => {
    alert("结题报告草稿已保存");
    setIsAddingConclusion(false);
  };

  const handleSubmitConclusion = () => {
    alert("结题报告已提交，课题状态将更新为已结题");
    setIsAddingConclusion(false);
    setConclusionForm({ summary: "", achievements: "", innovations: "" });
    setConclusionAttachments([]);
  };

  const handleCancelConclusion = () => {
    setIsAddingConclusion(false);
    setConclusionForm({ summary: "", achievements: "", innovations: "" });
    setConclusionAttachments([]);
  };

  const progressCount = project.progressReports?.length || 0;
  const hasConclusionReport = !!project.conclusionReport;
  const canSubmitConclusion = project.status !== "concluded" && !hasConclusionReport;

  return (
    <div className="space-y-6 w-full">
      {/* Back Button */}
      <Button variant="ghost" asChild className="gap-2 -ml-2">
        <Link href="/projects">
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </Link>
      </Button>

      {/* Project Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">课题信息</CardTitle>
            <Badge variant="default">
              {project.status === "concluded" ? "已结题" : "进行中"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {/* 课题名称 */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">课题名称</p>
              <h3 className="font-semibold text-lg">{project.title}</h3>
            </div>

            {/* 基本信息 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">党支部</p>
                <p className="font-medium">{project.organizationName}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">支部书记</p>
                <p className="font-medium">{project.leader}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">立项时间</p>
                <p className="font-medium">
                  {new Date(project.createdAt).toLocaleDateString("zh-CN")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">已提交进展</p>
                <p className="font-medium">{progressCount} 次</p>
              </div>
            </div>

            {/* 项目简介 */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">项目简介</p>
              <p className="text-sm whitespace-pre-wrap bg-muted/30 rounded-lg p-3">
                {project.summary || "暂无"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress History */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">历史进展</CardTitle>
            {!isAddingReport && !editingReportId && (
              <Button
                size="sm"
                className="gap-1"
                onClick={() => setIsAddingReport(true)}
              >
                <Plus className="h-4 w-4" />
                新增阶段性汇报
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* History List */}
          {progressCount > 0 ? (
            <div className="space-y-3">
              {project.progressReports?.map((report, index) => {
                const reportStatus = report.status || "submitted";
                const isEditing = editingReportId === report.id;
                const canEdit = canEditReport(report);

                if (isEditing) {
                  // 编辑状态
                  return (
                    <div
                      key={report.id}
                      className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-primary">
                          编辑 - {report.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={statusConfig[reportStatus].variant}>
                            {statusConfig[reportStatus].label}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{new Date().toLocaleString("zh-CN")}</span>
                          </div>
                        </div>
                      </div>

                      {/* 退回原因提示 */}
                      {reportStatus === "returned" && report.returnComment && (
                        <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-destructive">
                                退回原因
                              </p>
                              <p className="text-sm text-destructive/80 mt-1">
                                {report.returnComment}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-stage">
                            汇报阶段 <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="edit-stage"
                            value={form.stage}
                            onChange={(e) =>
                              setForm({ ...form, stage: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-situation">
                            项目推进情况{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="edit-situation"
                            rows={4}
                            value={form.situation}
                            onChange={(e) =>
                              setForm({ ...form, situation: e.target.value })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="edit-progress">
                            当前进度 <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="edit-progress"
                            value={form.progress}
                            onChange={(e) =>
                              setForm({ ...form, progress: e.target.value })
                            }
                          />
                        </div>

                        {/* Attachments */}
                        <div className="space-y-2">
                          <Label>附件材料</Label>
                          <div
                            className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={handleAddAttachment}
                          >
                            <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                            <p className="text-sm text-muted-foreground">
                              点击或拖拽文件到此处上传
                            </p>
                          </div>
                          {attachments.length > 0 && (
                            <div className="space-y-2 mt-2">
                              {attachments.map((file, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2 rounded border bg-background"
                                >
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{file}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleRemoveAttachment(idx)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-2">
                          <Button
                            variant="outline"
                            onClick={handleCancel}
                            className="bg-transparent"
                          >
                            取消
                          </Button>
                          <Button
                            variant="outline"
                            className="gap-2 bg-transparent"
                            onClick={handleSaveDraft}
                          >
                            <Save className="h-4 w-4" />
                            保存草稿
                          </Button>
                          <Button className="gap-2" onClick={handleSubmit}>
                            <Send className="h-4 w-4" />
                            提交
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }

                // 显示状态
                return (
                  <div
                    key={report.id}
                    className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{report.title}</span>
                          <Badge variant={statusConfig[reportStatus].variant}>
                            {statusConfig[reportStatus].label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(report.submittedAt).toLocaleString(
                                "zh-CN"
                              )}
                            </span>
                          </div>
                          {canEdit && !editingReportId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2"
                              onClick={() => handleEdit(report)}
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              编辑
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* 退回原因提示 */}
                      {reportStatus === "returned" && report.returnComment && (
                        <div className="mb-3 p-2 rounded bg-destructive/10 border border-destructive/20">
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>退回原因：{report.returnComment}</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            推进情况：
                          </span>
                          <span>{report.content}</span>
                        </div>
                        {report.achievements && (
                          <div>
                            <span className="text-muted-foreground">
                              当前进度：
                            </span>
                            <span>{report.achievements}</span>
                          </div>
                        )}
                        {report.attachments && report.attachments.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground text-xs">
                              {report.attachments.length} 个附件
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {reportStatus === "submitted" && (
                      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            !isAddingReport && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                <p>暂无历史进展记录</p>
                <p className="text-sm mt-1">点击上方按钮新增阶段性汇报</p>
              </div>
            )
          )}

          {/* Add New Report Form - Now below history */}
          {isAddingReport && (
            <div className="mt-6 p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-primary">
                  第 {progressCount + 1} 阶段汇报
                </h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{new Date().toLocaleString("zh-CN")}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stage">
                    汇报阶段 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="stage"
                    placeholder="如：第一阶段、中期汇报、结题汇报等"
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="situation">
                    项目推进情况 <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="situation"
                    placeholder="请详细描述本阶段的项目推进情况..."
                    rows={4}
                    value={form.situation}
                    onChange={(e) =>
                      setForm({ ...form, situation: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="progress">
                    当前进度 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="progress"
                    placeholder="请填写当前进度，如：已完成60%、接近尾声等"
                    value={form.progress}
                    onChange={(e) =>
                      setForm({ ...form, progress: e.target.value })
                    }
                  />
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <Label>附件材料</Label>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={handleAddAttachment}
                  >
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                    <p className="text-sm text-muted-foreground">
                      点击或拖拽文件到此处上传
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      支持 Word、PDF、Excel、图片等格式
                    </p>
                  </div>
                  {attachments.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded border bg-background"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{file}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRemoveAttachment(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="bg-transparent"
                  >
                    取消
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={handleSaveDraft}
                  >
                    <Save className="h-4 w-4" />
                    保存草稿
                  </Button>
                  <Button className="gap-2" onClick={handleSubmit}>
                    <Send className="h-4 w-4" />
                    提交
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conclusion Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Flag className="h-4 w-4" />
              结题
            </CardTitle>
            {canSubmitConclusion && !isAddingConclusion && (
              <Button
                size="sm"
                className="gap-1"
                onClick={() => setIsAddingConclusion(true)}
              >
                <Plus className="h-4 w-4" />
                填写结题报告
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* 已结题状态显示 */}
          {project.status === "concluded" && project.conclusionReport && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">课题已结题</span>
                <span className="text-sm text-muted-foreground ml-2">
                  {new Date(project.conclusionReport.submittedAt).toLocaleString("zh-CN")}
                </span>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">研究总结</p>
                  <p className="text-sm bg-muted/30 rounded-lg p-3">{project.conclusionReport.summary}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">主要成果</p>
                  <p className="text-sm bg-muted/30 rounded-lg p-3">{project.conclusionReport.achievements}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">创新点</p>
                  <p className="text-sm bg-muted/30 rounded-lg p-3">{project.conclusionReport.innovations}</p>
                </div>
                {project.conclusionReport.attachments && project.conclusionReport.attachments.length > 0 && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {project.conclusionReport.attachments.length} 个附件
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 结题草稿状态 */}
          {hasConclusionReport && project.conclusionReport?.status === "pending" && !isAddingConclusion && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-600">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">结题报告待审核</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 bg-transparent"
                  onClick={() => {
                    setIsAddingConclusion(true);
                    setConclusionForm({
                      summary: project.conclusionReport?.summary || "",
                      achievements: project.conclusionReport?.achievements || "",
                      innovations: project.conclusionReport?.innovations || "",
                    });
                  }}
                >
                  <Edit className="h-4 w-4" />
                  编辑
                </Button>
              </div>
            </div>
          )}

          {/* 填写结题报告表单 */}
          {isAddingConclusion && (
            <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-primary">结题报告</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{new Date().toLocaleString("zh-CN")}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="conclusion-summary">
                    研究总结 <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="conclusion-summary"
                    placeholder="请总结课题研究的整体情况..."
                    rows={4}
                    value={conclusionForm.summary}
                    onChange={(e) => setConclusionForm({ ...conclusionForm, summary: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conclusion-achievements">
                    主要成果 <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="conclusion-achievements"
                    placeholder="请描述课题取得的主要成果..."
                    rows={4}
                    value={conclusionForm.achievements}
                    onChange={(e) => setConclusionForm({ ...conclusionForm, achievements: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conclusion-innovations">
                    创新点 <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="conclusion-innovations"
                    placeholder="请描述课题研究的创新之处..."
                    rows={3}
                    value={conclusionForm.innovations}
                    onChange={(e) => setConclusionForm({ ...conclusionForm, innovations: e.target.value })}
                  />
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <Label>结题材料附件</Label>
                  <div
                    className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={handleAddConclusionAttachment}
                  >
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                    <p className="text-sm text-muted-foreground">
                      点击或拖拽文件到此处上传
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      支持上传结题报告、成果材料等
                    </p>
                  </div>
                  {conclusionAttachments.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {conclusionAttachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded border bg-background"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{file}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRemoveConclusionAttachment(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleCancelConclusion}
                    className="bg-transparent"
                  >
                    取消
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={handleSaveConclusionDraft}
                  >
                    <Save className="h-4 w-4" />
                    保存草稿
                  </Button>
                  <Button className="gap-2" onClick={handleSubmitConclusion}>
                    <Send className="h-4 w-4" />
                    确定结题
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 未开始结题 */}
          {!hasConclusionReport && !isAddingConclusion && project.status !== "concluded" && (
            <div className="text-center py-8 text-muted-foreground">
              <Flag className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
              <p>课题尚未结题</p>
              <p className="text-sm mt-1">完成所有阶段性汇报后，点击上方按钮填写结题报告</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
