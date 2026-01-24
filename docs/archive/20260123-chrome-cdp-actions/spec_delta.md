# Specification Delta: Chrome CDP 基础动作工具（click/type/wait/html/screenshot）

> **目标 SOT 文件**: `./docs/sot/overview.md`, `./docs/sot/architecture.md`
> **基于意图**: `intent.md`

## 1. 变更摘要 (Synopsis)

在现有 CDP 连接与 `eval` 基础上，新增一组页面交互工具，使 `chrome-mcp` 能可靠完成常见自动化步骤：等待元素、点击、输入、获取 HTML、截图。

## 2. 需求变更 (Requirements Delta)

### 🟢 ADDED Requirements (新增需求)

#### Requirement: Wait For Selector

The system **SHALL** provide a tool to wait for an element by CSS selector on a given `targetId`.

##### Scenario: 元素等待

* **GIVEN**: 已连接 Chrome 且已获得 page `targetId`
* **WHEN**: 调用 `chrome_wait_for_selector({ targetId, selector })`
* **THEN**: 元素出现则返回 ok；超时则返回可理解的错误

---

#### Requirement: Click Element

The system **SHALL** provide a tool to click an element by CSS selector on a given `targetId`.

##### Scenario: 点击搜索按钮

* **GIVEN**: 已连接 Chrome 且 page 包含可点击元素
* **WHEN**: 调用 `chrome_click({ targetId, selector })`
* **THEN**: 点击动作发生，并返回 ok

---

#### Requirement: Type Into Element

The system **SHALL** provide a tool to type text into an element by CSS selector on a given `targetId`.

##### Scenario: 输入关键词

* **GIVEN**: 已连接 Chrome 且 page 包含输入框
* **WHEN**: 调用 `chrome_type({ targetId, selector, text, clear?: boolean })`
* **THEN**: 输入框包含期望文本，并返回 ok

---

#### Requirement: Key Press

The system **SHALL** provide a tool to press a key (e.g. Enter) on a given `targetId`.

##### Scenario: 回车提交

* **GIVEN**: 已连接 Chrome 且焦点在输入框
* **WHEN**: 调用 `chrome_key_press({ targetId, key })`
* **THEN**: 对应按键事件触发，并返回 ok

---

#### Requirement: Get HTML

The system **SHALL** provide a tool to get HTML from a page, either the full document HTML or a selected element’s outerHTML.

##### Scenario: 获取页面 HTML

* **GIVEN**: 已连接 Chrome 且 page 可读取
* **WHEN**: 调用 `chrome_get_html({ targetId })`
* **THEN**: 返回页面 HTML（必要时截断并提示）

---

#### Requirement: Screenshot

The system **SHALL** provide a tool to capture a PNG screenshot for a page on a given `targetId`, returning MCP `image` content (`mimeType: "image/png"`).

##### Scenario: 截图用于确认

* **GIVEN**: 已连接 Chrome 且 page 可截图
* **WHEN**: 调用 `chrome_screenshot({ targetId, fullPage?: boolean })`
* **THEN**: 返回 base64 PNG（或 MCP image content），并包含尺寸/长度信息

## 3. 数据结构/API 变更 (Schema/API Changes)

新增 MCP tools（名称可调整但需稳定）：

- `chrome_wait_for_selector({ targetId: string, selector: string, timeoutMs?: number })`
- `chrome_click({ targetId: string, selector: string })`
- `chrome_type({ targetId: string, selector: string, text: string, clear?: boolean })`
- `chrome_key_press({ targetId: string, key: string })`
- `chrome_get_html({ targetId: string, selector?: string, maxChars?: number })`
- `chrome_screenshot({ targetId: string, fullPage?: boolean })` (returns `image/png`)

## 4. 兼容性与约束 (Compatibility & Constraints)

* 选择器语义：CSS selector。
* 仍沿用 `puppeteer-core` + `browserURL=http://127.0.0.1:9222` 的连接方式。
* MCP stdio：协议输出必须保持在 stdout；日志输出到 stderr。
