"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProjects, useOrganizations } from "@/lib/hooks/use-data";
import type { Organization } from "@/lib/types";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Building2,
  Trophy,
  Award,
  Eye,
  Send,
} from "lucide-react";

/** 市局评选结果：评选中、一二三等奖、未获奖（单一展示，不区分状态与奖项） */
const CITY_RESULTS = ["评选中", "一等奖", "二等奖", "三等奖", "未获奖"] as const;
/** 省局评选结果：未推荐、评选中、入选案例集、未入选案例集（单一展示） */
const PROVINCE_RESULTS = ["未推荐", "评选中", "入选案例集", "未入选案例集"] as const;

/** 根据结果文案返回 Badge variant */
function getResultVariant(
  result: string
): "default" | "secondary" | "destructive" | "outline" {
  if (result === "评选中" || result === "未推荐") return "secondary";
  if (result === "未获奖" || result === "未入选案例集") return "outline";
  return "default";
}

// 年份列表
const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

export function SelectionManagement() {
  const { data: projects = [] } = useProjects("concluded");
  const { data: organizations = [] } = useOrganizations();

  // 根节点（嘉兴市烟草专卖局（公司）），子节点按 code 排序与课题管理一致
  const rootOrgs = organizations.filter((o) => !o.parentId);
  const getSortedChildren = (parentId: string) =>
    organizations
      .filter((o) => o.parentId === parentId)
      .sort((a, b) => (a.code || "").localeCompare(b.code || ""));

  const recommendedProjects = projects
    .filter((p: Record<string, unknown>) => p.status === "approved" || p.status === "in_progress" || p.status === "concluded")
    .slice(0, 20)
    .map((p: Record<string, unknown>, index: number) => {
      const citySel = p.citySelection as { level?: string; result?: string } | null | undefined;
      const provSel = p.provinceSelection as { level?: string; result?: string } | null | undefined;
      const hasCity = citySel?.result != null;
      const hasProv = provSel != null;
      const cityResult: string = hasCity
        ? (CITY_RESULTS.includes(citySel!.result! as (typeof CITY_RESULTS)[number]) ? citySel!.result! : "评选中")
        : index < 6 ? (index === 0 ? "一等奖" : index === 1 ? "二等奖" : "三等奖") : "评选中";
      const provinceResult: string = hasProv
        ? (provSel!.result || "未入选案例集")
        : index === 0 ? "入选案例集" : index === 1 ? "评选中" : index === 2 ? "未入选案例集" : "未推荐";
      return {
        ...p,
        cityResult,
        provinceResult,
        recommendedAt: (p.recommendedAt as string) || new Date(2024, 5, 10 + index).toISOString(),
      };
    });

  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [cityStatusFilter, setCityStatusFilter] = useState<string>("all");
  const [provinceStatusFilter, setProvinceStatusFilter] = useState<string>("all");
  const [selectedOrg, setSelectedOrg] = useState<string>("all");
  const [expandedOrgs, setExpandedOrgs] = useState<string[]>(["org-1", "org-16"]);
  const [orgPopoverOpen, setOrgPopoverOpen] = useState(false);

  const [viewingProject, setViewingProject] = useState<typeof recommendedProjects[0] | null>(null);
  const [recommendingProject, setRecommendingProject] = useState<typeof recommendedProjects[0] | null>(null);

  // 获取组织及其所有下级组织的 ID（与课题管理一致）
  const getOrgAndChildrenIds = (orgId: string): string[] => {
    const result = [orgId];
    const children = organizations.filter((o) => o.parentId === orgId);
    for (const child of children) {
      result.push(...getOrgAndChildrenIds(child.id));
    }
    return result;
  };

  const getSelectedOrgName = () => {
    if (selectedOrg === "all") return "全部党支部";
    const org = organizations.find((o) => o.id === selectedOrg);
    return org?.name ?? "全部党支部";
  };

  // 切换组织展开/收起
  const toggleOrgExpand = (orgId: string) => {
    setExpandedOrgs((prev) =>
      prev.includes(orgId) ? prev.filter((id) => id !== orgId) : [...prev, orgId]
    );
  };

  // 渲染组织树（嘉兴/海宁结构，子节点按 code 排序）
  const renderOrgTree = (orgs: Organization[], level = 0) => {
    return orgs.map((org) => {
      const children = getSortedChildren(org.id);
      const hasChildren = children.length > 0;
      const isExpanded = expandedOrgs.includes(org.id);
      return (
        <div key={org.id}>
          <div
            className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer hover:bg-muted ${
              selectedOrg === org.id ? "bg-primary/10 text-primary" : ""
            }`}
            style={{ paddingLeft: `${level * 16 + 8}px` }}
            onClick={() => {
              if (hasChildren) toggleOrgExpand(org.id);
              setSelectedOrg(org.id);
              if (!hasChildren) setOrgPopoverOpen(false);
            }}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )
            ) : (
              <div className="w-4" />
            )}
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{org.name}</span>
          </div>
          {hasChildren && isExpanded && renderOrgTree(children, level + 1)}
        </div>
      );
    });
  };

  // 筛选课题
  const filteredProjects = recommendedProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.organizationName.toLowerCase().includes(searchTerm.toLowerCase());

    const projectYear = new Date(project.recommendedAt).getFullYear().toString();
    const matchesYear = yearFilter === "all" || projectYear === yearFilter;

    const matchesCityStatus = cityStatusFilter === "all" || project.cityResult === cityStatusFilter;
    const matchesProvinceStatus = provinceStatusFilter === "all" || project.provinceResult === provinceStatusFilter;

    let matchesOrg = true;
    if (selectedOrg !== "all") {
      const orgIds = getOrgAndChildrenIds(selectedOrg);
      matchesOrg = orgIds.includes(project.organizationId);
    }

    return matchesSearch && matchesYear && matchesCityStatus && matchesProvinceStatus && matchesOrg;
  });

  // 推荐至省局
  const handleRecommendToProvince = () => {
    alert(`已将课题"${recommendingProject?.title}"推荐至省局评选`);
    setRecommendingProject(null);
  };

  // 统计数据：市局获奖 = 一二三等奖，省局入选 = 入选案例集
  const stats = {
    total: recommendedProjects.length,
    cityAwarded: recommendedProjects.filter((p) => ["一等奖", "二等奖", "三等奖"].includes(p.cityResult)).length,
    provinceRecommended: recommendedProjects.filter((p) => p.provinceResult !== "未推荐").length,
    provinceAwarded: recommendedProjects.filter((p) => p.provinceResult === "入选案例集").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">推荐课题总数</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-emerald-100 p-3">
              <Award className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.cityAwarded}</p>
              <p className="text-sm text-muted-foreground">市局获奖</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-amber-100 p-3">
              <Send className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.provinceRecommended}</p>
              <p className="text-sm text-muted-foreground">推荐省局</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-rose-100 p-3">
              <Award className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.provinceAwarded}</p>
              <p className="text-sm text-muted-foreground">省局入选案例集</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索课题名称或党支部..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Year Filter */}
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="年份" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部年份</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}年
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Organization Tree */}
            <Popover open={orgPopoverOpen} onOpenChange={setOrgPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-40 justify-between bg-transparent">
                  <span className="truncate">{getSelectedOrgName()}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="start">
                <div
                  className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer hover:bg-muted ${
                    selectedOrg === "all" ? "bg-primary/10 text-primary" : ""
                  }`}
                  onClick={() => {
                    setSelectedOrg("all");
                    setOrgPopoverOpen(false);
                  }}
                >
                  <div className="w-4" />
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">全部党支部</span>
                </div>
                {renderOrgTree(rootOrgs)}
              </PopoverContent>
            </Popover>

            {/* 市局评选：评选中、一二三等奖、未获奖 */}
            <Select value={cityStatusFilter} onValueChange={setCityStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="市局评选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">市局-全部</SelectItem>
                {CITY_RESULTS.map((r) => (
                  <SelectItem key={r} value={r}>市局-{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 省局评选：未推荐、评选中、入选案例集、未入选案例集 */}
            <Select value={provinceStatusFilter} onValueChange={setProvinceStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="省局评选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">省局-全部</SelectItem>
                {PROVINCE_RESULTS.map((r) => (
                  <SelectItem key={r} value={r}>省局-{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Project List Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">评选课题列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">序号</TableHead>
                <TableHead className="w-20">年份</TableHead>
                <TableHead className="w-28">党支部</TableHead>
                <TableHead>课题名称</TableHead>
                <TableHead className="w-32">市局评选</TableHead>
                <TableHead className="w-32">省局评选</TableHead>
                <TableHead className="w-28">推荐时间</TableHead>
                <TableHead className="text-right w-36">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project, index) => {
                const canRecommendToProvince =
                  ["一等奖", "二等奖", "三等奖"].includes(project.cityResult) && project.provinceResult === "未推荐";
                return (
                  <TableRow key={project.id}>
                    <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      {new Date(project.recommendedAt).getFullYear()}
                    </TableCell>
                    <TableCell>{project.organizationName}</TableCell>
                    <TableCell className="font-medium">
                      <span className="line-clamp-1">{project.title}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getResultVariant(project.cityResult)}>
                        {project.cityResult}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getResultVariant(project.provinceResult)}>
                        {project.provinceResult}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(project.recommendedAt).toLocaleDateString("zh-CN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingProject(project)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          详情
                        </Button>
                        {canRecommendToProvince && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRecommendingProject(project)}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            推荐省局
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    没有找到符合条件的评选课题
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Detail Dialog */}
      <Dialog open={!!viewingProject} onOpenChange={() => setViewingProject(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>课题详情</DialogTitle>
          </DialogHeader>
          {viewingProject && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">课题名称</p>
                <p className="font-medium">{viewingProject.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">党支部</p>
                  <p className="font-medium">{viewingProject.organizationName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">负责人</p>
                  <p className="font-medium">{viewingProject.leader}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">市局评选</p>
                  <Badge variant={getResultVariant(viewingProject.cityResult)}>
                    {viewingProject.cityResult}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">省局评选</p>
                  <Badge variant={getResultVariant(viewingProject.provinceResult)}>
                    {viewingProject.provinceResult}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">项目简介</p>
                <p className="text-sm bg-muted/30 rounded-lg p-3">{viewingProject.summary}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Recommend to Province Dialog */}
      <Dialog open={!!recommendingProject} onOpenChange={() => setRecommendingProject(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>推荐至省局评选</DialogTitle>
          </DialogHeader>
          {recommendingProject && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">课题名称</p>
                <p className="font-medium">{recommendingProject.title}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-1">市局评选</p>
                <p className="font-medium text-primary">{recommendingProject.cityResult}</p>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm font-medium text-primary mb-2">确认推荐至省局评选</p>
                <p className="text-sm text-muted-foreground">
                  该课题市局评选为{recommendingProject.cityResult}，确认后将被推荐参加省局评选（入选案例集）。
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setRecommendingProject(null)}
                  className="bg-transparent"
                >
                  取消
                </Button>
                <Button className="gap-2" onClick={handleRecommendToProvince}>
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
