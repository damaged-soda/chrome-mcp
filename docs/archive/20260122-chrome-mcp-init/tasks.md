# Implementation Plan: 初始化仓库：chrome-mcp 单仓落地

> **关联 Spec**: `spec_delta.md`
> **执行状态**: [x] Pending -> [x] In Progress -> [x] Verification -> [x] Ready to Archive

## Phase 1: 准备与对齐 (Preparation)

* [x] **Context Check**: 确认当前占位符位置（`docmap.yaml` / `.gitignore` / `docs/sot/*`）。
* [x] **Stack Decision**: 确认 `src/chrome-mcp` 技术栈（默认提议：Node.js + TypeScript；如需改为 Python/JS 先在此处确认）。

## Phase 2: 脚手架实现 (Core Implementation)

* [x] **Docmap**: 将 `docmap.yaml` 从 `repo-a/repo-b` 改为单一 `chrome-mcp -> ./src/chrome-mcp`。
* [x] **Gitignore**: 调整 `.gitignore`，继续忽略 `src/*`，但放行 `src/chrome-mcp/**`；移除 `src/.gitkeep`（如不再需要）。
* [x] **Scaffold**: 创建 `src/chrome-mcp/` 最小工程结构（含 README、可运行入口、最小自测）。
* [x] **Placeholder Cleanup**: 全局搜索并移除实现侧的 `repo-a/repo-b` 残留引用（WIP/SOT/模板允许保留历史痕迹按需处理）。

## Phase 3: 验证 (Verification)

* [x] **Manual Verify**: 按 `spec_delta.md` 的 Scenarios 逐条验证（docmap 对齐 + 最小自测）。
* [x] **Automated Tests**: 运行 `src/chrome-mcp` 的测试命令，确保可复现。

## Phase 4: 文档归档 (Documentation Merge)

* [x] **SOT Update (Archive 阶段执行)**: 将 `spec_delta.md` 的增量合并入 `./docs/sot/overview.md` 与 `./docs/sot/architecture.md`（更新 Last Updated）。
* [x] **Ready**: 用户验收通过后，移动 `docs/wip/20260122-chrome-mcp-init` 到 `docs/archive/`。
