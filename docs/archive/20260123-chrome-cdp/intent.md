# Intent: 通过 CDP 连接 remote-debugging-port 的 Chrome 并交互

> **状态**: DRAFT (草稿)
> **创建日期**: 2026-01-23
> **对应 Issue**: N/A

## 1. 背景与动机 (Context & Motivation)

* **现状**: 目前 `chrome-mcp` 已能作为 MCP server 被 Codex 使用，但还不能与浏览器交互。
* **问题**: 我希望 MCP server 能连接到我以 `--remote-debugging-port` 启动的 Chrome，并对页面进行读写操作（导航、执行脚本、获取信息等）。
* **价值**: 将 Codex 的工具调用能力接到真实浏览器页面，实现自动化与信息提取的闭环。

## 2. 核心目标 (Goals)

1. [ ] MCP server 可连接到本机 Chrome 的 CDP 端点（默认 `127.0.0.1:9222`）。
2. [ ] 提供最小可用的页面交互工具（例如：列出页面/选择页面/导航/执行 JS/截图）。
3. [ ] 提供可复制的启动与自测步骤，确保链路可稳定复现。

## 3. 非目标 (Non-Goals / Out of Scope)

* [ ] 不负责启动或管理 Chrome 生命周期（默认只“连接到已启动的 Chrome”）
* [ ] 不支持连接远程公网地址（默认仅允许 `127.0.0.1` / `localhost`）
* [ ] 不实现完整的 RPA/录制回放框架（先做工具最小集合）

## 4. 用户故事 (User Stories)

* **As a** Codex 用户
* **I want to** 让 `chrome-mcp` 连接到已开启 remote debugging 的 Chrome 并对页面执行操作
* **So that** 我可以在对话中直接驱动浏览器、抓取信息、做自动化

## 5. 风险评估 (Risks)

* CDP 连接等同“浏览器完全控制权”，必须默认仅本机访问并给出安全提示。
* Chrome/协议版本差异可能导致部分能力兼容性问题，需要选择合适的实现库与回退策略。

