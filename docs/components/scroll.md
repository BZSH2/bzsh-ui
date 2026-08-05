<script setup lang="ts">
function handleScrollEndBottom() {
  console.log('滚动到底部了')
}

function loadMore() {
  console.log('load more')
}

const basicSource = `<template>
  <BzScroll height="400px">
    <div v-for="item in 100" :key="item">滚动内容 {{ item }}</div>
  </BzScroll>
</template>`

const listSource = `<template>
  <BzScroll height="240px">
    <div
      v-for="item in 20"
      :key="item"
      style="padding: 12px; border-bottom: 1px solid #f0f0f0;"
    >
      列表项 {{ item }}
    </div>
  </BzScroll>
</template>`

const nativeSource = `<template>
  <BzScroll :max-height="400" always>
    <div v-for="item in 100" :key="item">滚动内容 {{ item }}</div>
  </BzScroll>
</template>`

const customClassSource = `<template>
  <BzScroll height="300px" class="custom-scroll">
    <div v-for="item in 50" :key="item">自定义样式内容 {{ item }}</div>
  </BzScroll>
</template>`

const endBottomSource = `<script setup lang="ts">
function handleScrollEndBottom() {
  console.log('滚动到底部了')
}
<\/script>

<template>
  <BzScroll height="400px" @end-bottom="handleScrollEndBottom">
    <div v-for="item in 100" :key="item">滚动内容 {{ item }}</div>
  </BzScroll>
</template>`

const comboSource = `<script setup lang="ts">
function loadMore() {
  console.log('load more')
}
<\/script>

<template>
  <BzScroll
    height="320px"
    :distance="16"
    always
    @end-bottom="loadMore"
  >
    <div v-for="item in 100" :key="item">内容 {{ item }}</div>
  </BzScroll>
</template>`
</script>

# Scroll 滚动容器

`BzScroll` 是基于 Element Plus Scrollbar 封装的基础滚动容器组件，用于承载需要限定高度并支持自定义滚动的内容区域。

> **注意**：`BzScroll` 完整透传 Element Plus Scrollbar 的所有属性和事件，你可以像使用原生 `ElScrollbar` 一样使用它。

## 基础用法

<DemoBlock title="基础用法" :source="basicSource">
  <BzScroll height="400px">
    <div v-for="item in 100" :key="item">滚动内容 {{ item }}</div>
  </BzScroll>
</DemoBlock>

## 列表滚动示例

<DemoBlock title="列表滚动" :source="listSource">
  <BzScroll height="240px">
    <div
      v-for="item in 20"
      :key="item"
      style="padding: 12px; border-bottom: 1px solid #f0f0f0;"
    >
      列表项 {{ item }}
    </div>
  </BzScroll>
</DemoBlock>

## 使用原生 Element Plus 属性

你可以直接使用 `ElScrollbar` 的所有属性，比如 `max-height`、`native`、`always` 等：

<DemoBlock title="透传原生属性" :source="nativeSource">
  <BzScroll :max-height="400" always>
    <div v-for="item in 100" :key="item">滚动内容 {{ item }}</div>
  </BzScroll>
</DemoBlock>

## 自定义类名

<DemoBlock title="自定义类名" :source="customClassSource">
  <BzScroll height="300px" class="custom-scroll">
    <div v-for="item in 50" :key="item">自定义样式内容 {{ item }}</div>
  </BzScroll>
</DemoBlock>

## 滚动到底部事件

当滚动区域到达底部时会触发 `end-bottom` 事件，可用于实现无限加载等场景。

<DemoBlock title="触底事件" :source="endBottomSource">
  <BzScroll height="400px" @end-bottom="handleScrollEndBottom">
    <div v-for="item in 100" :key="item">滚动内容 {{ item }}</div>
  </BzScroll>
</DemoBlock>

## 组合示例

下面这个例子同时使用了固定高度、原生透传属性和触底事件：

<DemoBlock title="组合示例" :source="comboSource">
  <BzScroll
    height="320px"
    :distance="16"
    always
    @end-bottom="loadMore"
  >
    <div v-for="item in 100" :key="item">内容 {{ item }}</div>
  </BzScroll>
</DemoBlock>

## Props

| 参数     | 说明                                     | 类型     | 默认值   |
| -------- | ---------------------------------------- | -------- | -------- |
| height   | 滚动容器高度                             | `string` | `'100%'` |
| class    | 自定义滚动容器类名                       | `string` | `''`     |
| distance | 距离底部触发事件的距离                   | `number` | `0`      |
| label    | 标签文本（预留字段）                     | `string` | `''`     |
| ...      | 完整透传 Element Plus Scrollbar 所有属性 | -        | -        |

## Events

| 事件名     | 说明                                     | 回调参数 |
| ---------- | ---------------------------------------- | -------- |
| end-bottom | 滚动到底部时触发                         | -        |
| ...        | 完整透传 Element Plus Scrollbar 所有事件 | -        |

## Slots

| 插槽名  | 说明         |
| ------- | ------------ |
| default | 滚动区域内容 |
