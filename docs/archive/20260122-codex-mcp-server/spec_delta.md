# Specification Delta: chrome-mcp 作为 Codex MCP Server（stdio）

> **目标 SOT 文件**: `./docs/sot/overview.md`, `./docs/sot/architecture.md`
> **基于意图**: `intent.md`

## 1. 变更摘要 (Synopsis)

在 `src/chrome-mcp` 中新增一个可通过 stdio 启动的 MCP server，并提供最小工具用于验证 Codex 集成；同时在 SOT 中补充“如何注册到 Codex”的指令。

## 2. 需求变更 (Requirements Delta)

### 🟢 ADDED Requirements (新增需求)

#### Requirement: Stdio MCP Server Entrypoint

The system **SHALL** provide an MCP server entrypoint that can be launched as a long-running stdio process from `src/chrome-mcp`.

##### Scenario: 启动成功

* **GIVEN**: 已在 `src/chrome-mcp` 安装依赖
* **WHEN**: 通过文档约定的命令启动 MCP server
* **THEN**: 进程保持运行并可响应 MCP initialize

---

#### Requirement: Minimal Tooling for Integration Test

The system **SHALL** expose at least one MCP tool for integration verification (e.g. `ping` returning `pong`).

##### Scenario: 工具可调用

* **GIVEN**: MCP server 已启动
* **WHEN**: 客户端调用 `ping`
* **THEN**: 返回 `pong`

---

#### Requirement: Codex Registration Instructions

The system **SHALL** document how to register the MCP server into Codex using `codex mcp add` and how to validate it with `codex mcp list/get`.

##### Scenario: Codex 可见

* **GIVEN**: 已执行注册命令
* **WHEN**: 执行 `codex mcp list`
* **THEN**: 列表中存在名为 `chrome-mcp` 的 server 配置

## 3. 数据结构/API 变更 (Schema/API Changes)

无（新增 MCP server 与工具定义）。

