# Specification Delta: chrome-mcp 增加 Chrome CDP（remote-debugging-port）交互能力

> **目标 SOT 文件**: `./docs/sot/overview.md`, `./docs/sot/architecture.md`
> **基于意图**: `intent.md`

## 1. 变更摘要 (Synopsis)

为 `chrome-mcp` 增加连接到本机 Chrome DevTools Protocol（CDP）的能力，以便通过 MCP 工具对已打开页面进行交互。

## 2. 需求变更 (Requirements Delta)

### 🟢 ADDED Requirements (新增需求)

#### Requirement: Connect To Local CDP Endpoint

The system **SHALL** be able to connect to a Chrome instance started with `--remote-debugging-port=9222` on `http://127.0.0.1:9222`.

##### Scenario: 连接成功

* **GIVEN**: Chrome 以 `--remote-debugging-port=9222` 启动并监听本机
* **WHEN**: 调用 `chrome_connect`（或等价工具）
* **THEN**: 返回“已连接”并可列出 targets/tabs

---

#### Requirement: List And Select Targets

The system **SHALL** provide a tool to list available CDP targets (tabs/pages) and allow selecting a target for subsequent operations, supporting:

- Auto-select the “active tab” (best-effort)
- Fuzzy match by URL and/or title

##### Scenario: 选择页面

* **GIVEN**: 已连接 CDP
* **WHEN**: 调用 `chrome_select_target`（active 或 URL/title 模糊匹配）
* **THEN**: 返回一个可复用的 `targetId`（或 session handle），供后续工具使用

---

#### Requirement: Minimal Page Interactions

The system **SHALL** provide minimal page interactions as MCP tools, at least:

1. Evaluate JavaScript and return result text

（后续增量加入：Navigate、Screenshot、Click/Type/Wait/HTML 等）

##### Scenario: 执行脚本

* **GIVEN**: 已选择 target
* **WHEN**: 调用 `chrome_eval` 执行 JS（例如 `document.title`）
* **THEN**: 返回执行结果

---

#### Requirement: Safe Defaults

The system **SHALL** default to connecting only to `127.0.0.1/localhost` and **SHALL** refuse non-local endpoints unless explicitly enabled by configuration.

## 3. 数据结构/API 变更 (Schema/API Changes)

新增 MCP tools（名称可调整但需稳定）：

- `chrome_connect()`
- `chrome_list_targets()`
- `chrome_select_target({ active?: boolean, query?: string })`
- `chrome_eval({ targetId, expression })`

## 4. 兼容性与约束 (Compatibility & Constraints)

* Node 端实现优先使用成熟库（候选：`puppeteer-core` 连接 `browserURL`；或直接使用 CDP WebSocket）。
* MCP stdio：协议输出必须保持在 stdout；日志输出到 stderr。
