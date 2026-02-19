"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  FileText,
  Download,
  Upload,
  GripVertical,
  Check,
  X,
} from "lucide-react";

interface ProcessNode {
  id: string;
  name: string;
  description?: string;
  templateFile?: string;
  templateFileName?: string;
}

interface ProcessStage {
  id: string;
  name: string;
  order: number;
  nodes: ProcessNode[];
}

// 默认的支部换届流程模板
const defaultStages: ProcessStage[] = [
  {
    id: "stage-1",
    name: "换届准备",
    order: 1,
    nodes: [
      { id: "node-1-1", name: "成立换届工作小组" },
      { id: "node-1-2", name: "制定换届工作方案", templateFile: "/templates/换届方案.docx", templateFileName: "换届工作方案模板.docx" },
      { id: "node-1-3", name: "开展届期届满审核" },
      { id: "node-1-4", name: "报上级党委批复同意换届" },
    ],
  },
  {
    id: "stage-2",
    name: "选举筹备",
    order: 2,
    nodes: [
      { id: "node-2-1", name: "组织委员候选人推荐", templateFile: "/templates/候选人推荐表.docx", templateFileName: "候选人推荐表模板.docx" },
      { id: "node-2-2", name: "上级党委审查候选人资格" },
      { id: "node-2-3", name: "公示候选人名单" },
      { id: "node-2-4", name: "准备选举材料", templateFile: "/templates/选票样式.docx", templateFileName: "选票样式模板.docx" },
    ],
  },
  {
    id: "stage-3",
    name: "选举大会",
    order: 3,
    nodes: [
      { id: "node-3-1", name: "召开党员大会", templateFile: "/templates/选举大会议程.docx", templateFileName: "选举大会议程模板.docx" },
      { id: "node-3-2", name: "宣布候选人名单" },
      { id: "node-3-3", name: "投票选举" },
      { id: "node-3-4", name: "宣布选举结果" },
    ],
  },
  {
    id: "stage-4",
    name: "报批备案",
    order: 4,
    nodes: [
      { id: "node-4-1", name: "填写选举结果报告", templateFile: "/templates/选举结果报告.docx", templateFileName: "选举结果报告模板.docx" },
      { id: "node-4-2", name: "报上级党委审批" },
      { id: "node-4-3", name: "发文公布新一届委员会" },
    ],
  },
  {
    id: "stage-5",
    name: "工作交接",
    order: 5,
    nodes: [
      { id: "node-5-1", name: "办理工作交接手续", templateFile: "/templates/交接清单.docx", templateFileName: "工作交接清单模板.docx" },
      { id: "node-5-2", name: "移交档案资料" },
      { id: "node-5-3", name: "新一届委员会首次会议" },
      { id: "node-5-4", name: "归档换届材料" },
    ],
  },
];

export function BranchElectionTemplate() {
  const [stages, setStages] = useState<ProcessStage[]>(defaultStages);
  const [expandedStages, setExpandedStages] = useState<string[]>(stages.map((s) => s.id));
  const [editingNode, setEditingNode] = useState<ProcessNode | null>(null);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [addingToStageId, setAddingToStageId] = useState<string | null>(null);
  const [newNodeName, setNewNodeName] = useState("");

  const toggleStage = (stageId: string) => {
    setExpandedStages((prev) =>
      prev.includes(stageId) ? prev.filter((id) => id !== stageId) : [...prev, stageId]
    );
  };

  const handleEditNode = (node: ProcessNode, stageId: string) => {
    setEditingNode({ ...node });
    setEditingStageId(stageId);
  };

  const handleSaveNode = () => {
    if (!editingNode || !editingStageId) return;
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === editingStageId
          ? {
              ...stage,
              nodes: stage.nodes.map((n) => (n.id === editingNode.id ? editingNode : n)),
            }
          : stage
      )
    );
    setEditingNode(null);
    setEditingStageId(null);
  };

  const handleDeleteNode = (nodeId: string, stageId: string) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? { ...stage, nodes: stage.nodes.filter((n) => n.id !== nodeId) }
          : stage
      )
    );
  };

  const handleAddNode = () => {
    if (!addingToStageId || !newNodeName.trim()) return;
    const newNode: ProcessNode = {
      id: `node-${Date.now()}`,
      name: newNodeName.trim(),
    };
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === addingToStageId
          ? { ...stage, nodes: [...stage.nodes, newNode] }
          : stage
      )
    );
    setNewNodeName("");
    setIsAddingNode(false);
    setAddingToStageId(null);
  };

  const openAddNodeDialog = (stageId: string) => {
    setAddingToStageId(stageId);
    setIsAddingNode(true);
    setNewNodeName("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">流程模板</h1>
          <p className="text-sm text-muted-foreground mt-1">
            配置支部换届流程的阶段、节点和关联文档模板
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((stage, stageIndex) => {
          const isExpanded = expandedStages.includes(stage.id);
          return (
            <Card key={stage.id}>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleStage(stage.id)}
                    className="flex items-center gap-3 text-left"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                        {stageIndex + 1}
                      </span>
                      <CardTitle className="text-base">{stage.name}</CardTitle>
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {stage.nodes.length} 个节点
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => openAddNodeDialog(stage.id)}>
                      <Plus className="h-4 w-4 mr-1" />
                      添加节点
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {isExpanded && (
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="ml-10 space-y-2">
                    {stage.nodes.map((node, nodeIndex) => (
                      <div
                        key={node.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-move" />
                          <span className="text-sm text-muted-foreground w-6">
                            {stageIndex + 1}.{nodeIndex + 1}
                          </span>
                          <span className="text-sm font-medium">{node.name}</span>
                          {node.templateFile && (
                            <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                              <FileText className="h-3 w-3" />
                              <span>{node.templateFileName}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditNode(node, stage.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteNode(node.id, stage.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {stage.nodes.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground text-sm">
                        暂无节点，点击上方"添加节点"按钮添加
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Edit Node Dialog */}
      <Dialog open={!!editingNode} onOpenChange={() => setEditingNode(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑节点</DialogTitle>
          </DialogHeader>
          {editingNode && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="node-name">节点名称</Label>
                <Input
                  id="node-name"
                  value={editingNode.name}
                  onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="node-desc">节点描述</Label>
                <Input
                  id="node-desc"
                  placeholder="选填"
                  value={editingNode.description || ""}
                  onChange={(e) =>
                    setEditingNode({ ...editingNode, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>关联文档模板</Label>
                {editingNode.templateFile ? (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm">{editingNode.templateFileName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() =>
                          setEditingNode({
                            ...editingNode,
                            templateFile: undefined,
                            templateFileName: undefined,
                          })
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => {
                      setEditingNode({
                        ...editingNode,
                        templateFile: "/templates/新模板.docx",
                        templateFileName: "新模板.docx",
                      });
                    }}
                  >
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">点击上传文档模板</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingNode(null)}
                  className="bg-transparent"
                >
                  取消
                </Button>
                <Button onClick={handleSaveNode}>
                  <Check className="h-4 w-4 mr-1" />
                  保存
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Node Dialog */}
      <Dialog open={isAddingNode} onOpenChange={() => setIsAddingNode(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>添加节点</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-node-name">节点名称</Label>
              <Input
                id="new-node-name"
                placeholder="请输入节点名称"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsAddingNode(false)}
                className="bg-transparent"
              >
                取消
              </Button>
              <Button onClick={handleAddNode} disabled={!newNodeName.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                添加
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
