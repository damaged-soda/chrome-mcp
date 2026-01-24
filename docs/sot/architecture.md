# 架构说明（SOT）

Last Updated: 2026-01-23

## 模块边界（按 repo 或关键模块描述）
- 单 repo：`src/chrome-mcp/`
- 入口与职责：
  - `src/chrome-mcp/src/index.ts`：库入口（当前仅 `ping()`）
  - `src/chrome-mcp/src/cli.ts`：CLI 入口（`chrome-mcp ping`）
  - `src/chrome-mcp/src/selftest.ts`：最小自测（`npm test`）
  - `src/chrome-mcp/src/mcp-server.ts`：MCP server 入口（stdio transport）
  - `src/chrome-mcp/src/mcp-selftest.ts`：MCP 集成自测（本地启动 server 并调用 `ping`）
  - `src/chrome-mcp/src/chrome-cdp-selftest.ts`：Chrome CDP 集成自测（连接 `127.0.0.1:9222` 并调用 `chrome_*` 工具）
  - `src/chrome-mcp/src/chrome-cdp-actions-selftest.ts`：Chrome CDP 动作自测（创建临时 tab，验证 wait/click/type/key_press/get_html/screenshot）

## 关键约束 / 不变量
- 构建产物输出到 `src/chrome-mcp/dist/`（由 `tsc` 生成）
- 模块系统为 ESM（`src/chrome-mcp/package.json` 的 `"type": "module"`）
- MCP stdio server 的协议输出走 stdout；日志输出走 stderr（避免污染协议）
- Chrome CDP 默认仅连接 `http://127.0.0.1:9222`（通过 `puppeteer-core` 的 `connect({ browserURL })`）
- `chrome_screenshot` 返回 MCP `image/png` content（便于 Codex 直接展示）

## 跨 repo 交互（如适用）
无（当前仅单仓脚手架）。
