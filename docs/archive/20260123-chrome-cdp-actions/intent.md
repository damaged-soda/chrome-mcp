# Intent: Chrome CDP 增量能力（click/type/wait/html/screenshot）

> **状态**: DRAFT (草稿)
> **创建日期**: 2026-01-23
> **对应 Issue**: N/A

## 1. 背景与动机 (Context & Motivation)

* **现状**: `chrome-mcp` 已支持连接本机 `--remote-debugging-port=9222` 的 Chrome，并具备 `chrome_connect / chrome_list_targets / chrome_select_target / chrome_eval`。
* **问题**: 仅靠 `eval` 难以稳定完成常规交互（点击、输入、等待元素、抓取 HTML、截图）。
* **价值**: 通过一组“基础动作”工具，把浏览器交互能力补齐到可用于日常自动化/抓取的最小闭环。

## 2. 核心目标 (Goals)

1. [ ] 增加页面基础动作 MCP tools：`wait_for_selector` / `click` / `type` / `get_html` / `screenshot`。
2. [ ] 保持安全默认值：仍仅连接 `127.0.0.1:9222`，工具操作必须显式指定 `targetId`。
3. [ ] 给出可复制的验证路径（本地自测 + Codex 里可调用）。

## 3. 非目标 (Non-Goals / Out of Scope)

* [ ] 不实现复杂的表单自动化 DSL / 录制回放
* [ ] 不做网络拦截、下载管理、登录态管理等高级能力
* [ ] 不支持非本机 CDP 端点（保持现有安全策略）

## 4. 用户故事 (User Stories)

* **As a** Codex 用户
* **I want to** 在选定 tab 上等待元素、点击、输入，并能拿到 HTML/截图
* **So that** 我可以可靠地完成搜索、导航、信息提取等操作

## 5. 风险评估 (Risks)

* 点击/输入会产生页面副作用，必须保持工具语义清晰、错误信息明确，并避免自动选择错误 tab。
* 截图/HTML 可能很大，需要对返回大小做限制或提示。

