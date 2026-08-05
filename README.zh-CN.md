# ppt-board

[English](./README.md) | [简体中文](./README.zh-CN.md)

基于 `vue-canvas-core` 构建的强大数据驱动 Canvas 演示和编辑宿主程序。
内置集成了 **NaiveUI** 组件库上下文，作为统一的编辑器主程序和插件生态的开发基座。

## 特性

- **内置 UI 上下文** - 使用 NaiveUI 的各类 Provider 自动包裹核心画布，让插件开发可直接调用全局 UI 提示。
- **插件系统基座** - 作为未来所有编辑器插件开发的主程序入口，配套 `create-vue-canvas-plugin` 脚手架提供极速开发体验。
- **统一 API 导出** - 完整导出 `@iss-ai/vue-canvas-core` 的所有组件、类型定义和组合式 API，对外屏蔽底层依赖。
- **无限画布与幻灯片** - 支持自适应自由画布与固定比例幻灯片模式。
- **富媒体与动画** - 内置音效及时间轴动画编排系统。
- **Jest** - 预配置的测试框架，包含 jsdom 支持。
- **Babel** - 集成 Babel 以支持降级编译及更好的浏览器兼容性。
- **PostCSS & Less** - 支持在包中直接编写样式。
- **ESLint & Prettier** - 集成 ESLint、Husky 与 lint-staged 以实现提交前的代码语法检查与格式化。
- **Commitlint** - 强制校验 Commit 遵循 Conventional Commits 规范。
- **自动化发版 (release-it)** - 一键化自动完成版本号升级、打 Git Tag、生成 Changelog 以及 npm 发布。

## 开始使用

首先安装依赖：

```bash
pnpm install
```

## 可用脚本

在项目目录中，你可以运行以下命令：

- `pnpm dev`: 启动本地 Vite 游乐场 (Playground)，用于编辑器的实时开发与 UI 预览。
- `pnpm build:demo`: 将 Playground 打包为一个独立的生产环境 Web 应用（输出到 `playground/dist`），可以直接部署到 GitHub Pages、Vercel 等平台。
- `pnpm clean`: 清理 `lib` 输出目录。
- `pnpm build`: 使用 Rollup 编译并打包用于生产环境的代码。生成的产物会存放在 `lib` 目录。
- `pnpm test`: 运行 Jest 单元测试。
- `pnpm coveralls`: 运行测试并收集测试覆盖率数据。
- `pnpm tsc`: 运行 TypeScript 类型检查（不进行打包）。
- `pnpm lint`: 运行 ESLint 检查代码规范。
- `pnpm release`: 启动 `release-it` 交互式命令行，完成版本升级、打 Tag 和发包流程。

## 开发指南

### 提交规范 (Commit Convention)

本项目使用 `commitlint` 强制推行 [Conventional Commits (约定式提交)](https://www.conventionalcommits.org/zh-hans/) 规范。
在提交代码时，你的 Commit Message 必须以特定的前缀开头，并且冒号后面需要有一个空格。常用的前缀包括：

- `feat: 新增某某功能` (新功能)
- `fix: 修复某某bug` (Bug 修复)
- `chore: 更新相关配置` (构建过程或辅助工具的变动)
- `docs: 更新文档说明` (文档修改)

如果不遵循此格式，Git Hook 会拦截并拒绝你的提交。

## 使用指南

1. 开发编辑器插件时，请统一将 `@iss-ai/ppt-board` 作为唯一依赖。
2. 推荐使用脚手架快速创建插件工程：`npx create-vue-canvas-plugin my-plugin`。
3. 运行 `pnpm dev` 启动 `playground/` 目录下的 Vite 服务，在浏览器中实时预览编辑器功能。
4. 通过在 Playground 中测试 JSON 数据或引入你编写的插件进行功能调试。
4. 运行 `pnpm build:demo` 将你的演示环境打包为一个纯静态的可部署 Web 应用。
5. 在 `__tests__/` 目录下编写组件的单元测试，并使用 `pnpm test` 运行它们。
6. 运行 `pnpm build` 进行编译，将 NPM 包产物输出到 `lib` 目录准备发布。

## 包发布指南

本项目已默认配置将包发布到官方 NPM 仓库。如果你的本地环境使用了淘宝镜像或 CNPM 等只读镜像源，在发版前请务必显式登录官方 NPM 账号：

```bash
npm login --registry=https://registry.npmjs.org/
pnpm release
```

## 开源协议

本项目采用 **[GNU Affero General Public License v3.0 (AGPL-3.0)](./LICENSE)** 协议。
