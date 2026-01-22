# Intent: 初始化仓库：移除 repo-a/repo-b 占位符，建立 src/chrome-mcp

> **状态**: DRAFT (草稿)
> **创建日期**: 2026-01-22
> **对应 Issue**: N/A

## 1. 背景与动机 (Context & Motivation)

* **现状**: `docmap.yaml` 仍指向 `repo-a/repo-b`；`src/` 目录为空且被 `.gitignore` 全部忽略。
* **问题**: 项目缺少真实实现入口，文档与目录结构不一致，后续开发无法落地。
* **价值**: 将仓库从模板状态推进到可开发的最小可运行形态，并明确唯一 repo 入口 `chrome-mcp`。

## 2. 核心目标 (Goals)

1. [ ] 清理模板占位符（`docmap.yaml` / `.gitignore` / `src/.gitkeep` 等），只保留 `chrome-mcp`。
2. [ ] 在 `src/chrome-mcp/` 建立可运行的最小脚手架（含构建/自测入口）。
3. [ ] 形成与实现一致的 SOT 更新稿（在 ARCHIVE 阶段合并）。

## 3. 非目标 (Non-Goals / Out of Scope)

* [ ] 不实现完整的 Chrome 交互 / MCP 功能细节
* [ ] 不引入复杂 CI/CD、发布流程或多包 monorepo
* [ ] 不做大规模重构（当前无存量业务代码）

## 4. 用户故事 (User Stories)

* **As a** 项目开发者
* **I want to** 在 `src/chrome-mcp` 有一个可运行/可测试的最小代码库
* **So that** 后续功能开发有明确入口且文档与代码一致

## 5. 风险评估 (Risks)

* 技术栈选择（TypeScript/JavaScript/Python）会影响依赖与测试方式，需要尽早确认。

