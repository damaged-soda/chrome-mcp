# Specification Delta: 初始化仓库：chrome-mcp 单仓落地

> **目标 SOT 文件**: `./docs/sot/overview.md`, `./docs/sot/architecture.md`
> **基于意图**: `intent.md`

## 1. 变更摘要 (Synopsis)

* 用单一实现仓库 `chrome-mcp` 取代模板中的 `repo-a` / `repo-b`。
* 确保 `docmap.yaml` 与 `src/` 目录结构一致。
* 在 `src/chrome-mcp/` 提供最小可运行脚手架与自测入口。

## 2. 需求变更 (Requirements Delta)

### 🟢 ADDED Requirements (新增需求)

#### Requirement: Single Repo Mapping

The system **SHALL** define exactly one repo mapping in `docmap.yaml`: `chrome-mcp -> ./src/chrome-mcp`.

##### Scenario: docmap 对齐

* **GIVEN**: 项目根目录存在 `docmap.yaml`
* **WHEN**: 查看 `repos` 列表
* **THEN**: 仅包含 `chrome-mcp`，且其 `path` 指向 `./src/chrome-mcp`

---

#### Requirement: Tracked Implementation Skeleton

The system **SHALL** include an implementation skeleton under `./src/chrome-mcp/` that can be installed and self-tested via documented commands.

##### Scenario: 最小自测

* **GIVEN**: 新环境、仅按照文档最小步骤操作
* **WHEN**: 在 `src/chrome-mcp` 执行安装与测试命令
* **THEN**: 自测通过且无需额外手工配置

---

### 🟡 MODIFIED Requirements (修改需求)

#### Requirement: Repository Ignore Rules

> **OLD Behavior**: `.gitignore` 忽略 `src/*`（仅保留 `src/.gitkeep`）
> **NEW Behavior**: `.gitignore` 默认仍忽略 `src/*`，但显式允许跟踪 `src/chrome-mcp/**`（并移除对 `src/.gitkeep` 的依赖）

##### Impact Analysis (影响分析)

* 受影响的代码模块: `.gitignore`, `src/`
* 是否需要数据迁移: No

---

### 🔴 REMOVED Requirements (移除需求)

#### Requirement: repo-a / repo-b placeholders

* **Reason**: 模板占位符不再代表真实实现仓库；以 `chrome-mcp` 取代。

## 3. 数据结构/API 变更 (Schema/API Changes)

无（本次仅脚手架与目录结构对齐）。

