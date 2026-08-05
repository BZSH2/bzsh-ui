# ButtonAction 按钮组

`BzButtonAction` 是基于 `BzButton` 封装的组合模块，用于通过数据配置批量渲染操作按钮，适合表格操作列、工具栏和页头动作区等场景。

## 基础用法

```vue
<script setup lang="ts">
import type { ButtonActionItem } from '@bzsh-ui/modules'

const buttonItems: ButtonActionItem[] = [
  { key: 'add', label: '新增', type: 'primary' },
  { key: 'edit', label: '编辑', type: 'success' },
  { key: 'delete', label: '删除', type: 'danger' },
]

function handleButtonClick(item: ButtonActionItem) {
  console.log('点击了按钮:', item.key)
}
</script>

<template>
  <BzButtonAction :items="buttonItems" @click="handleButtonClick" />
</template>
```

## 单项点击回调

除了统一监听组件的 `click` 事件，也可以给每个按钮单独配置 `onClick`：

```vue
<script setup lang="ts">
const buttonItems = [
  {
    key: 'add',
    label: '新增',
    type: 'primary',
    onClick: (item) => console.log('单项点击:', item.key),
  },
  {
    key: 'edit',
    label: '编辑',
    type: 'success',
    onClick: (item) => console.log('单项点击:', item.key),
  },
]
</script>

<template>
  <BzButtonAction :items="buttonItems" />
</template>
```

## 全局配置

通过 `size` 和 `disabled` 可以统一控制整组按钮，单个按钮上的同名配置会覆盖全局配置：

```vue
<script setup lang="ts">
const buttonItems = [
  { key: 'add', label: '新增', type: 'primary' },
  { key: 'edit', label: '编辑', type: 'success' },
  { key: 'delete', label: '删除', type: 'danger', disabled: false },
]
</script>

<template>
  <BzButtonAction :items="buttonItems" size="small" disabled />
</template>
```

## Props

| 参数     | 说明                     | 类型                             | 默认值     |
| -------- | ------------------------ | -------------------------------- | ---------- |
| items    | 按钮组数据               | `ButtonActionItem[]`             | `[]`       |
| size     | 按钮尺寸（全局）         | `'small' \| 'medium' \| 'large'` | `'medium'` |
| disabled | 是否禁用所有按钮（全局） | `boolean`                        | `false`    |

## ButtonActionItem

| 参数     | 说明             | 类型                                                        | 默认值  |
| -------- | ---------------- | ----------------------------------------------------------- | ------- |
| key      | 按钮唯一标识     | `string \| number`                                          | -       |
| label    | 按钮文本         | `string`                                                    | -       |
| type     | 按钮类型         | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | -       |
| size     | 按钮尺寸         | `'small' \| 'medium' \| 'large'`                            | -       |
| disabled | 是否禁用         | `boolean`                                                   | -       |
| plain    | 是否为朴素按钮   | `boolean`                                                   | `false` |
| round    | 是否为圆角按钮   | `boolean`                                                   | `false` |
| circle   | 是否为圆形按钮   | `boolean`                                                   | `false` |
| onClick  | 当前按钮点击回调 | `(item: ButtonActionItem) => void`                          | -       |

## Events

| 事件名 | 说明                 | 回调参数                 |
| ------ | -------------------- | ------------------------ |
| click  | 任意按钮被点击时触发 | `item: ButtonActionItem` |
