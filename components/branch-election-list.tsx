"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { useBranchElections } from "@/lib/hooks/use-data";

interface ElectionTask {
  id: string;
  branchName: string;
  termStart: string;
  termEnd: string;
  currentStage: string;
  currentStageIndex: number;
  currentNode: string;
  progress: number;
  startDate: string;
  lastUpdateDate: string;
  status: "进行中" | "已完成" | "已暂停";
}

// 测试数据（与 seed-member-and-branch.sql 一致，无 API 时展示）
const mockTasks: ElectionTask[] = [
  {
    id: "election-haining",
    branchName: "海宁专卖党支部",
    termStart: "2023-04-26",
    termEnd: "2026-04-26",
    currentStage: "换届准备",
    currentStageIndex: 1,
    currentNode: "制定换届工作方案",
    progress: 16, // 与详情一致：1（换届准备）+2（选举筹备已完成）=3，3/19≈16%
    startDate: "2026-02-19",
    lastUpdateDate: "2026-02-19",
    status: "进行中",
  },
];

const stages = ["换届准备", "选举筹备", "选举大会", "报批备案", "工作交接"];

export function BranchElectionList() {
  const { data: apiTasks } = useBranchElections();
  const tasks: ElectionTask[] =
    apiTasks && apiTasks.length > 0
      ? apiTasks.map((t: Record<string, unknown>) => ({
          id: String(t.id),
          branchName: String(t.branchName ?? ""),
          termStart: String(t.termStart ?? ""),
          termEnd: String(t.termEnd ?? t.termEndDate ?? ""),
          currentStage: String(t.currentStage ?? ""),
          currentStageIndex: Number(t.currentStageIndex ?? 0),
          currentNode: String(t.currentNode ?? ""),
          progress: Number(t.progress ?? 0),
          startDate: String(t.startDate ?? ""),
          lastUpdateDate: String(t.lastUpdateDate ?? ""),
          status: (t.status as ElectionTask["status"]) ?? "进行中",
        }))
      : mockTasks;

  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({ branchName: "", termEnd: "" });

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.branchName.includes(searchTerm);
    const matchesStage = stageFilter === "all" || task.currentStage === stageFilter;
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStage && matchesStatus;
  });

  const handleAddTask = () => {
    if (!newTask.branchName.trim()) return;
    alert(`已创建换届任务：${newTask.branchName}`);
    setNewTask({ branchName: "", termEnd: "" });
    setIsAddDialogOpen(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "进行中":
        return <Badge variant="default">进行中</Badge>;
      case "已完成":
        return (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
            已完成
          </Badge>
        );
      case "已暂停":
        return <Badge variant="outline">已暂停</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === "进行中").length,
    completed: tasks.filter((t) => t.status === "已完成").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">流程详情</h1>
          <p className="text-sm text-muted-foreground mt-1">管理支部换届任务及流程进度</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          新建换届任务
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-sm text-muted-foreground">总任务数</p>
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

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索支部名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-36">
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">序号</TableHead>
                <TableHead className="w-36">支部名称</TableHead>
                <TableHead className="w-28">届期截止</TableHead>
                <TableHead className="w-28">当前阶段</TableHead>
                <TableHead>当前节点</TableHead>
                <TableHead className="w-24">进度</TableHead>
                <TableHead className="w-20">状态</TableHead>
                <TableHead className="w-28">最近更新</TableHead>
                <TableHead className="text-right w-20">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task, index) => (
                <TableRow key={task.id}>
                  <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{task.branchName}</TableCell>
                  <TableCell className="text-muted-foreground">{task.termEnd}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {task.currentStageIndex}
                      </span>
                      <span className="text-sm">{task.currentStage}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{task.currentNode}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{task.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(task.lastUpdateDate).toLocaleDateString("zh-CN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/branch-election/detail/${task.id}`}>
                        <Eye className="h-4 w-4 mr-1" />
                        详情
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    没有找到符合条件的换届任务
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>新建换届任务</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="branch-name">支部名称</Label>
              <Input
                id="branch-name"
                placeholder="请输入支部名称"
                value={newTask.branchName}
                onChange={(e) => setNewTask({ ...newTask, branchName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="term-end">届期截止日期</Label>
              <Input
                id="term-end"
                type="date"
                value={newTask.termEnd}
                onChange={(e) => setNewTask({ ...newTask, termEnd: e.target.value })}
              />
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                创建后将自动按照流程模板生成完整的换届流程，从"换届准备"阶段开始。
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="bg-transparent"
              >
                取消
              </Button>
              <Button onClick={handleAddTask} disabled={!newTask.branchName.trim()}>
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
