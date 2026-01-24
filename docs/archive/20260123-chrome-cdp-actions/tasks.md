# Implementation Plan: Chrome CDP 基础动作工具（click/type/wait/html/screenshot）

> **关联 Spec**: `spec_delta.md`
> **执行状态**: [x] Pending -> [x] In Progress -> [x] Verification -> [x] Ready to Archive

## Phase 1: 准备 (Preparation)

* [x] **Context Check**: `chrome_connect/list/select/eval` 仍可用，且 `npm test` 通过。
* [x] **API Finalize**: 确认本次新增工具的输入输出字段（selector 语义、timeoutMs、截图返回格式）。

## Phase 2: 工具实现 (Core Implementation)

* [x] **Tool: chrome_wait_for_selector**: 基于 Puppeteer `page.waitForSelector` 实现。
* [x] **Tool: chrome_click**: 基于 Puppeteer `page.click` 实现（必要时先 wait）。
* [x] **Tool: chrome_type**: 支持可选 `clear`，使用 `page.focus` + `page.keyboard.type`（或 `$eval` 赋值回退）。
* [x] **Tool: chrome_key_press**: 基于 Puppeteer `page.keyboard.press` 实现（如 `Enter`）。
* [x] **Tool: chrome_get_html**: `page.content()` 或 `$eval(selector, el => el.outerHTML)`，支持 `maxChars` 截断。
* [x] **Tool: chrome_screenshot**: `page.screenshot({ encoding: \"base64\", fullPage })`，作为 MCP `image/png` content 返回（同时可附带 base64 文本）。

## Phase 3: 验证 (Verification)

* [x] **Manual Smoke**: 连接 Chrome -> 选定 tab -> wait/click/type -> get_html -> screenshot。
* [x] **Selftest**: 新增一个可选的 CDP 动作自测脚本（避免影响用户现有 tab，必要时创建临时 tab 并关闭）。
* [x] **Codex Integration**: 在 Codex 中按真实场景调用并验证。

## Phase 4: 归档准备 (Archive Prep)

* [x] **SOT Update (Archive 阶段执行)**: 将新增工具与用法合并到 `docs/sot/overview.md`、`docs/sot/architecture.md`。
* [x] **Ready**: 用户验收通过后移动 `docs/wip/20260123-chrome-cdp-actions` 到 `docs/archive/`。
