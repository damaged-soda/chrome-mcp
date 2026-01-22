# 项目概览（SOT）

Last Updated: 2026-01-22

## 项目是什么
`chrome-mcp` 是本项目的实现代码库（Node.js + TypeScript）。当前提供：

- 最小 CLI（用于本地验证）
- MCP server（stdio transport），可注册到 Codex 使用（工具：`ping`）

## Repo 列表与职责（与 docmap 对齐）
- chrome-mcp：实现代码库（入口：`src/chrome-mcp/src/`）

## 本地开发最小路径（只到开发自测）
- 安装与自测：
  - `cd src/chrome-mcp`
  - `npm install`
  - `npm test`
- 运行 CLI（可选）：
  - `npm run start -- ping`
- 启动 MCP server（stdio）：
  - `npm run mcp`
- 注册到 Codex（stdio）：
  - `codex mcp add chrome-mcp -- node /ABS/PATH/TO/chrome-mcp/src/chrome-mcp/dist/mcp-server.js`
  - `codex mcp list`
  - `codex mcp get chrome-mcp`
  - `codex mcp remove chrome-mcp`
