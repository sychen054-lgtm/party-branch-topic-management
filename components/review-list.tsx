"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import type { Project } from "@/lib/types";
import { Building2, Check, Clock, Eye, FileText, X } from "lucide-react";
import Link from "next/link";

export function ReviewList() {
  const { data: allProjects = [] } = useProjects();
  const pendingProjects = allProjects.filter(
    (p: Project) => p.status === "pending_county" || p.status === "pending_city"
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">(
    "approve"
  );

  const handleReview = (project: Project, action: "approve" | "reject") => {
    setSelectedProject(project);
    setReviewAction(action);
    setReviewDialogOpen(true);
  };

  const countyPending = pendingProjects.filter(
    (p) => p.status === "pending_county"
  );
  const cityPending = pendingProjects.filter((p) => p.status === "pending_city");

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
                {pendingProjects.length}
              </p>
              <p className="text-sm text-muted-foreground">待审核总数</p>
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
                {countyPending.length}
              </p>
              <p className="text-sm text-muted-foreground">县级待审</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-emerald-100 p-3">
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {cityPending.length}
              </p>
              <p className="text-sm text-muted-foreground">市级待审</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="county" className="space-y-4">
        <TabsList>
          <TabsTrigger value="county">
            县级待审 ({countyPending.length})
          </TabsTrigger>
          <TabsTrigger value="city">市级待审 ({cityPending.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="county">
          <ProjectReviewTable projects={countyPending} onReview={handleReview} />
        </TabsContent>

        <TabsContent value="city">
          <ProjectReviewTable projects={cityPending} onReview={handleReview} />
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "approve" ? "审核通过" : "退回修改"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedProject && (
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p className="font-medium text-foreground mb-1">
                  {selectedProject.title}
                </p>
                <p className="text-muted-foreground">
                  {selectedProject.organizationName} · {selectedProject.leader}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="review-comment">审核意见</Label>
              <Textarea
                id="review-comment"
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
                onClick={() => setReviewDialogOpen(false)}
              >
                取消
              </Button>
              <Button
                variant={reviewAction === "approve" ? "default" : "destructive"}
                onClick={() => setReviewDialogOpen(false)}
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

function ProjectReviewTable({
  projects,
  onReview,
}: {
  projects: Project[];
  onReview: (project: Project, action: "approve" | "reject") => void;
}) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">暂无待审核课题</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[280px]">课题名称</TableHead>
              <TableHead>申报单位</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>类别</TableHead>
              <TableHead>申报时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <span className="line-clamp-1">{project.title}</span>
                </TableCell>
                <TableCell>{project.organizationName}</TableCell>
                <TableCell>{project.leader}</TableCell>
                <TableCell>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                    {project.category}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(project.createdAt).toLocaleDateString("zh-CN")}
                </TableCell>
                <TableCell>
                  <StatusBadge status={project.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/projects/${project.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                      onClick={() => onReview(project, "reject")}
                    >
                      <X className="h-4 w-4" />
                      退回
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() => onReview(project, "approve")}
                    >
                      <Check className="h-4 w-4" />
                      通过
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
