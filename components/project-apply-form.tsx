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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { projectCategories } from "@/lib/mock-data";
import { useProjects, useOrganizations, updateProject, createProject, deleteProject } from "@/lib/hooks/use-data";
import { statusConfig } from "@/lib/types";
import type { ProjectStatus, Project, Organization } from "@/lib/types";
import {
  Save,
  Send,
  Plus,
  X,
  Search,
  Edit,
  Trash2,
  Upload,
  FileText,
  ChevronRight,
  ChevronDown,
  Building2,
  Download,
  RotateCcw,
  Check,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// 简化的审核状态选项
const statusOptions: { value: string; label: string }[] = [
  { value: "all", label: "全部状态" },
  { value: "draft", label: "草稿" },
  { value: "pending", label: "待审核" },
  { value: "approved", label: "已通过" },
  { value: "rejected", label: "已退回" },
];

// 年份选项
const currentYear = new Date().getFullYear();
const yearOptions = [
  { value: "all", label: "全部年份" },
  ...Array.from({ length: 5 }, (_, i) => ({
    value: String(currentYear - i),
    label: `${currentYear - i}年`,
  })),
];

// 判断状态分类
function getStatusCategory(status: ProjectStatus): string {
  if (status === "draft") return "draft";
  if (status.includes("pending")) return "pending";
  if (status.includes("rejected")) return "rejected";
  if (["approved", "in_progress", "concluded", "published"].includes(status)) return "approved";
  return "other";
}

// 构建组织树结构
interface OrgTreeNode extends Organization {
  children: OrgTreeNode[];
}

/** 子节点排序：嘉兴直属（机关第一～第八、销售、专卖、配送）按 code 在前，海宁市烟草专卖局在后；海宁下属支部按 code */
function sortOrgChildren(nodes: OrgTreeNode[]): void {
  nodes.forEach((n) => {
    if (n.children.length) {
      sortOrgChildren(n.children);
      n.children.sort((a, b) => (a.code || "").localeCompare(b.code || ""));
    }
  });
}

function buildOrgTree(orgs: Organization[]): OrgTreeNode[] {
  const orgMap = new Map<string, OrgTreeNode>();
  const roots: OrgTreeNode[] = [];

  orgs.forEach((org) => {
    orgMap.set(org.id, { ...org, children: [] });
  });

  orgs.forEach((org) => {
    const node = orgMap.get(org.id)!;
    if (org.parentId) {
      const parent = orgMap.get(org.parentId);
      if (parent) parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  sortOrgChildren(roots);
  return roots;
}

// 组织树节点组件
function OrgTreeNode({
  node,
  level = 0,
  selectedId,
  onSelect,
  expandedIds,
  onToggleExpand,
}: {
  node: OrgTreeNode;
  level?: number;
  selectedId: string;
  onSelect: (org: OrgTreeNode) => void;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
          isSelected && "bg-primary/10 text-primary"
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(node)}
      >
        {hasChildren ? (
          <button
            type="button"
            className="p-0.5 hover:bg-accent rounded"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">{node.name}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <OrgTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectApplyForm() {
  const { data: projectList = [], mutate: mutateProjects } = useProjects("active");
  const { data: organizations = [] } = useOrganizations();

  const [searchName, setSearchName] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterOrg, setFilterOrg] = useState<string>("all");
  const [filterOrgName, setFilterOrgName] = useState<string>("全部党支部");
  const [isOrgPopoverOpen, setIsOrgPopoverOpen] = useState(false);
  const [expandedOrgIds, setExpandedOrgIds] = useState<Set<string>>(new Set(["org-1", "org-16"]));
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<string[]>([""]);
  const [attachments, setAttachments] = useState<string[]>([]);

  // 表单数据
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    organizationId: "",
    organizationName: "",
    summary: "",
    leader: "",
    phone: "",
  });
  
  // 新建课题时的组织选择弹窗
  const [isFormOrgPopoverOpen, setIsFormOrgPopoverOpen] = useState(false);
  const [formExpandedOrgIds, setFormExpandedOrgIds] = useState<Set<string>>(new Set(["org-1"]));

  // 组织树
  const orgTree = buildOrgTree(organizations);

  const toggleOrgExpand = (id: string) => {
    const newExpanded = new Set(expandedOrgIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedOrgIds(newExpanded);
  };

  const handleOrgSelect = (org: OrgTreeNode) => {
    setFilterOrg(org.id);
    setFilterOrgName(org.name);
    setIsOrgPopoverOpen(false);
  };

  const handleSelectAllOrgs = () => {
    setFilterOrg("all");
    setFilterOrgName("全部党支部");
    setIsOrgPopoverOpen(false);
  };

  const addMember = () => {
    setMembers([...members, ""]);
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, value: string) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  // 获取组织及其所有子组织的ID列表
  const getOrgAndChildrenIds = (orgId: string): string[] => {
    const ids: string[] = [orgId];
    const findChildren = (parentId: string) => {
      organizations.forEach((org: Organization) => {
        if (org.parentId === parentId) {
          ids.push(org.id);
          findChildren(org.id);
        }
      });
    };
    findChildren(orgId);
    return ids;
  };

  // 筛选课题
  const filteredProjects = projectList.filter((project: Project) => {
    const matchName = project.title.toLowerCase().includes(searchName.toLowerCase());
    
    let matchStatus = true;
    if (filterStatus !== "all") {
      const category = getStatusCategory(project.status as ProjectStatus);
      matchStatus = category === filterStatus;
    }

    let matchYear = true;
    if (filterYear !== "all") {
      const projectYear = new Date(project.createdAt).getFullYear();
      matchYear = String(projectYear) === filterYear;
    }

    let matchOrg = true;
    if (filterOrg !== "all") {
      const orgIds = getOrgAndChildrenIds(filterOrg);
      matchOrg = orgIds.includes(project.organizationId);
    }
    
    return matchName && matchStatus && matchYear && matchOrg;
  });

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      organizationId: "",
      organizationName: "",
      summary: "",
      leader: "",
      phone: "",
    });
    setMembers([""]);
    setAttachments([]);
  };
  
  // 表单中选择组织（仅允许选择支部 level，不可选公司/分公司）
  const handleFormOrgSelect = (org: OrgTreeNode) => {
    if (org.level !== "branch") {
      return;
    }
    setFormData({ ...formData, organizationId: org.id, organizationName: org.name });
    setIsFormOrgPopoverOpen(false);
  };
  
  const toggleFormOrgExpand = (id: string) => {
    const newExpanded = new Set(formExpandedOrgIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setFormExpandedOrgIds(newExpanded);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteOpen(true);
  };

  // 审核通过
  const handleApprove = async (project: Project) => {
    if (confirm(`确定要通过课题"${project.title}"的审核吗？`)) {
      await updateProject(project.id, { status: "approved" });
      mutateProjects();
      alert("课题审核已通过！");
    }
  };

  // 退回课题
  const handleReject = async (project: Project) => {
    if (confirm(`确定要将课题"${project.title}"退回给支部修改吗？`)) {
      await updateProject(project.id, { status: "rejected_by_admin" });
      mutateProjects();
      alert("课题已退回，支部可重新编辑提交。");
    }
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    if (!formData.title) {
      alert("请填写课题名称");
      return;
    }
    await createProject({
      ...formData,
      members: members.filter(Boolean),
      status: "draft",
    });
    mutateProjects();
    alert("草稿保存成功！");
    setIsCreateOpen(false);
    resetForm();
  };

  // 提交申报
  const handleSubmit = async () => {
    if (!formData.title) {
      alert("请填写课题名称");
      return;
    }
    if (!formData.category) {
      alert("请选择课题类别");
      return;
    }
    if (!formData.organizationId) {
      alert("请选择所属党支部");
      return;
    }
    if (!formData.summary) {
      alert("请填写项目简介");
      return;
    }
    if (!formData.leader) {
      alert("请填写课题负责人");
      return;
    }
    await createProject({
      ...formData,
      members: members.filter(Boolean),
      status: "pending_city",
    });
    mutateProjects();
    alert("课题申报提交成功，请等待审核！");
    setIsCreateOpen(false);
    resetForm();
  };

  const getSimpleStatus = (status: ProjectStatus) => {
    const category = getStatusCategory(status);
    if (category === "draft") return { label: "草稿", color: "text-muted-foreground", bgColor: "bg-muted" };
    if (category === "pending") return { label: "待审核", color: "text-amber-700", bgColor: "bg-amber-100" };
    if (category === "rejected") return { label: "已退回", color: "text-red-700", bgColor: "bg-red-100" };
    if (category === "approved") return { label: "已通过", color: "text-emerald-700", bgColor: "bg-emerald-100" };
    return statusConfig[status];
  };

  // 导出Excel功能
  const handleExport = () => {
    // 构建CSV内容
    const headers = ["党支部", "课题名称", "项目简介"];
    const rows = filteredProjects.map((project: Project) => [
      project.organizationName,
      project.title,
      project.summary || "",
    ]);

    // 转换为CSV格式（处理逗号和换行符）
    const escapeCSV = (str: string) => {
      if (str.includes(",") || str.includes("\n") || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row: string[]) => row.map(escapeCSV).join(",")),
    ].join("\n");

    // 添加BOM以支持中文
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `课题列表_${new Date().toLocaleDateString("zh-CN").replace(/\//g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-wrap gap-3 items-center">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索课题名称..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="年份" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover open={isOrgPopoverOpen} onOpenChange={setIsOrgPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-48 justify-between bg-transparent">
                    <span className="truncate">{filterOrgName}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="start">
                  <div className="max-h-64 overflow-y-auto">
                    <div
                      className={cn(
                        "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
                        filterOrg === "all" && "bg-primary/10 text-primary"
                      )}
                      onClick={handleSelectAllOrgs}
                    >
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">全部党支部</span>
                    </div>
                    <div className="my-1 border-t" />
                    {orgTree.map((node) => (
                      <OrgTreeNode
                        key={node.id}
                        node={node}
                        selectedId={filterOrg}
                        onSelect={handleOrgSelect}
                        expandedIds={expandedOrgIds}
                        onToggleExpand={toggleOrgExpand}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="审核状态" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" className="gap-2 bg-transparent" onClick={handleExport}>
                <Download className="h-4 w-4" />
                导出
              </Button>
              <Button className="gap-2" onClick={() => { resetForm(); setIsCreateOpen(true); }}>
                <Plus className="h-4 w-4" />
                新建课题
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">课题列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">序号</TableHead>
                  <TableHead>年份</TableHead>
                  <TableHead>党支部</TableHead>
                  <TableHead className="w-[300px]">课题名称</TableHead>
                  <TableHead>审核状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      暂无课题数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project: Project, index: number) => {
                    const status = getSimpleStatus(project.status as ProjectStatus);
                    const year = new Date(project.createdAt).getFullYear();
                    return (
                      <TableRow key={project.id}>
                        <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="text-muted-foreground">{year}年</TableCell>
                        <TableCell>{project.organizationName}</TableCell>
                        <TableCell className="font-medium">
                          {project.title}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${status.color} ${status.bgColor}`}
                          >
                            {status.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(project.createdAt).toLocaleDateString("zh-CN")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* 草稿或已退回状态：可编辑 */}
                            {(project.status === "draft" || project.status === "rejected_by_admin") && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="gap-1"
                                asChild
                              >
                                <Link href={`/projects/apply/${project.id}`}>
                                  <Edit className="h-4 w-4" />
                                  编辑
                                </Link>
                              </Button>
                            )}
                            {/* 待审核状态：审核通过/退回 */}
                            {project.status === "pending_city" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1 text-green-600 hover:text-green-700"
                                  onClick={() => handleApprove(project)}
                                >
                                  <Check className="h-4 w-4" />
                                  通过
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1 text-orange-600 hover:text-orange-700"
                                  onClick={() => handleReject(project)}
                                >
                                  <RotateCcw className="h-4 w-4" />
                                  退回
                                </Button>
                              </>
                            )}
                            {/* 已通过/进行中/待审核的课题：可查看 */}
                            {(project.status === "approved" || project.status === "in_progress" || project.status === "pending_city") && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="gap-1"
                                asChild
                              >
                                <Link href={`/projects/apply/${project.id}`}>
                                  <Eye className="h-4 w-4" />
                                  查看
                                </Link>
                              </Button>
                            )}
                            {/* 已通过/进行中的课题：可退回 */}
                            {(project.status === "approved" || project.status === "in_progress") && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 text-orange-600 hover:text-orange-700"
                                onClick={() => handleReject(project)}
                              >
                                <RotateCcw className="h-4 w-4" />
                                退回
                              </Button>
                            )}
                            {/* 草稿状态可以删除 */}
                            {project.status === "draft" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(project)}
                              >
                                <Trash2 className="h-4 w-4" />
                                删除
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>共 {filteredProjects.length} 条记录</span>
          </div>
        </CardContent>
      </Card>

      {/* Create Project Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新建课题</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground border-b pb-2">课题基本信息</h4>

              <div className="space-y-2">
                <Label htmlFor="title">课题名称 <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  placeholder="请输入课题名称（不超过50字）"
                  maxLength={50}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">课题类别 <span className="text-destructive">*</span></Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="请选择课题类别" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectCategories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>所属党支部 <span className="text-destructive">*</span></Label>
                <Popover open={isFormOrgPopoverOpen} onOpenChange={setIsFormOrgPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-transparent"
                    >
                      <span className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {formData.organizationName || "请选择党支部"}
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0" align="start">
                    <p className="px-2 py-1.5 text-xs text-muted-foreground border-b">
                      请选择具体党支部（机关/销售/专卖/配送/海宁下属支部）
                    </p>
                    <div className="p-2 max-h-64 overflow-y-auto">
                      {orgTree.map((node) => (
                        <OrgTreeNode
                          key={node.id}
                          node={node}
                          selectedId={formData.organizationId}
                          onSelect={handleFormOrgSelect}
                          expandedIds={formExpandedOrgIds}
                          onToggleExpand={toggleFormOrgExpand}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">项目简介 <span className="text-destructive">*</span></Label>
                <Textarea
                  id="summary"
                  placeholder="请填写课题的项目简介，包括研究背景、主要内容、目标、计划及推进情况等"
                  rows={8}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                />
              </div>
            </div>

            {/* Team Info */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground border-b pb-2">团队信息</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="leader">课题负责人 <span className="text-destructive">*</span></Label>
                  <Input 
                    id="leader" 
                    placeholder="请输入负责人姓名" 
                    value={formData.leader}
                    onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">联系电话 <span className="text-destructive">*</span></Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="请输入联系电话" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>课题成员</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMember}
                    className="gap-1 bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    添加成员
                  </Button>
                </div>
                <div className="space-y-2">
                  {members.map((member, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`成员 ${index + 1} 姓名`}
                        value={member}
                        onChange={(e) => updateMember(index, e.target.value)}
                      />
                      {members.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMember(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground border-b pb-2">相关附件</h4>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  点击或拖拽文件到此处上传
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  支持 Word、PDF、Excel、图片等格式，单个文件不超过10MB
                </p>
              </div>
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{file}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() => {
                  resetForm();
                  setIsCreateOpen(false);
                }}
              >
                取消
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent" onClick={handleSaveDraft}>
                <Save className="h-4 w-4" />
                保存草稿
              </Button>
              <Button className="gap-2" onClick={handleSubmit}>
                <Send className="h-4 w-4" />
                提交申报
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除课题「{selectedProject?.title}」吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (selectedProject) {
                  await deleteProject(selectedProject.id);
                  mutateProjects();
                }
                setIsDeleteOpen(false);
                setSelectedProject(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
