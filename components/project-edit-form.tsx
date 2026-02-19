"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { projectCategories } from "@/lib/mock-data";
import { useProject, updateProject, deleteProject } from "@/lib/hooks/use-data";
import { statusConfig } from "@/lib/types";
import {
  ArrowLeft,
  Save,
  Send,
  Trash2,
  Upload,
  X,
  FileText,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface ProjectEditFormProps {
  projectId: string;
}

export function ProjectEditForm({ projectId }: ProjectEditFormProps) {
  const router = useRouter();
  const { data: project, isLoading } = useProject(projectId);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  // 表单状态 - 使用 useEffect 在数据加载后初始化
  const [formInitialized, setFormInitialized] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    summary: "",
    leader: "",
    phone: "",
    members: [""] as string[],
  });

  const [attachments, setAttachments] = useState<string[]>([]);

  // 当项目数据加载完成后初始化表单
  if (project && !formInitialized) {
    setForm({
      title: project.title || "",
      category: project.category || "",
      summary: project.summary || "",
      leader: project.leader || "",
      phone: project.phone || "",
      members: project.members?.length ? project.members : [""],
    });
    setFormInitialized(true);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">课题不存在</h2>
        <p className="text-muted-foreground mb-6">该课题可能已被删除或ID无效</p>
        <Button asChild>
          <Link href="/projects/apply">返回课题申报</Link>
        </Button>
      </div>
    );
  }

  const statusInfo = statusConfig[project.status] || {
    label: project.status,
    color: "bg-gray-100 text-gray-800",
  };

  const handleAddMember = () => {
    setForm({ ...form, members: [...form.members, ""] });
  };

  const handleRemoveMember = (index: number) => {
    const newMembers = form.members.filter((_, i) => i !== index);
    setForm({ ...form, members: newMembers.length > 0 ? newMembers : [""] });
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...form.members];
    newMembers[index] = value;
    setForm({ ...form, members: newMembers });
  };

  const handleSave = async () => {
    await updateProject(projectId, {
      ...form,
      members: form.members.filter(Boolean),
    });
    alert("保存成功！");
    router.push("/projects/apply");
  };

  const handleSubmit = async () => {
    await updateProject(projectId, {
      ...form,
      members: form.members.filter(Boolean),
      status: "pending_city",
    });
    alert("课题已提交审核，请等待审批结果。");
    setIsSubmitOpen(false);
    router.push("/projects/apply");
  };

  const handleDelete = async () => {
    await deleteProject(projectId);
    setIsDeleteOpen(false);
    router.push("/projects/apply");
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // 草稿或已退回状态可以编辑
  const isDraft = project.status === "draft";
  const isRejected = project.status.includes("rejected");
  const canEdit = isDraft || isRejected;

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild className="gap-2 -ml-2">
          <Link href="/projects/apply">
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Basic Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                课题名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="请输入课题名称"
                disabled={!canEdit}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">
                课题类别 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
                disabled={!canEdit}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="请选择课题类别" />
                </SelectTrigger>
                <SelectContent>
                  {projectCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">
              项目简介 <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="summary"
              value={form.summary}
              onChange={(e) =>
                setForm({ ...form, summary: e.target.value })
              }
              placeholder="请填写课题的项目简介，包括研究背景、主要内容、目标、计划及推进情况等"
              rows={8}
              disabled={!canEdit}
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>团队信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leader">
                负责人 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="leader"
                value={form.leader}
                onChange={(e) => setForm({ ...form, leader: e.target.value })}
                placeholder="请输入负责人姓名"
                disabled={!canEdit}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">
                联系电话 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="请输入联系电话"
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>课题成员</Label>
            <div className="space-y-2">
              {form.members.map((member, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={member}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    placeholder={`成员 ${index + 1}`}
                    disabled={!canEdit}
                  />
                  {canEdit && form.members.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMember(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {canEdit && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddMember}
                  className="mt-2 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  添加成员
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments Card */}
      <Card>
        <CardHeader>
          <CardTitle>相关附件</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          {canEdit && (
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                点击或拖拽文件到此处上传
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                支持 Word、PDF、Excel 等格式，单个文件不超过 20MB
              </p>
            </div>
          )}

          {/* Attachment List */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <Label>已上传文件</Label>
              <div className="space-y-2">
                {attachments.map((name, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm">{name}</span>
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAttachment(index)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {attachments.length === 0 && !canEdit && (
            <p className="text-sm text-muted-foreground text-center py-4">
              暂无附件
            </p>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive bg-transparent"
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          删除课题
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/projects/apply">取消</Link>
          </Button>
          {canEdit && (
            <>
              <Button variant="outline" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                保存草稿
              </Button>
              <Button onClick={() => setIsSubmitOpen(true)}>
                <Send className="h-4 w-4 mr-2" />
                提交审核
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除课题「{project.title}」吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>提交审核</AlertDialogTitle>
            <AlertDialogDescription>
              提交后课题将进入审核流程，审核期间无法修改。确定要提交吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              确认提交
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
