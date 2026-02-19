"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useProjects,
  useNotices,
  useMemberDevelopments,
  useBranchElections,
} from "@/lib/hooks/use-data";
import {
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  Bell,
  Users,
  RefreshCw,
  Trophy,
} from "lucide-react";
import Link from "next/link";

/** 党员发展 mock（与流程详情列表一致，API 无数据时工作台用此展示） */
const MOCK_MEMBER_DEVELOPMENTS = [
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

/** 支部换届 mock（与流程详情列表一致，API 无数据时工作台用此展示） */
const MOCK_BRANCH_ELECTIONS = [
  {
    id: "election-haining",
    branchName: "海宁专卖党支部",
    termStart: "2023-04-26",
    termEnd: "2026-04-26",
    currentStage: "换届准备",
    currentStageIndex: 1,
    currentNode: "制定换届工作方案",
    progress: 16,
    startDate: "2026-02-19",
    lastUpdateDate: "2026-02-19",
    status: "进行中",
  },
];

/** 从党员发展列表聚合统计与待办（有 API 用 API，无则用 mock 与下方列表一致） */
function useMemberDevelopmentStats() {
  const { data: apiMembers = [] } = useMemberDevelopments();
  const members = apiMembers?.length > 0 ? apiMembers : MOCK_MEMBER_DEVELOPMENTS;

  const total = members.length;
  const stages: Record<string, number> = {};
  members.forEach((m: { currentStage?: string }) => {
    const s = m.currentStage || "未设置";
    stages[s] = (stages[s] || 0) + 1;
  });
  const inProgress = members.filter(
    (m: { status?: string }) => m.status !== "completed" && m.status !== "已转正"
  ).length;
  const pending = members
    .filter((m: { status?: string }) => m.status !== "completed" && m.status !== "已转正")
    .slice(0, 5)
    .map((m: { id: string; name?: string; currentStage?: string; lastUpdateDate?: string }) => ({
      id: m.id,
      name: m.name ?? "—",
      stage: m.currentStage ?? "—",
      nextTask: "待办",
      dueDate: m.lastUpdateDate ? new Date(m.lastUpdateDate).toLocaleDateString("zh-CN") : "—",
    }));
  return { total, stages, inProgress, pending };
}

/** 从支部换届列表聚合统计与待办（有 API 用 API，无则用 mock 与下方列表一致） */
function useBranchElectionStats() {
  const { data: apiElections = [] } = useBranchElections();
  const elections = apiElections?.length > 0 ? apiElections : MOCK_BRANCH_ELECTIONS;

  const total = elections.length;
  const inProgress = elections.filter(
    (e: { status?: string }) => e.status === "in_progress" || (e.status && e.status !== "completed")
  ).length;
  const completed = elections.filter((e: { status?: string }) => e.status === "completed").length;
  const pending = elections
    .filter((e: { status?: string }) => e.status !== "completed")
    .slice(0, 5)
    .map(
      (e: {
        id: string;
        branchName?: string;
        currentStage?: string;
        lastUpdateDate?: string;
      }) => ({
        id: e.id,
        branch: e.branchName ?? "—",
        stage: e.currentStage ?? "—",
        nextTask: "待办",
        dueDate: e.lastUpdateDate
          ? new Date(e.lastUpdateDate).toLocaleDateString("zh-CN")
          : "—",
      })
    );
  return { total, inProgress, completed, pending };
}



export function DashboardContent() {
  const { data: projects = [] } = useProjects();
  const { data: notices = [] } = useNotices();
  const memberDevelopmentStats = useMemberDevelopmentStats();
  const branchElectionStats = useBranchElectionStats();

  const projectStats = {
    total: projects.length,
    inProgress: projects.filter((p: { status: string }) => p.status === "approved" || p.status === "in_progress").length,
    pending: projects.filter((p: { status: string }) => p.status === "pending_city").length,
    concluded: projects.filter((p: { status: string }) => p.status === "concluded").length,
  };

  const recentProjects = projects.slice(0, 4);
  const recentNotices = notices.slice(0, 3);

  /** 评选动态：从课题状态统计 */
  const citySelecting = projects.filter((p: { status?: string }) => p.status === "city_selection").length;
  const citySelected = projects.filter((p: { status?: string }) => p.status === "city_selected").length;
  const provinceSelected = projects.filter((p: { status?: string }) => p.status === "province_selected").length;

  // 合并所有待办事项（党员发展 + 支部换届，按日期排序）
  const allTodos = [
    ...memberDevelopmentStats.pending.map((item) => ({
      type: "member" as const,
      title: `${item.name} - ${item.nextTask}`,
      subtitle: item.stage,
      dueDate: item.dueDate,
      href: `/member-development/detail/${item.id}`,
    })),
    ...branchElectionStats.pending.map((item) => ({
      type: "election" as const,
      title: `${item.branch} - ${item.nextTask}`,
      subtitle: item.stage,
      dueDate: item.dueDate,
      href: `/branch-election/detail/${item.id}`,
    })),
  ].sort((a, b) => {
    const dA = a.dueDate === "—" ? 0 : new Date(a.dueDate).getTime();
    const dB = b.dueDate === "—" ? 0 : new Date(b.dueDate).getTime();
    return dA - dB;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 三大模块统计卡片 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {/* 书记课题 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                书记课题
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/projects">查看</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
              <div>
                <p className="text-lg font-semibold sm:text-xl">{projectStats.total}</p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">总数</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-primary sm:text-xl">{projectStats.inProgress}</p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">进行中</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-amber-600 sm:text-xl">{projectStats.pending}</p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">待审核</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-emerald-600 sm:text-xl">{projectStats.concluded}</p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">已结题</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 党员发展 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                党员发展
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/member-development/list">查看</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-center shrink-0">
                <p className="text-xl font-semibold sm:text-2xl">{memberDevelopmentStats.total}</p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">发展中</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {Object.entries(memberDevelopmentStats.stages).slice(0, 3).map(([stage, count]) => (
                  <div key={stage} className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${memberDevelopmentStats.total ? (count / memberDevelopmentStats.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-16 truncate">{stage}</span>
                    <span className="text-xs font-medium w-4">{count}</span>
                  </div>
                ))}
                {Object.keys(memberDevelopmentStats.stages).length === 0 && (
                  <p className="text-xs text-muted-foreground">暂无数据</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 支部换届 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="rounded-lg bg-orange-50 p-2">
                  <RefreshCw className="h-4 w-4 text-orange-600" />
                </div>
                支部换届
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/branch-election/list">查看</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
              <div>
                <p className="text-xl font-semibold sm:text-2xl">{branchElectionStats.total}</p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">总任务</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-orange-600 sm:text-2xl">{branchElectionStats.inProgress}</p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">进行中</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-emerald-600 sm:text-2xl">{branchElectionStats.completed}</p>
                <p className="text-[11px] text-muted-foreground sm:text-xs">已完成</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 内容区域 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* 左侧：待办事项 + 我的课题 */}
        <div className="space-y-4 lg:col-span-2 lg:space-y-6">
          {/* 待办事项 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                待办事项
                <Badge variant="secondary" className="ml-1 text-xs">
                  {allTodos.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {allTodos.length > 0 ? (
                <div className="space-y-2">
                  {allTodos.map((todo, index) => (
                    <Link
                      key={index}
                      href={todo.href}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-1.5 ${
                          todo.type === "member" ? "bg-blue-50" : "bg-orange-50"
                        }`}>
                          {todo.type === "member" ? (
                            <Users className="h-3.5 w-3.5 text-blue-600" />
                          ) : (
                            <RefreshCw className="h-3.5 w-3.5 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">
                            {todo.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{todo.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          截止 {todo.dueDate}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-10 w-10 mx-auto mb-2 text-emerald-500" />
                  <p className="text-sm">暂无待办事项</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 我的课题 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                最新课题
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/projects" className="gap-1">
                  查看全部 <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}/progress`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {project.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {project.organizationName}
                      </p>
                    </div>
                    <Badge variant={
                      project.status === "approved" || project.status === "in_progress" 
                        ? "default" 
                        : project.status === "concluded" 
                        ? "secondary" 
                        : "outline"
                    }>
                      {project.status === "approved" || project.status === "in_progress" 
                        ? "进行中" 
                        : project.status === "concluded" 
                        ? "已结题" 
                        : "审核中"}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：通知公告 + 快捷入口 */}
        <div className="space-y-6">
          {/* 通知公告 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Bell className="h-4 w-4" />
                通知公告
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/notices">更多</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {recentNotices.map((notice) => (
                  <Link
                    key={notice.id}
                    href={`/notices/${notice.id}`}
                    className="block group"
                  >
                    <div className="flex items-start gap-2">
                      {notice.isTop && (
                        <span className="shrink-0 mt-0.5 rounded bg-destructive/10 text-destructive px-1.5 py-0.5 text-[10px] font-medium">
                          置顶
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-1 group-hover:text-primary transition-colors">
                          {notice.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notice.publishTime).toLocaleDateString("zh-CN")}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 快捷入口 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">快捷入口</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1.5 bg-transparent" asChild>
                  <Link href="/projects/apply">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-xs">课题申报</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1.5 bg-transparent" asChild>
                  <Link href="/selection">
                    <Trophy className="h-4 w-4 text-amber-600" />
                    <span className="text-xs">评选管理</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1.5 bg-transparent" asChild>
                  <Link href="/member-development/list">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-xs">党员发展</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1.5 bg-transparent" asChild>
                  <Link href="/branch-election/list">
                    <RefreshCw className="h-4 w-4 text-orange-600" />
                    <span className="text-xs">支部换届</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 评选动态 */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-600" />
                评选动态
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                <Link href="/selection">查看</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">市局评选中</span>
                  <span className="font-medium text-primary">{citySelecting}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">市局获奖</span>
                  <span className="font-medium text-amber-600">{citySelected}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">省局获奖</span>
                  <span className="font-medium text-emerald-600">{provinceSelected}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
