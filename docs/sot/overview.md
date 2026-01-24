# 项目概览（SOT）

Last Updated: 2026-01-23

## 项目是什么
`chrome-mcp` 是本项目的实现代码库（Node.js + TypeScript）。当前提供：

- 最小 CLI（用于本地验证）
- MCP server（stdio transport），可注册到 Codex 使用（工具：`ping`）
- Chrome CDP 交互（连接到 `--remote-debugging-port=9222` 的本机 Chrome；工具：`chrome_connect` / `chrome_list_targets` / `chrome_select_target` / `chrome_eval` / `chrome_wait_for_selector` / `chrome_click` / `chrome_type` / `chrome_key_press` / `chrome_get_html` / `chrome_screenshot`（返回 `image/png`））

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
- 启动 Chrome（macOS 示例；仅本机监听 9222）：
  - `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-address=127.0.0.1 --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-mcp-profile`
- CDP 本地自测（需先启动 Chrome）：
  - `npm run cdp:selftest`
  - `npm run cdp:actions-selftest`
