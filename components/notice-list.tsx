"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNotices } from "@/lib/hooks/use-data";
import {
  Plus,
  Search,
  Pin,
  Calendar,
  Paperclip,
  Eye,
  FileText,
  Clock,
} from "lucide-react";
import Link from "next/link";

export function NoticeList() {
  const { data: notices = [] } = useNotices();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredNotices = notices.filter(
    (notice: Record<string, unknown>) =>
      ((notice.title as string) || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      ((notice.content as string) || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索通知..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              发布通知
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>发布新通知</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="notice-title">通知标题</Label>
                <Input
                  id="notice-title"
                  placeholder="请输入通知标题"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batch-name">批次名称</Label>
                <Input
                  id="batch-name"
                  placeholder="如：2024年度第一批"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">申报截止时间</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                  />
                </div>
                <div className="space-y-2">
                  <Label>是否置顶</Label>
                  <div className="flex items-center gap-4 h-10">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="isTop" value="yes" className="accent-primary" />
                      <span className="text-sm">是</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="isTop" value="no" defaultChecked className="accent-primary" />
                      <span className="text-sm">否</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notice-content">通知内容</Label>
                <Textarea
                  id="notice-content"
                  placeholder="请输入通知内容..."
                  rows={8}
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
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsCreateOpen(false)}>
                  发布
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{notices.length}</p>
              <p className="text-sm text-muted-foreground">通知总数</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-amber-100 p-3">
              <Pin className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {notices.filter((n: Record<string, unknown>) => n.type === "announcement").length}
              </p>
              <p className="text-sm text-muted-foreground">重要公告</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-emerald-100 p-3">
              <Eye className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {notices.filter((n: Record<string, unknown>) => n.isRead).length}
              </p>
              <p className="text-sm text-muted-foreground">已读通知</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notice List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">全部通知</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredNotices.map((notice: Record<string, unknown>) => (
              <Link
                key={notice.id as string}
                href={`/notices/${notice.id}`}
                className="block"
              >
                <div className="group rounded-lg border border-border p-4 transition-all hover:border-primary/50 hover:bg-accent/30">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {notice.type === "announcement" && (
                          <span className="rounded bg-destructive px-1.5 py-0.5 text-[10px] font-medium text-destructive-foreground">
                            公告
                          </span>
                        )}
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {notice.title as string}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {((notice.content as string) || "").substring(0, 150)}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(notice.createdAt as string).toLocaleDateString("zh-CN")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {notice.isRead ? "已读" : "未读"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {notice.type === "announcement" ? "公告" : "通知"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
