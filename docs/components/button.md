<script setup lang="ts">
function handleClick(event: MouseEvent) {
  console.log('button clicked', event)
}

const basicSource = `<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <BzButton label="Primary Button" />
    <BzButton type="success" plain>Success Plain</BzButton>
  </div>
</template>`

const typeSource = `<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <BzButton label="Primary" />
    <BzButton type="success" label="Success" />
    <BzButton type="warning" label="Warning" />
    <BzButton type="danger" label="Danger" />
    <BzButton type="info" label="Info" />
  </div>
</template>`

const sizeSource = `<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
    <BzButton size="small" label="Small" />
    <BzButton size="medium" label="Medium" />
    <BzButton size="large" label="Large" />
    <BzButton disabled label="Disabled" />
  </div>
</template>`

const styleSource = `<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <BzButton plain label="Plain" />
    <BzButton round label="Round" />
    <BzButton type="success" plain round label="Plain Round" />
  </div>
</template>`

const clickSource = `<script setup lang="ts">
function handleClick(event: MouseEvent) {
  console.log('button clicked', event)
}
<\/script>

<template>
  <BzButton label="点击我" @click="handleClick" />
</template>`

const slotSource = `<template>
  <BzButton type="primary">
    自定义按钮内容
  </BzButton>
</template>`
</script>

# Button 按钮

`BzButton` 用于触发常见操作。

## 基础用法

<DemoBlock title="基础用法" :source="basicSource">
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <BzButton label="Primary Button" />
    <BzButton type="success" plain>Success Plain</BzButton>
  </div>
</DemoBlock>

## 类型示例

<DemoBlock title="按钮类型" :source="typeSource">
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <BzButton label="Primary" />
    <BzButton type="success" label="Success" />
    <BzButton type="warning" label="Warning" />
    <BzButton type="danger" label="Danger" />
    <BzButton type="info" label="Info" />
  </div>
</DemoBlock>

## 尺寸与状态

<DemoBlock title="尺寸与禁用态" :source="sizeSource">
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
    <BzButton size="small" label="Small" />
    <BzButton size="medium" label="Medium" />
    <BzButton size="large" label="Large" />
    <BzButton disabled label="Disabled" />
  </div>
</DemoBlock>

## 圆角与朴素样式

<DemoBlock title="样式组合" :source="styleSource">
  <div style="display: flex; gap: 12px; flex-wrap: wrap;">
    <BzButton plain label="Plain" />
    <BzButton round label="Round" />
    <BzButton type="success" plain round label="Plain Round" />
  </div>
</DemoBlock>

## 点击事件

<DemoBlock title="点击事件" :source="clickSource">
  <BzButton label="点击我" @click="handleClick" />
</DemoBlock>

## 插槽用法

当同时传入默认插槽和 `label` 时，默认插槽优先级更高：

<DemoBlock title="默认插槽" :source="slotSource">
  <BzButton type="primary">
    自定义按钮内容
  </BzButton>
</DemoBlock>

## Props

| 参数     | 说明         | 类型                                                        | 默认值      |
| -------- | ------------ | ----------------------------------------------------------- | ----------- |
| type     | 按钮类型测试 | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'primary'` |
| size     | 按钮尺寸     | `'small' \| 'medium' \| 'large'`                            | `'medium'`  |
| disabled | 是否禁用     | `boolean`                                                   | `false`     |
| plain    | 是否朴素按钮 | `boolean`                                                   | `false`     |
| round    | 是否圆角按钮 | `boolean`                                                   | `false`     |
| circle   | 是否圆形按钮 | `boolean`                                                   | `false`     |
| label    | 默认文案     | `string`                                                    | `''`        |

## Events

| 事件名 | 说明           | 回调参数            |
| ------ | -------------- | ------------------- |
| click  | 点击按钮时触发 | `event: MouseEvent` |

## Slots

| 插槽名  | 说明                           |
| ------- | ------------------------------ |
| default | 自定义按钮内容，优先于 `label` |
