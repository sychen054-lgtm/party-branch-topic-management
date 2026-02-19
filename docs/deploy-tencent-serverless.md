# 方案一：腾讯云 Serverless 应用中心部署指南

将「党支部课题管理平台」部署到腾讯云 Serverless，获得可分享的访问链接。适合不想自己管服务器、希望快速上线的场景。

---

## 一、前置准备

### 1. 腾讯云账号

- 打开 [腾讯云官网](https://cloud.tencent.com) 注册/登录。
- 完成 **实名认证**（未实名无法创建资源）。

### 2. 代码仓库（二选一）

任选一种方式，让 Serverless 能拉取到你的代码：

| 方式 | 说明 |
|------|------|
| **GitHub / Gitee** | 把本项目 push 到仓库，在控制台里绑定并选择该仓库。 |
| **腾讯云 CODING** | 在 [CODING](https://coding.net) 创建项目并推送代码，控制台可直接选「CODING 仓库」。 |

本地若尚未推送到远程，示例（GitHub）：

```bash
cd d:\桌面\party-branch-topic-management
git remote add origin https://github.com/你的用户名/party-branch-topic-management.git
git add .
git commit -m "init"
git push -u origin main
```

### 3. 环境变量（必填）

项目依赖 Supabase，部署时必须在控制台配置以下环境变量（与本地 `.env.local` 一致）：

| 变量名 | 说明 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL，如 `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名公钥（anon key） |

在 Supabase 控制台：项目 → Settings → API 中可查看这两个值。

---

## 二、控制台部署步骤

### 步骤 1：进入 Serverless 应用中心

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com)。
2. 顶部搜索 **「Serverless」** 或 **「应用中心」**，进入 **Serverless 应用中心**。  
   或直接打开：<https://console.cloud.tencent.com/sls>（若产品名有调整，在「云产品」里找「Serverless 应用中心」或「Web 应用托管」）。

### 步骤 2：新建应用

1. 点击 **「新建应用」** 或 **「创建应用」**。
2. **应用类型** 选择：**Web 应用**（或「网站」）。
3. **框架/模板** 选择：**Next.js**。  
   若列表里没有 Next.js，可选「自定义」或「Node.js」，后续在配置里指定构建与启动命令。

### 步骤 3：选择代码来源

1. 选择 **「从代码仓库拉取」**（不要选「示例代码直接部署」）。
2. 首次使用需 **授权**：
   - 选 **GitHub**：按提示跳转 GitHub 授权腾讯云访问你的仓库。
   - 选 **Gitee / CODING**：按提示完成对应平台的授权。
3. 选择 **仓库**：`你的用户名/party-branch-topic-management`（或你实际仓库名）。
4. **分支**：一般选 `main` 或 `master`。
5. 若有 **构建目录**、**代码根目录** 选项，保持默认（根目录）即可。

### 步骤 4：基础配置

按页面表单填写（不同控制台版本字段名可能略有差异，以实际为准）：

| 配置项 | 建议值 | 说明 |
|--------|--------|------|
| **应用名称** | `party-branch-topic` 或自拟 | 仅用于在控制台区分 |
| **运行环境** | **Node.js 18** 或 **Node.js 20** | 与本地 Node 版本一致更稳妥 |
| **构建命令** | `pnpm install && pnpm run build` | 若未装 pnpm 可改为 `npm install && npm run build` |
| **启动命令** | `pnpm run start` 或 `npm run start` | 即执行 `next start` |
| **端口** | 若可填，写 `3000` | Next 默认 3000，部分平台自动识别 |

### 步骤 5：环境变量

在 **「环境变量」** / **「高级配置」** 里新增：

- `NEXT_PUBLIC_SUPABASE_URL` = 你的 Supabase 项目 URL  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = 你的 Supabase anon key  

务必与本地 `.env.local` 一致，否则前端和中间件无法连接 Supabase。

### 步骤 6：创建并部署

1. 点击 **「完成」** 或 **「创建并部署」**。
2. 等待构建与部署（通常 3～8 分钟，视仓库与网络而定）。
3. 构建日志中若报错，可根据报错信息排查（常见：Node 版本不对、依赖安装失败、缺少环境变量）。

### 步骤 7：获取访问链接

1. 部署状态变为 **「运行中」** 或 **「已部署」** 后，进入该应用 **「详情」**。
2. 在 **「访问路径」**、**「公网访问地址」** 或 **「API 网关」** 一栏中，会看到一条 URL，形如：  
   `https://xxxxx.apigw.tencentcs.com/xxx` 或类似。
3. 复制该链接，在浏览器打开即可访问你的平台；将该链接发给他人即可分享。

---

## 三、本项目注意事项

1. **包管理器**  
   项目使用 `pnpm`。若平台默认只有 `npm`，构建命令改为：  
   `npm install && npm run build`，启动命令：`npm run start`。

2. **API 与 Middleware**  
   当前应用包含 API 路由和 Supabase 中间件，必须用 **Node 运行时** 部署（即本方案），不能使用纯静态托管。

3. **Supabase 跨域/域名**  
   若部署后接口报错或登录异常，到 Supabase 控制台 → Authentication → URL Configuration，在 **Redirect URLs** 或 **Site URL** 中把腾讯云给的访问域名加进去。

4. **自定义域名（可选）**  
   若控制台提供「自定义域名」或「绑定域名」，可绑定自己的域名并配置 HTTPS；绑定后需同样在 Supabase 中加入该域名。

---

## 四、若控制台要求「自定义启动方式」

部分腾讯云 Serverless 模板会要求指定 **自定义启动文件**（如 `scf_bootstrap`）。若创建时未选 Next.js 模板、或文档要求提供启动脚本，可按以下方式处理：

- **方式 A**：在应用配置里直接填 **启动命令**：`pnpm run start` 或 `npx next start -H 0.0.0.0 -p 9000`（端口以控制台要求为准，常见为 9000）。
- **方式 B**：若明确要求项目内有一个可执行入口，可在项目根目录新增 `scf_bootstrap`（仅当控制台文档要求时再添加），并在控制台把「启动命令」指到该文件；具体格式以腾讯云当前文档为准。

优先以控制台里「Next.js 框架」或「Web 应用」的默认配置为准，一般只需填 **构建命令** 和 **启动命令** 即可。

---

## 五、简要检查清单

- [ ] 腾讯云账号已实名  
- [ ] 代码已推到 GitHub / Gitee / CODING  
- [ ] 应用类型：Web 应用，框架：Next.js  
- [ ] 代码来源：从代码仓库拉取，分支正确  
- [ ] 构建命令：`pnpm install && pnpm run build`（或 npm 等价）  
- [ ] 启动命令：`pnpm run start`（或 `npm run start`）  
- [ ] 环境变量：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY` 已填  
- [ ] 部署成功后已复制访问链接，并在 Supabase 中配置了该域名（如需登录/重定向）

按上述步骤操作即可在腾讯云 Serverless 应用中心完成部署，并得到可分享的访问链接。
