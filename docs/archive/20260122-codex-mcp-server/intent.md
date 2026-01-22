# Intent: 将 chrome-mcp 实现为 Codex 可用的 MCP Server（stdio）

> **状态**: DRAFT (草稿)
> **创建日期**: 2026-01-22
> **对应 Issue**: N/A

## 1. 背景与动机 (Context & Motivation)

* **现状**: `src/chrome-mcp` 仅有最小 CLI + 自测脚手架，尚未实现 MCP server。
* **问题**: Codex 需要通过 MCP server 调用工具；当前项目无法被 `codex mcp add` 注册并使用。
* **价值**: 提供一个可被 Codex 注册、可稳定启动的 MCP server，为后续添加 Chrome 能力打基础。

## 2. 核心目标 (Goals)

1. [ ] 在 `src/chrome-mcp` 内实现一个 MCP server（默认 stdio transport）。
2. [ ] 提供至少一个可用工具（例如 `ping`/`echo`），用于验证 Codex 集成链路。
3. [ ] 提供可复制的注册与验证步骤（`codex mcp add/list/get/remove`）。

## 3. 非目标 (Non-Goals / Out of Scope)

* [ ] 不在本次实现真正的 Chrome 自动化能力（只做 MCP 服务器骨架 + 最小工具）
* [ ] 不引入复杂的认证/权限模型（本地 stdio server 为主）
* [ ] 不做多 repo/monorepo 拆分

## 4. 用户故事 (User Stories)

* **As a** Codex 用户
* **I want to** 把本项目注册成一个 MCP server 并让 Codex 能调用它的工具
* **So that** 后续可以把浏览器相关能力逐步放到这个 MCP server 中

## 5. 风险评估 (Risks)

* MCP SDK 版本变动可能影响初始化/工具注册 API，需要锁定依赖版本并提供自测。

