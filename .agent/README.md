# Agent 规则目录

本目录存放供 AI Agent 读取的项目规范和规则文件。

## 文件结构

| 文件                                           | 职责                        |
| ---------------------------------------------- | --------------------------- |
| [README.md](./README.md)                       | 本文件，规则总入口          |
| [documentation.md](./documentation.md)         | Markdown 文档创建和管理规则 |
| [code-style.md](./code-style.md)               | 代码风格和注释规范          |
| [project-structure.md](./project-structure.md) | 项目目录结构和模块职责      |
| [workflow.md](./workflow.md)                   | 开发工作流和提交规范        |
| [lint-config.md](./lint-config.md)             | Lint 配置规范和最佳实践     |

## 使用方式

AI Agent 在执行任务前应该：

1. 先读取本目录下的规则文件
2. 了解项目的规范和要求
3. 按照规则执行任务

## 新增规则

新增 Agent 规则时：

1. 在本目录创建新的 `.md` 文件
2. 按职责命名（如 `testing.md`、`deployment.md`）
3. 在本 README.md 的文件结构表格中添加新条目
4. 不要在文件中嵌套深层目录结构
