"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Eye } from "lucide-react";
import Link from "next/link";
import { useMemberDevelopments } from "@/lib/hooks/use-data";

// 发展人员类型（列表与 API 一致：department 表示党支部）
interface DevelopmentMember {
  id: string;
  name: string;
  department: string;
  currentStage: string;
  currentStageIndex: number;
  currentNode: string;
  progress: number;
  startDate: string;
  lastUpdateDate: string;
  status: "进行中" | "已完成" | "已暂停";
}

// 测试数据（与 seed-member-and-branch.sql 一致，无 API 时展示）
const mockMembers: DevelopmentMember[] = [
  {
    id: "member-dong",
    name: "董科研",
    department: "海宁综合党支部",
    currentStage: "入党积极分子",
    currentStageIndex: 2,
    currentNode: "培养教育考察",
    progress: 35,
    startDate: "2025-12-08",
    lastUpdateDate: "2026-02-19",
    status: "进行中",
  },
];

const stages = [
  "递交入党申请书",
  "入党积极分子",
  "发展对象",
  "预备党员",
  "预备党员转正",
];

export function MemberDevelopmentList() {
  const { data: apiMembers } = useMemberDevelopments();
  const members: DevelopmentMember[] =
    apiMembers && apiMembers.length > 0
      ? apiMembers.map((m: Record<string, unknown>) => ({
          id: String(m.id),
          name: String(m.name ?? ""),
          department: String(m.department ?? ""),
          currentStage: String(m.currentStage ?? ""),
          currentStageIndex: Number(m.currentStageIndex ?? 0),
          currentNode: String(m.currentNode ?? ""),
          progress: Number(m.progress ?? 0),
          startDate: String(m.startDate ?? ""),
          lastUpdateDate: String(m.lastUpdateDate ?? ""),
          status: (m.status as DevelopmentMember["status"]) ?? "进行中",
        }))
      : mockMembers;

  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", department: "" });

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.includes(searchTerm) ||
      member.department.includes(searchTerm);
    const matchesStage =
      stageFilter === "all" || member.currentStage === stageFilter;
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesStage && matchesStatus;
  });

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.department.trim()) return;
    alert(`已创建发展人员：${newMember.name}（${newMember.department}）`);
    setNewMember({ name: "", department: "" });
    setIsAddDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "进行中":
        return <Badge variant="default">进行中</Badge>;
      case "已完成":
        return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">已完成</Badge>;
      case "已暂停":
        return <Badge variant="outline">已暂停</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 统计数据
  const stats = {
    total: members.length,
    inProgress: members.filter((m) => m.status === "进行中").length,
    completed: members.filter((m) => m.status === "已完成").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">流程详情</h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理党员发展人员及其流程进度
          </p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          新建发展人员
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-sm text-muted-foreground">总人数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{stats.inProgress}</div>
            <p className="text-sm text-muted-foreground">进行中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
            <p className="text-sm text-muted-foreground">已完成</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索姓名或党支部..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="阶段筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部阶段</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="进行中">进行中</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
                <SelectItem value="已暂停">已暂停</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">序号</TableHead>
                <TableHead className="w-24">姓名</TableHead>
                <TableHead className="w-28">党支部</TableHead>
                <TableHead className="w-32">当前阶段</TableHead>
                <TableHead>当前节点</TableHead>
                <TableHead className="w-24">进度</TableHead>
                <TableHead className="w-24">状态</TableHead>
                <TableHead className="w-28">最近更新</TableHead>
                <TableHead className="text-right w-24">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member, index) => (
                <TableRow key={member.id}>
                  <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {member.currentStageIndex}
                      </span>
                      <span className="text-sm">{member.currentStage}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.currentNode}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${member.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {member.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(member.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(member.lastUpdateDate).toLocaleDateString("zh-CN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/member-development/detail/${member.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        详情
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    没有找到符合条件的发展人员
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>新建发展人员</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="member-name">姓名</Label>
              <Input
                id="member-name"
                placeholder="请输入姓名"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-dept">党支部</Label>
              <Input
                id="member-dept"
                placeholder="请输入党支部"
                value={newMember.department}
                onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
              />
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                创建后将自动按照流程模板生成完整的发展流程，从"递交入党申请书"阶段开始。
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="bg-transparent">
                取消
              </Button>
              <Button onClick={handleAddMember} disabled={!newMember.name.trim() || !newMember.department.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                创建
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
