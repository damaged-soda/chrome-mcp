# Implementation Plan: chrome-mcp 增加 Chrome CDP（remote-debugging-port）交互能力

> **关联 Spec**: `spec_delta.md`
> **执行状态**: [x] Pending -> [x] In Progress -> [x] Verification -> [x] Ready to Archive

## Phase 1: 准备 (Preparation)

* [x] **Context Check**: 确认当前 `chrome-mcp` MCP server 与 `npm test` 正常。
* [x] **CDP Assumptions**: 明确默认端点（`127.0.0.1:9222`）与安全策略（拒绝非本机）。
* [x] **Library Choice**: 选择实现方案（优先：`puppeteer-core`；备选：直连 WebSocket CDP）。

## Phase 2: 工具实现 (Core Implementation)

* [x] **State**: 在 server 进程内维护 CDP 连接与 target 选择状态（含断线重连策略）。
* [x] **Tool: chrome_connect**: 连接/复用到 `127.0.0.1:9222` 的 Chrome（返回版本信息/连接状态）。
* [x] **Tool: chrome_list_targets**: 列出 tabs/pages（返回 targetId、title、url）。
* [x] **Tool: chrome_select_target**: 支持 active tab 自动选择 + URL/title 模糊匹配（返回 targetId）。
* [x] **Tool: chrome_eval**: 在页面上下文执行 JS 并返回结果。

Backlog（后续以新 WIP 增量实现，不属于本次归档范围）：
- `chrome_get_html`
- `chrome_wait_for_selector`
- `chrome_click`
- `chrome_type`
- `chrome_navigate`
- `chrome_screenshot`

## Phase 3: 验证 (Verification)

* [x] **Manual Start Chrome**: 提供启动命令示例（含 `--remote-debugging-port` 与 `--user-data-dir`）。
  - macOS（示例）：
    - `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-address=127.0.0.1 --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-mcp-profile`
* [x] **Selftest**: 增加一个本地自测：连接/选择 active tab/执行 `typeof document.title`。
  - `cd src/chrome-mcp && npm run cdp:selftest`
* [x] **Codex Integration**: 在 Codex 中调用 `chrome_connect` + `chrome_eval` 验证链路。

## Phase 4: 归档准备 (Archive Prep)

* [x] **SOT Update (Archive 阶段执行)**: 将 CDP 能力与使用方法合并到 `docs/sot/overview.md`、`docs/sot/architecture.md`。
* [x] **Ready**: 用户验收通过后移动 `docs/wip/20260123-chrome-cdp` 到 `docs/archive/`。
