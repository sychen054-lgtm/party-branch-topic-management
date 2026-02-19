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
} from "@/components/ui/dialog";
import { useNotices } from "@/lib/hooks/use-data";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Paperclip,
  Pin,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";

interface NoticeDetailProps {
  noticeId: string;
}

export function NoticeDetail({ noticeId }: NoticeDetailProps) {
  const { data: notices = [] } = useNotices();
  const notice = notices.find((n: { id: string }) => n.id === noticeId);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // 编辑表单状态
  const [editForm, setEditForm] = useState({
    title: notice?.title || "",
    batchName: notice?.batchName || "",
    content: notice?.content || "",
    deadline: notice?.deadline ? new Date(notice.deadline).toISOString().slice(0, 16) : "",
    isTop: notice?.isTop || false,
  });

  if (!notice) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">通知不存在</p>
        <Button variant="link" asChild className="mt-2">
          <Link href="/notices">返回通知列表</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild className="gap-2 -ml-2">
          <Link href="/notices">
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setIsEditOpen(true)}>
            <Edit className="h-4 w-4" />
            编辑
          </Button>
          <Button variant="outline" className="gap-2 text-destructive hover:text-destructive bg-transparent" onClick={() => setIsDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
            删除
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex items-start gap-3">
                {notice.isTop && (
                  <span className="rounded bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground flex items-center gap-1">
                    <Pin className="h-3 w-3" />
                    置顶
                  </span>
                )}
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {notice.batchName}
                </span>
              </div>
              <CardTitle className="text-xl leading-relaxed">
                {notice.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {notice.publisherName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(notice.publishTime).toLocaleDateString("zh-CN")}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {notice.readCount} 已读
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground">
                {notice.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Deadline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                截止时间
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {new Date(notice.deadline).toLocaleDateString("zh-CN")}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(notice.deadline) > new Date() ? (
                    <span className="text-emerald-600">申报进行中</span>
                  ) : (
                    <span className="text-destructive">已截止</span>
                  )}
                </p>
              </div>
              <div className="mt-4">
                <Button className="w-full" asChild>
                  <Link href={notice.batchName === "进展报告" ? "/projects" : "/projects/apply"}>
                    {notice.batchName === "进展报告" ? "提交进展" : "立即申报"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {notice.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  附件下载
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {notice.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="rounded bg-primary/10 p-2">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(attachment.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Read Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4" />
                阅读情况
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">已读</span>
                  <span className="font-semibold text-foreground">
                    {notice.readCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">总数</span>
                  <span className="font-semibold text-foreground">
                    {notice.totalCount}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${(notice.readCount / notice.totalCount) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  阅读率 {((notice.readCount / notice.totalCount) * 100).toFixed(0)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑通知</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">通知标题</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="请输入通知标题"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-batch">批次名称</Label>
              <Input
                id="edit-batch"
                value={editForm.batchName}
                onChange={(e) => setEditForm({ ...editForm, batchName: e.target.value })}
                placeholder="如：2026年度第一批"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-deadline">申报截止时间</Label>
                <Input
                  id="edit-deadline"
                  type="datetime-local"
                  value={editForm.deadline}
                  onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>是否置顶</Label>
                <div className="flex items-center gap-4 h-10">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="editIsTop" 
                      checked={editForm.isTop === true}
                      onChange={() => setEditForm({ ...editForm, isTop: true })}
                      className="accent-primary" 
                    />
                    <span className="text-sm">是</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="editIsTop" 
                      checked={editForm.isTop === false}
                      onChange={() => setEditForm({ ...editForm, isTop: false })}
                      className="accent-primary" 
                    />
                    <span className="text-sm">否</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">通知内容</Label>
              <Textarea
                id="edit-content"
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                placeholder="请输入通知内容..."
                rows={10}
              />
            </div>
            <div className="space-y-2">
              <Label>附件</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Paperclip className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  点击或拖拽文件到此处上传
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  支持 Word、PDF、Excel 等格式
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                取消
              </Button>
              <Button onClick={() => {
                // 这里可以添加保存逻辑
                setIsEditOpen(false);
              }}>
                保存修改
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              确定要删除通知「{notice.title}」吗？此操作不可撤销。
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={() => {
              // 这里可以添加删除逻辑
              setIsDeleteOpen(false);
            }}>
              确认删除
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
