# Vue 3 + Element Plus + Vuex 前端模板

基于 Vue 3、Vite、Element Plus、Vue Router 和 Vuex 的前端项目模板。

## 技术栈

- **Vue 3** - Composition API
- **Vite** - 构建工具
- **Element Plus** - UI 组件库（中文）
- **Vuex 4** - 状态管理
- **Vue Router 4** - 路由
- **Sass** - 样式

## 项目结构

```
src/
├── layout/          # 布局（侧栏、顶栏）
├── router/          # 路由配置
├── store/           # Vuex
│   └── modules/     # user、app 等模块
├── views/           # 页面
│   ├── login/       # 登录
│   ├── dashboard/   # 首页
│   ├── table/       # 表格示例
│   └── form/        # 表单示例
├── styles/          # 全局样式
├── App.vue
└── main.js
```

## 快速开始

```bash
# 安装依赖
npm install

# 开发
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

## 功能说明

- **登录页** `/login`：表单校验、调用 Vuex 登录
- **布局**：可折叠侧栏、顶栏、用户下拉退出
- **首页** `/dashboard`：统计卡片、欢迎信息（展示 Vuex 中的用户）
- **表格示例** `/table`：Element 表格、分页、操作列
- **表单示例** `/form`：常用表单项、校验、提交/重置

默认账号：`admin` / `123456`（仅前端模拟，未接后端）。
