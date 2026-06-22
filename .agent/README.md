# Agent 规则目录

本目录存放供 AI Agent 读取的项目规范和规则文件。

## 目录结构

### 核心规则

| 文件                                                     | 职责                        |
| -------------------------------------------------------- | --------------------------- |
| [README.md](./README.md)                                 | 本文件，规则总入口          |
| [core/documentation.md](./core/documentation.md)         | Markdown 文档创建和管理规则 |
| [core/code-style.md](./core/code-style.md)               | 代码风格和注释规范          |
| [core/project-structure.md](./core/project-structure.md) | 项目目录结构和模块职责      |
| [core/workflow.md](./core/workflow.md)                   | 开发工作流和提交规范        |
| [core/lint-config.md](./core/lint-config.md)             | Lint 配置规范和最佳实践     |

### 领域规则

| 目录                                                         | 职责                   |
| ------------------------------------------------------------ | ---------------------- |
| [domains/README.md](./domains/README.md)                     | 领域规则索引           |
| [domains/component/README.md](./domains/component/README.md) | 组件相关规则入口       |
| [domains/utils/README.md](./domains/utils/README.md)         | 工具函数相关规则入口   |
| [domains/utils/structure.md](./domains/utils/structure.md)   | 工具目录与文档对齐规则 |

## 使用方式

AI Agent 在执行任务前应该：

1. 先读取本目录下的核心规则
2. 根据任务类型进入对应的领域规则目录
3. 按照规则执行任务

## 新增规则

新增 Agent 规则时：

1. 通用规范优先放入 `core/`
2. 组件、工具等垂直规则放入 `domains/<name>/`
3. 在本 README.md 中补充索引
4. 保持目录层级克制，避免继续向下深层嵌套
