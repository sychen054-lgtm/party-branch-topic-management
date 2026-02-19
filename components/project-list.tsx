"use client";

import { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useProjects, useOrganizations } from "@/lib/hooks/use-data";
import type { Project, Organization } from "@/lib/types";
import {
  Search,
  Eye,
  FileText,
  Plus,
  ChevronDown,
  ChevronRight,
  Building2,
  Download,
  Send,
} from "lucide-react";
import Link from "next/link";

// 组织树节点组件
function OrgTreeNode({
  org,
  allOrgs,
  level,
  selectedOrg,
  onSelect,
  expandedOrgs,
  onToggle,
}: {
  org: Organization;
  allOrgs: Organization[];
  level: number;
  selectedOrg: string;
  onSelect: (orgId: string) => void;
  expandedOrgs: string[];
  onToggle: (orgId: string) => void;
}) {
  const children = allOrgs
    .filter((o) => o.parentId === org.id)
    .sort((a, b) => (a.code || "").localeCompare(b.code || ""));
  const hasChildren = children.length > 0;
  const isExpanded = expandedOrgs.includes(org.id);
  const isSelected = selectedOrg === org.id;

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-1.5 px-2 rounded cursor-pointer hover:bg-accent ${
          isSelected ? "bg-accent" : ""
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(org.id);
            }}
            className="p-0.5 hover:bg-muted rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        <span
          className="flex-1 text-sm truncate"
          onClick={() => onSelect(org.id)}
        >
          {org.name}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {children.map((child) => (
            <OrgTreeNode
              key={child.id}
              org={child}
              allOrgs={allOrgs}
              level={level + 1}
              selectedOrg={selectedOrg}
              onSelect={onSelect}
              expandedOrgs={expandedOrgs}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 状态映射
const getDisplayStatus = (status: string): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } => {
  switch (status) {
    case "approved":
    case "in_progress":
      return { label: "进行中", variant: "default" };
    case "concluded":
      return { label: "已结题", variant: "secondary" };
    default:
      return { label: status, variant: "outline" };
  }
};

const handleAddProgress = (project: Project) => {
  // Implementation for adding progress
};

export function ProjectList() {
  const { data: projects = [] } = useProjects();
  const { data: organizations = [] } = useOrganizations();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [reportCountFilter, setReportCountFilter] = useState<string>("");
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [expandedOrgs, setExpandedOrgs] = useState<string[]>(["org-1", "org-16"]);
  const [orgPopoverOpen, setOrgPopoverOpen] = useState(false);
  const [viewingContent, setViewingContent] = useState<string | null>(null);
  const [recommendProject, setRecommendProject] = useState<Project | null>(null);

  // 生成年份选项
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // 获取根节点组织
  const rootOrgs = organizations.filter((o) => o.parentId === null);

  // 获取选中组织的所有下级ID
  const getOrgAndChildrenIds = (orgId: string): string[] => {
    const result = [orgId];
    const children = organizations.filter((o) => o.parentId === orgId);
    for (const child of children) {
      result.push(...getOrgAndChildrenIds(child.id));
    }
    return result;
  };

  // 获取选中组织名称
  const getSelectedOrgName = () => {
    if (selectedOrg === "all") return "全部党支部";
    const org = organizations.find((o) => o.id === selectedOrg);
    return org?.name || "全部党支部";
  };

  // 切换展开状态
  const toggleOrg = (orgId: string) => {
    setExpandedOrgs((prev) =>
      prev.includes(orgId)
        ? prev.filter((id) => id !== orgId)
        : [...prev, orgId]
    );
  };

  // 选择组织
  const handleSelectOrg = (orgId: string) => {
    setSelectedOrg(orgId);
    setOrgPopoverOpen(false);
  };

  // 只显示已立项、进行中和已结题的课题
  const managedProjects = projects.filter(
    (p) => p.status === "approved" || p.status === "in_progress" || p.status === "concluded"
  );

  const filteredProjects = managedProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.organizationName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 状态筛选
    let matchesStatus = true;
    if (statusFilter === "in_progress") {
      matchesStatus = project.status === "approved" || project.status === "in_progress";
    } else if (statusFilter === "concluded") {
      matchesStatus = project.status === "concluded";
    }
    
    // 年份筛选
    const projectYear = new Date(project.createdAt).getFullYear().toString();
    const matchesYear = yearFilter === "all" || projectYear === yearFilter;
    
    // 组织筛选
    let matchesOrg = true;
    if (selectedOrg !== "all") {
      const orgIds = getOrgAndChildrenIds(selectedOrg);
      matchesOrg = orgIds.includes(project.organizationId);
    }

    // 汇报次数筛选
    const reportCount = project.progressReports?.length || 0;
    let matchesReportCount = true;
    if (reportCountFilter !== "") {
      const filterNum = parseInt(reportCountFilter, 10);
      if (!isNaN(filterNum)) {
        matchesReportCount = reportCount === filterNum;
      }
    }
    
    return matchesSearch && matchesStatus && matchesYear && matchesOrg && matchesReportCount;
  });

  // 推荐参加评选
  const handleRecommend = () => {
    if (recommendProject) {
      alert(`已将课题"${recommendProject.title}"推荐参加市级评选，课题已同步到评选管理模块。`);
      setRecommendProject(null);
    }
  };

  // 导出Excel功能
  const handleExport = () => {
    const headers = ["党支部", "课题名称", "最新进展内容", "最新进度"];
    const rows = filteredProjects.map((project) => {
      const reportCount = project.progressReports?.length || 0;
      const progressPercent = reportCount > 0 ? Math.min(reportCount * 20, 100) : 0;
      const latestReport = project.progressReports && project.progressReports.length > 0
        ? project.progressReports[project.progressReports.length - 1]
        : null;
      const latestContent = latestReport?.content || "";
      
      return [
        project.organizationName,
        project.title,
        latestContent,
        `${progressPercent}%`,
      ];
    });

    const escapeCSV = (str: string) => {
      if (str.includes(",") || str.includes("\n") || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `课题进展_${new Date().toLocaleDateString("zh-CN").replace(/\//g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索课题名称、申报单位..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* 年份筛选 */}
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="年份" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部年份</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}年
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 党支部树状选择器 */}
              <Popover open={orgPopoverOpen} onOpenChange={setOrgPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40 justify-between bg-transparent">
                    <span className="flex items-center gap-2 truncate">
                      <Building2 className="h-4 w-4 shrink-0" />
                      <span className="truncate">{getSelectedOrgName()}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="start">
                  <div
                    className={`flex items-center gap-1 py-1.5 px-2 rounded cursor-pointer hover:bg-accent ${
                      selectedOrg === "all" ? "bg-accent" : ""
                    }`}
                    onClick={() => handleSelectOrg("all")}
                  >
                    <span className="w-4" />
                    <span className="text-sm">全部党支部</span>
                  </div>
                  <div className="border-t my-1" />
                  <div className="max-h-64 overflow-y-auto">
                    {rootOrgs.map((org) => (
                      <OrgTreeNode
                        key={org.id}
                        org={org}
                        allOrgs={organizations}
                        level={0}
                        selectedOrg={selectedOrg}
                        onSelect={handleSelectOrg}
                        expandedOrgs={expandedOrgs}
                        onToggle={toggleOrg}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* 状态筛选 */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="in_progress">进行中</SelectItem>
                  <SelectItem value="concluded">已结题</SelectItem>
                </SelectContent>
              </Select>

              {/* 汇报次数筛选 */}
              <Input
                type="number"
                min="0"
                placeholder="汇报次数"
                value={reportCountFilter}
                onChange={(e) => setReportCountFilter(e.target.value)}
                className="w-24"
              />

              {/* 导出按钮 */}
              <Button variant="outline" className="gap-2 bg-transparent" onClick={handleExport}>
                <Download className="h-4 w-4" />
                导出
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          共 {filteredProjects.length} 个课题
        </p>
      </div>

      {/* Project Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">序号</TableHead>
                <TableHead className="w-20">年份</TableHead>
                <TableHead className="w-28">党支部</TableHead>
                <TableHead>课题名称</TableHead>
                <TableHead className="w-20">汇报次数</TableHead>
                <TableHead className="w-20">最新进度</TableHead>
                <TableHead className="w-28">最新进展</TableHead>
                <TableHead className="w-20">状态</TableHead>
                <TableHead className="w-28">创建时间</TableHead>
                <TableHead className="text-right w-20">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project, index) => {
                const displayStatus = getDisplayStatus(project.status);
                const reportCount = project.progressReports?.length || 0;
                const progressPercent = reportCount > 0 
                  ? Math.min(reportCount * 20, 100) 
                  : 0;
                const latestReport = project.progressReports && project.progressReports.length > 0
                  ? project.progressReports[project.progressReports.length - 1]
                  : null;
                const latestContent = latestReport?.content || "";
                
                return (
                  <TableRow key={project.id}>
                    <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      {new Date(project.createdAt).getFullYear()}
                    </TableCell>
                    <TableCell>{project.organizationName}</TableCell>
                    <TableCell className="font-medium">
                      <span className="line-clamp-1">{project.title}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-primary font-medium">{reportCount}</span> 次
                    </TableCell>
                    <TableCell>
                      <span className="text-primary font-medium">{progressPercent}%</span>
                    </TableCell>
                    <TableCell>
                      {latestContent ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-muted-foreground hover:text-foreground"
                          onClick={() => setViewingContent(latestContent)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={displayStatus.variant}>
                        {displayStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(project.createdAt).toLocaleDateString("zh-CN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/projects/${project.id}/progress`}>
                            <Plus className="h-4 w-4 mr-1" />
                            进展
                          </Link>
                        </Button>
                        {project.status !== "concluded" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setRecommendProject(project)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            申报
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredProjects.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-12 text-muted-foreground"
                  >
                    没有找到符合条件的课题
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Progress Content Dialog */}
      <Dialog open={!!viewingContent} onOpenChange={() => setViewingContent(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>最新进展内容</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {viewingContent}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recommend to Selection Dialog */}
      <Dialog open={!!recommendProject} onOpenChange={() => setRecommendProject(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>推荐参加评选</DialogTitle>
          </DialogHeader>
          {recommendProject && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">课题名称</p>
                <p className="font-medium">{recommendProject.title}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">党支部</p>
                <p className="font-medium">{recommendProject.organizationName}</p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm font-medium text-primary mb-2">推荐参加市级评选</p>
                <p className="text-sm text-muted-foreground">
                  确认后，该课题将被推荐参加市级评选，并同步到评选管理模块中。
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setRecommendProject(null)}
                  className="bg-transparent"
                >
                  取消
                </Button>
                <Button className="gap-2" onClick={handleRecommend}>
                  <Send className="h-4 w-4" />
                  确认推荐
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
