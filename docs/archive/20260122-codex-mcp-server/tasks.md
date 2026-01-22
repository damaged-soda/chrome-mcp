# Implementation Plan: chrome-mcp 作为 Codex MCP Server（stdio）

> **关联 Spec**: `spec_delta.md`
> **执行状态**: [x] Pending -> [x] In Progress -> [x] Verification -> [x] Ready to Archive

## Phase 1: 准备 (Preparation)

* [x] **Context Check**: 确认 `docmap.yaml` 指向 `./src/chrome-mcp` 且工程可 `npm test`。
* [x] **Dependency**: 引入 MCP TypeScript SDK（建议：`@modelcontextprotocol/sdk`）并锁定版本。

## Phase 2: MCP Server 实现 (Core Implementation)

* [x] **Entrypoint**: 新增 MCP server 入口文件（stdio transport），并在 `package.json` 增加启动脚本（例如 `npm run mcp`）。
* [x] **Tools**: 实现最小工具集（至少 `ping`），并在 server 中注册。
* [x] **Build**: 确保 `npm run build` 产物可直接用于 `codex mcp add` 启动。

## Phase 3: 验证 (Verification)

* [x] **Local Start**: 手工启动 MCP server，确认能保持运行。
* [x] **Codex Register**: 执行 `codex mcp add chrome-mcp -- <command...>` 注册（stdio）。
* [x] **Codex Visible**: `codex mcp list` / `codex mcp get chrome-mcp` 验证配置存在。
* [x] **Tool Call**: 通过 Codex 或最小客户端脚本验证 `ping -> pong`。

## Phase 4: 归档准备 (Archive Prep)

* [x] **SOT Update (Archive 阶段执行)**: 将“启动 MCP server + 注册到 Codex”的说明合并入 `docs/sot/overview.md` 与 `docs/sot/architecture.md`。
* [x] **Ready**: 用户验收通过后移动 `docs/wip/20260122-codex-mcp-server` 到 `docs/archive/`。
