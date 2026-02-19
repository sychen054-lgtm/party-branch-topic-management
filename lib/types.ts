// 课题状态 - 完整生命周期
export type ProjectStatus =
  | "draft" // 草稿
  | "pending_county" // 待县级审核
  | "county_rejected" // 县级退回
  | "pending_city" // 待市级审核
  | "city_rejected" // 市级退回
  | "pending_province" // 待省级审核
  | "province_rejected" // 省级退回
  | "rejected_by_admin" // 管理员退回
  | "approved" // 已立项
  | "in_progress" // 进行中
  | "pending_conclusion" // 待结题
  | "concluded" // 已结题
  | "city_selection" // 市级评选中
  | "city_selected" // 市级入选
  | "province_selection" // 省级评选中
  | "province_selected" // 省级入选
  | "典型案例" // 典型案例
  | "published"; // 已发布

export const statusConfig: Record<
  ProjectStatus,
  { label: string; color: string; bgColor: string }
> = {
  draft: { label: "草稿", color: "text-muted-foreground", bgColor: "bg-muted" },
  pending_county: {
    label: "待县级审核",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
  county_rejected: {
    label: "县级退回",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  pending_city: {
    label: "待市级审核",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
  city_rejected: {
    label: "市级退回",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  pending_province: {
    label: "待省级审核",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
  province_rejected: {
    label: "省级退回",
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  rejected_by_admin: {
    label: "已退回",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
  },
  approved: {
    label: "已立项",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
  },
  in_progress: {
    label: "进行中",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  pending_conclusion: {
    label: "待结题",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
  concluded: {
    label: "已结题",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
  },
  city_selection: {
    label: "市级评选中",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
  },
  city_selected: {
    label: "市级入选",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
  },
  province_selection: {
    label: "省级评选中",
    color: "text-rose-700",
    bgColor: "bg-rose-100",
  },
  province_selected: {
    label: "省级入选",
    color: "text-rose-700",
    bgColor: "bg-rose-100",
  },
  典型案例: {
    label: "典型案例",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  published: {
    label: "已发布",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
  },
};

// 组织层级
export type OrgLevel = "province" | "city" | "county" | "branch";

export const orgLevelConfig: Record<OrgLevel, { label: string }> = {
  province: { label: "省级" },
  city: { label: "市级" },
  county: { label: "县级" },
  branch: { label: "支部" },
};

// 组织机构
export interface Organization {
  id: string;
  name: string;
  level: OrgLevel;
  parentId: string | null;
  code: string; // 行政区划代码
}

// 通知
export interface Notice {
  id: string;
  title: string;
  content: string;
  batchName: string; // 批次名称，如"2024年度第一批"
  publisherId: string;
  publisherName: string;
  publishTime: string;
  deadline: string; // 申报截止时间
  attachments: Attachment[];
  isTop: boolean; // 是否置顶
  readCount: number;
  totalCount: number;
}

// 课题
export interface Project {
  id: string;
  title: string;
  batchId: string; // 关联的通知批次
  batchName: string;
  category: string; // 课题类型
  /** 项目简介（含描述、目标、计划及推进情况等） */
  summary: string;
  organizationId: string;
  organizationName: string;
  orgLevel: OrgLevel;
  leader: string; // 负责人
  members: string[]; // 成员
  phone: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
  // 审核相关
  auditLogs: AuditLog[];
  // 进展相关
  progressReports: ProgressReport[];
  // 结题相关
  conclusionReport?: ConclusionReport;
  // 评选相关
  scores?: Score[];
  finalScore?: number;
  /** 市局评选结果，如 { level: "市级", result: "一等奖" } */
  citySelection?: { level: string; result: string } | null;
  /** 省局评选结果：是否入选案例集，如 { level: "省级", result: "入选案例集" }（省局不设几等奖） */
  provinceSelection?: { level: string; result: string } | null;
  /** 推荐至省局时间（ISO 或 YYYY-MM-DD） */
  recommendedAt?: string;
}

// 审核日志
export interface AuditLog {
  id: string;
  projectId: string;
  action: "submit" | "approve" | "reject" | "return";
  fromStatus: ProjectStatus;
  toStatus: ProjectStatus;
  operatorId: string;
  operatorName: string;
  orgLevel: OrgLevel;
  comment: string;
  createdAt: string;
}

// 进展报告状态
export type ProgressReportStatus = "draft" | "submitted" | "returned";

export const progressReportStatusConfig: Record<
  ProgressReportStatus,
  { label: string; color: string; bgColor: string }
> = {
  draft: { label: "草稿", color: "text-muted-foreground", bgColor: "bg-muted" },
  submitted: { label: "已提交", color: "text-emerald-700", bgColor: "bg-emerald-100" },
  returned: { label: "已退回", color: "text-amber-700", bgColor: "bg-amber-100" },
};

// 阶段性进展
export interface ProgressReport {
  id: string;
  projectId: string;
  stage: number; // 第几阶段
  title: string;
  content: string;
  achievements: string; // 阶段成果
  issues: string; // 存在问题
  nextPlan: string; // 下阶段计划
  attachments: Attachment[];
  submitterId: string;
  submitterName: string;
  submittedAt: string;
  status: ProgressReportStatus; // 进展报告状态
  returnComment?: string; // 退回原因
}

// 结题报告
export interface ConclusionReport {
  id: string;
  projectId: string;
  summary: string; // 研究总结
  achievements: string; // 主要成果
  innovations: string; // 创新点
  applications: string; // 应用推广情况
  attachments: Attachment[];
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  auditComment?: string;
}

// 评分
export interface Score {
  id: string;
  projectId: string;
  judgeName: string;
  innovation: number; // 创新性 (0-30)
  effectiveness: number; // 实效性 (0-30)
  promotion: number; // 推广性 (0-20)
  documentation: number; // 材料规范性 (0-20)
  total: number;
  comment: string;
  createdAt: string;
}

// 案例
export interface Case {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  content: string;
  highlights: string[]; // 亮点
  tags: string[];
  coverImage?: string;
  attachments: Attachment[];
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  year: number;
}

// 附件
export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

// 统计数据
export interface Statistics {
  totalProjects: number;
  byStatus: Record<ProjectStatus, number>;
  byCategory: Record<string, number>;
  byOrganization: Record<string, number>;
  submissionTrend: { date: string; count: number }[];
  passRate: number;
}
