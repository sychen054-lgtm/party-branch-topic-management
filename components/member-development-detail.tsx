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

interface MemberDevelopmentDetailProps {
  memberId: string;
}

// 模拟的个人流程数据（与列表测试数据一致：董科研）
const getMemberData = (_id: string) => ({
  id: _id,
  name: "董科研",
  gender: "男",
  birthDate: "1995-03-03",
  department: "办公室",
  position: "安全管理员",
  education: "本科",
  applyDate: "2025-12-08",
  introducer: "贺周希、陈仕玥",
  startDate: "2025-12-08",
  stages: [
    {
      id: "stage-1",
      name: "递交入党申请书",
      order: 1,
      nodes: [
        { id: "node-1-1", name: "提交入党申请书", templateFile: "/templates/申请书模板.docx", templateFileName: "入党申请书模板.docx", completed: true, completedDate: "2025-12-08", uploadedFile: "董科研-入党申请书.docx" },
        { id: "node-1-2", name: "党支部收到申请并登记", completed: true, completedDate: "2025-12-10" },
        { id: "node-1-3", name: "指定培养联系人", completed: true, completedDate: "2025-12-15" },
      ],
    },
    {
      id: "stage-2",
      name: "入党积极分子",
      order: 2,
      nodes: [
        { id: "node-2-1", name: "支部推优", templateFile: "/templates/推优表.docx", templateFileName: "推优表模板.docx", completed: true, completedDate: "2026-01-10", uploadedFile: "董科研-推优表.docx" },
        { id: "node-2-2", name: "支委会研究确定", completed: true, completedDate: "2026-01-18" },
        { id: "node-2-3", name: "报上级党委备案", completed: true, completedDate: "2026-01-25" },
        { id: "node-2-4", name: "培养教育考察", templateFile: "/templates/考察记录.docx", templateFileName: "考察记录模板.docx", completed: false }, // 当前节点
      ],
    },
    {
      id: "stage-3",
      name: "发展对象",
      order: 3,
      nodes: [
        { id: "node-3-1", name: "听取培养人意见", completed: false },
        { id: "node-3-2", name: "支委会讨论同意", completed: false },
        { id: "node-3-3", name: "政治审查", templateFile: "/templates/政审材料.docx", templateFileName: "政审材料模板.docx", completed: false },
        { id: "node-3-4", name: "集中培训", completed: false },
      ],
    },
    {
      id: "stage-4",
      name: "预备党员",
      order: 4,
      nodes: [
        { id: "node-4-1", name: "支部大会讨论", templateFile: "/templates/支部大会决议.docx", templateFileName: "支部大会决议模板.docx", completed: false },
        { id: "node-4-2", name: "上级党委审批", completed: false },
        { id: "node-4-3", name: "入党宣誓", completed: false },
      ],
    },
    {
      id: "stage-5",
      name: "预备党员转正",
      order: 5,
      nodes: [
        { id: "node-5-1", name: "本人提出转正申请", templateFile: "/templates/转正申请书.docx", templateFileName: "转正申请书模板.docx", completed: false },
        { id: "node-5-2", name: "支部大会讨论", completed: false },
        { id: "node-5-3", name: "上级党委审批转正", completed: false },
      ],
    },
  ] as ProcessStage[],
});

export function MemberDevelopmentDetail({ memberId }: MemberDevelopmentDetailProps) {
  const [memberData, setMemberData] = useState(getMemberData(memberId));

  // 计算进度
  const totalNodes = memberData.stages.reduce((acc, stage) => acc + stage.nodes.length, 0);
  const completedNodes = memberData.stages.reduce(
    (acc, stage) => acc + stage.nodes.filter((n) => n.completed).length,
    0
  );
  const progress = Math.round((completedNodes / totalNodes) * 100);

  // 找到当前阶段和下一个待完成节点
  let currentStage: ProcessStage | null = null;
  let nextNode: ProcessNode | null = null;
  for (const stage of memberData.stages) {
    const incompleteNode = stage.nodes.find((n) => !n.completed);
    if (incompleteNode) {
      currentStage = stage;
      nextNode = incompleteNode;
      break;
    }
  }

  const handleToggleNode = (stageId: string, nodeId: string) => {
    setMemberData((prev) => ({
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/member-development/list">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">
            {memberData.name} - 党员发展流程
          </h1>
        </div>
      </div>

      {/* 个人信息卡片 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">基本信息</CardTitle>
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
              <p className="text-xs text-muted-foreground">姓名</p>
              <p className="text-sm font-medium">{memberData.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">性别</p>
              <p className="text-sm font-medium">{memberData.gender}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">出生日期</p>
              <p className="text-sm font-medium">{memberData.birthDate}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">学历</p>
              <p className="text-sm font-medium">{memberData.education}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">所属部门</p>
              <p className="text-sm font-medium">{memberData.department}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">岗位</p>
              <p className="text-sm font-medium">{memberData.position}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">申请入党日期</p>
              <p className="text-sm font-medium">{memberData.applyDate}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">入党介绍人</p>
              <p className="text-sm font-medium">{memberData.introducer}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Task Reminder */}
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

      {/* Stages Timeline */}
      <div className="space-y-4">
        {memberData.stages.map((stage, stageIndex) => {
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
                    className={
                      status === "completed" ? "bg-emerald-100 text-emerald-700" : ""
                    }
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
                      {/* Timeline dot */}
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
                        
                        {/* Template & Upload */}
                        <div className="flex items-center gap-3 mt-2">
                          {node.templateFile && (
                            <Button variant="outline" size="sm" className="h-7 text-xs gap-1 bg-transparent">
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
