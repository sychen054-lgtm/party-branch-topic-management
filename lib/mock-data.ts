import type {
  Organization,
  Project,
  Notice,
} from "./types";

// 用户数据
export const users: { id: string; name?: string }[] = [];

// 组织架构数据
export const organizations: Organization[] = [
  // 嘉兴市烟草专卖局（公司）（顶级单位）
  { id: "org-1", name: "嘉兴市烟草专卖局（公司）", level: "city", parentId: null, code: "330400" },
  // 嘉兴市局直属党支部
  { id: "org-2", name: "机关第一党支部", level: "branch", parentId: "org-1", code: "33040001" },
  { id: "org-3", name: "机关第二党支部", level: "branch", parentId: "org-1", code: "33040002" },
  { id: "org-4", name: "机关第三党支部", level: "branch", parentId: "org-1", code: "33040003" },
  { id: "org-5", name: "机关第四党支部", level: "branch", parentId: "org-1", code: "33040004" },
  { id: "org-6", name: "机关第五党支部", level: "branch", parentId: "org-1", code: "33040005" },
  { id: "org-7", name: "机关第六党支部", level: "branch", parentId: "org-1", code: "33040006" },
  { id: "org-8", name: "机关第七党支部", level: "branch", parentId: "org-1", code: "33040007" },
  { id: "org-9", name: "机关第八党支部", level: "branch", parentId: "org-1", code: "33040008" },
  { id: "org-10", name: "销售管理党支部", level: "branch", parentId: "org-1", code: "33040009" },
  { id: "org-11", name: "专卖管理党支部", level: "branch", parentId: "org-1", code: "33040010" },
  { id: "org-12", name: "配送管理党支部", level: "branch", parentId: "org-1", code: "33040011" },
  // 海宁市烟草专卖局（分公司）- 嘉兴下属单位
  { id: "org-16", name: "海宁市烟草专卖局（分公司）", level: "county", parentId: "org-1", code: "330481" },
  // 海宁分公司下属党支部
  { id: "org-13", name: "海宁营销党支部", level: "branch", parentId: "org-16", code: "33048101" },
  { id: "org-14", name: "海宁综合党支部", level: "branch", parentId: "org-16", code: "33048102" },
  { id: "org-15", name: "海宁专卖党支部", level: "branch", parentId: "org-16", code: "33048103" },
];

// 通知公告数据
export const notices: Notice[] = [
  {
    id: "notice-1",
    title: "关于召开全市系统党支部领题攻坚项目成果晾晒会的通知",
    content: `
全市系统各基层党组织：
   为充分发挥"百名书记破百题"的示范带动作用，以榜样力量引导支部书记积极投身高质量发展和现代化建设，拟组织召开全市系统党支部领题攻坚项目成果晾晒会，现将有关事项通知如下：

   一、会议时间及地点
       时间：10月10日星期五（暂定）
       地点：市局（公司）辅楼二楼会议室

   二、会议内容
      （一）项目汇报；
      （二）专家点评；
      （三）领导讲话。

   三、参会人员
       市本级机关党委委员，各党支部书记，各党支部党员代表（专卖、销售、配送党支部各2人，其他党支部各1人）；各县级局党总支（党支部）书记，党员代表各2人。`,
    batchName: "2025年度",
    publisherId: "org-party",
    publisherName: "市局机关党委、党建工作处",
    publishTime: "2025-08-26T09:00:00Z",
    deadline: "2025-10-10T23:59:59Z",
    attachments: [],
    isTop: false,
    readCount: 24,
    totalCount: 24,
  },
];

// 课题数据
export const projects: Project[] = [
  {
    id: "proj-1",
    title: `党建赋能户外劳动者驿站"四维效能跃迁"`,
    batchId: "batch-2025",
    batchName: "2025年度",
    summary: `以党建为引领，聚焦户外劳动者驿站设施、服务、管理、反馈四大痛点推进提升。设施上，调研需求后增设驿站设备，贴近实际需要；服务上，联动市县资源，以示范站点为标杆，开展理发、普法等特色活动，深化党团共建；管理上，成立联络小组，明确责任、公示服务信息；反馈上，通过数智渠道，建立"微心愿墙"二维码和微信群实现诉求"掌上办"。目前驿站服务能力显著提升，诉求解决率100%，形成良性服务循环。`,
    category: "融合发展类",
    organizationId: "org-9",
    organizationName: "机关第八党支部",
    orgLevel: "branch",
    leader: "于起明",
    members: [],
    phone: "",
    status: "in_progress",
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-09-01T10:00:00Z",
    attachments: [],
    auditLogs: [],
    progressReports: [],
  },
  {
    id: "proj-2",
    title: "党建领航下合同履约风险管理的数智化探索与应用",
    batchId: "batch-2025",
    batchName: "2025年度",
    summary: `利用宜搭构建了"合同履约提示助手"。经办人将合同中的付款时间等关键履约节点导入，到达预设时间节点，系统将自动触发提醒，有效防范因遗忘或疏忽导致的账款拖欠等风险。
构建了"采购全流程数据看板"，将合同履行状态通过直观、可视的图表集中展示，相关人员可快速掌握整体执行情况，实现对执行进度的全局把控与管理。合同审核时长缩短23%。业务流程优化减少了20%的重复工作环节。项目获软著，并推进持续优化与全省推广。`,
    category: "融合发展类",
    organizationId: "org-14",
    organizationName: "海宁综合党支部",
    orgLevel: "branch",
    leader: "蒋晓棠",
    members: [],
    phone: "",
    status: "in_progress",
    createdAt: "2025-03-15T08:00:00Z",
    updatedAt: "2025-09-01T10:00:00Z",
    attachments: [],
    auditLogs: [],
    progressReports: [],
  },
  {
    id: "proj-3",
    title: "优化终端物料发放 助推香溢红色驿站精准管理",
    batchId: "batch-2024",
    batchName: "2024年度",
    summary: `通过对香溢红色驿站物料使用的精准管理，深化党业融合，扩大香溢红色驿站受众基数，将零售户主动纳入到烟草高质量发展部署中。具体通过开发物料发放流程引擎、整合分类物料发放数据、完善项目数据库、梳理客户名单、覆盖零售户，以规范香溢红色驿站物料发放使用，凸显红色窗口作用。`,
    category: "融合发展类",
    organizationId: "org-13",
    organizationName: "海宁营销党支部",
    orgLevel: "branch",
    leader: "李杰",
    members: [],
    phone: "",
    status: "concluded",
    createdAt: "2024-06-01T08:00:00Z",
    updatedAt: "2025-03-21T10:00:00Z",
    attachments: [],
    auditLogs: [],
    progressReports: [],
    citySelection: { level: "市级", result: "一等奖" },
    provinceSelection: { level: "省级", result: "入选案例集" },
    recommendedAt: "2025-03-21T00:00:00Z",
  },
];

// 课题类别
export const projectCategories = [
  { id: "cat-1", name: "组织建设类" },
  { id: "cat-2", name: "党员教育类" },
  { id: "cat-3", name: "服务群众类" },
  { id: "cat-4", name: "融合发展类" },
];

// 案例集数据
export const cases = [
  {
    year: 2025,
    title: "2025年度党建课题案例集",
    projectCount: 8,
    coverImage: null,
  },
];

// 统计数据
export const statistics = {
  totalProjects: projects.length,
  inProgress: projects.filter(p => p.status === "in_progress").length,
  concluded: projects.filter(p => p.status === "concluded").length,
  pendingReview: projects.filter(p => p.status === "pending_city").length,
  approved: projects.filter(p => p.status === "approved").length,
  draft: projects.filter(p => p.status === "draft").length,
  totalOrganizations: organizations.length,
  memberDevelopment: {
    total: 1,
    inProgress: 1,
    completed: 0,
  },
  branchElection: {
    total: 1,
    inProgress: 1,
    completed: 0,
  },
};
