"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  FileText,
  Download,
  Upload,
  Check,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface ProcessNode {
  id: string;
  name: string;
  templateFile?: string;
  templateFileName?: string;
  completed: boolean;
  completedDate?: string;
  uploadedFile?: string;
}

interface ProcessStage {
  id: string;
  name: string;
  order: number;
  nodes: ProcessNode[];
}

interface BranchElectionDetailProps {
  electionId: string;
}

const getElectionData = (_id: string) => ({
  id: _id,
  branchName: "海宁专卖党支部",
  termStart: "2023-04-26",
  termEnd: "2026-04-26",
  secretary: "张伟中",
  memberCount: 26,
  committeeCount: 5,
  startDate: "2026-02-19",
  stages: [
    {
      id: "stage-1",
      name: "换届准备",
      order: 1,
      nodes: [
        { id: "node-1-1", name: "成立换届工作小组", completed: true, completedDate: "2026-02-19" },
        {
          id: "node-1-2",
          name: "制定换届工作方案",
          templateFile: "/templates/换届方案.docx",
          templateFileName: "换届工作方案模板.docx",
          completed: false, // 当前节点
        },
        { id: "node-1-3", name: "开展届期届满审核", completed: false },
        {
          id: "node-1-4",
          name: "报上级党委批复同意换届",
          completed: false,
        },
      ],
    },
    {
      id: "stage-2",
      name: "选举筹备",
      order: 2,
      nodes: [
        {
          id: "node-2-1",
          name: "组织委员候选人推荐",
          templateFile: "/templates/候选人推荐表.docx",
          templateFileName: "候选人推荐表模板.docx",
          completed: true,
          completedDate: "2026-01-22",
          uploadedFile: "候选人推荐汇总表.docx",
        },
        {
          id: "node-2-2",
          name: "上级党委审查候选人资格",
          completed: true,
          completedDate: "2026-01-25",
        },
        { id: "node-2-3", name: "公示候选人名单", completed: false },
        {
          id: "node-2-4",
          name: "准备选举材料",
          templateFile: "/templates/选票样式.docx",
          templateFileName: "选票样式模板.docx",
          completed: false,
        },
      ],
    },
    {
      id: "stage-3",
      name: "选举大会",
      order: 3,
      nodes: [
        {
          id: "node-3-1",
          name: "召开党员大会",
          templateFile: "/templates/选举大会议程.docx",
          templateFileName: "选举大会议程模板.docx",
          completed: false,
        },
        { id: "node-3-2", name: "宣布候选人名单", completed: false },
        { id: "node-3-3", name: "投票选举", completed: false },
        { id: "node-3-4", name: "宣布选举结果", completed: false },
      ],
    },
    {
      id: "stage-4",
      name: "报批备案",
      order: 4,
      nodes: [
        {
          id: "node-4-1",
          name: "填写选举结果报告",
          templateFile: "/templates/选举结果报告.docx",
          templateFileName: "选举结果报告模板.docx",
          completed: false,
        },
        { id: "node-4-2", name: "报上级党委审批", completed: false },
        { id: "node-4-3", name: "发文公布新一届委员会", completed: false },
      ],
    },
    {
      id: "stage-5",
      name: "工作交接",
      order: 5,
      nodes: [
        {
          id: "node-5-1",
          name: "办理工作交接手续",
          templateFile: "/templates/交接清单.docx",
          templateFileName: "工作交接清单模板.docx",
          completed: false,
        },
        { id: "node-5-2", name: "移交档案资料", completed: false },
        { id: "node-5-3", name: "新一届委员会首次会议", completed: false },
        { id: "node-5-4", name: "归档换届材料", completed: false },
      ],
    },
  ] as ProcessStage[],
});

export function BranchElectionDetail({ electionId }: BranchElectionDetailProps) {
  const [electionData, setElectionData] = useState(getElectionData(electionId));

  const totalNodes = electionData.stages.reduce((acc, stage) => acc + stage.nodes.length, 0);
  const completedNodes = electionData.stages.reduce(
    (acc, stage) => acc + stage.nodes.filter((n) => n.completed).length,
    0
  );
  const progress = Math.round((completedNodes / totalNodes) * 100);

  let currentStage: ProcessStage | null = null;
  let nextNode: ProcessNode | null = null;
  for (const stage of electionData.stages) {
    const incompleteNode = stage.nodes.find((n) => !n.completed);
    if (incompleteNode) {
      currentStage = stage;
      nextNode = incompleteNode;
      break;
    }
  }

  const handleToggleNode = (stageId: string, nodeId: string) => {
    setElectionData((prev) => ({
      ...prev,
      stages: prev.stages.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              nodes: stage.nodes.map((node) =>
                node.id === nodeId
                  ? {
                      ...node,
                      completed: !node.completed,
                      completedDate: !node.completed
                        ? new Date().toISOString().split("T")[0]
                        : undefined,
                    }
                  : node
              ),
            }
          : stage
      ),
    }));
  };

  const getStageStatus = (stage: ProcessStage) => {
    const allCompleted = stage.nodes.every((n) => n.completed);
    const someCompleted = stage.nodes.some((n) => n.completed);
    if (allCompleted) return "completed";
    if (someCompleted) return "in-progress";
    return "pending";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/branch-election/list">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">
            {electionData.branchName} - 换届流程
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">支部信息</CardTitle>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">整体进度</p>
                <p className="text-lg font-semibold text-primary">{progress}%</p>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-primary/20 flex items-center justify-center">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-medium"
                  style={{
                    background: `conic-gradient(var(--color-primary) ${progress * 3.6}deg, var(--color-muted) 0deg)`,
                  }}
                >
                  <span className="bg-card rounded-full h-8 w-8 flex items-center justify-center">
                    {completedNodes}/{totalNodes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">支部名称</p>
              <p className="text-sm font-medium">{electionData.branchName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">现任书记</p>
              <p className="text-sm font-medium">{electionData.secretary}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">党员人数</p>
              <p className="text-sm font-medium">{electionData.memberCount}人</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">委员人数</p>
              <p className="text-sm font-medium">{electionData.committeeCount}人</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">届期开始</p>
              <p className="text-sm font-medium">{electionData.termStart}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">届期截止</p>
              <p className="text-sm font-medium">{electionData.termEnd}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">换届启动日期</p>
              <p className="text-sm font-medium">{electionData.startDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {nextNode && currentStage && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">下一步待完成</p>
                <p className="text-sm text-muted-foreground">
                  {currentStage.name} - {nextNode.name}
                </p>
              </div>
              {nextNode.templateFile && (
                <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                  <Download className="h-4 w-4" />
                  下载模板
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {electionData.stages.map((stage, stageIndex) => {
          const status = getStageStatus(stage);
          return (
            <Card key={stage.id}>
              <CardHeader className="py-4 px-5">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                      status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : status === "in-progress"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {status === "completed" ? <Check className="h-5 w-5" /> : stageIndex + 1}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{stage.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {stage.nodes.filter((n) => n.completed).length} / {stage.nodes.length} 已完成
                    </p>
                  </div>
                  <Badge
                    variant={
                      status === "completed"
                        ? "secondary"
                        : status === "in-progress"
                          ? "default"
                          : "outline"
                    }
                    className={status === "completed" ? "bg-emerald-100 text-emerald-700" : ""}
                  >
                    {status === "completed"
                      ? "已完成"
                      : status === "in-progress"
                        ? "进行中"
                        : "待开始"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-4 px-5">
                <div className="ml-5 pl-7 border-l-2 border-muted space-y-3">
                  {stage.nodes.map((node, nodeIndex) => (
                    <div
                      key={node.id}
                      className={`relative flex items-start gap-4 p-3 rounded-lg transition-colors ${
                        node.completed ? "bg-muted/30" : "bg-background hover:bg-muted/20"
                      }`}
                    >
                      <div
                        className={`absolute -left-[calc(1.75rem+1px)] top-4 h-3 w-3 rounded-full border-2 ${
                          node.completed
                            ? "bg-emerald-500 border-emerald-500"
                            : "bg-background border-muted-foreground/30"
                        }`}
                      />

                      <Checkbox
                        checked={node.completed}
                        onCheckedChange={() => handleToggleNode(stage.id, node.id)}
                        className="mt-0.5"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              node.completed ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {stageIndex + 1}.{nodeIndex + 1} {node.name}
                          </span>
                        </div>

                        {node.completedDate && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>完成于 {node.completedDate}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 mt-2">
                          {node.templateFile && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1 bg-transparent"
                            >
                              <Download className="h-3 w-3" />
                              {node.templateFileName}
                            </Button>
                          )}
                          {node.uploadedFile ? (
                            <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                              <FileText className="h-3 w-3" />
                              <span>{node.uploadedFile}</span>
                            </div>
                          ) : node.templateFile ? (
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                              <Upload className="h-3 w-3" />
                              上传材料
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
