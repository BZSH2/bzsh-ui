# Scroll 滚动容器

`BzScroll` 是当前库里的基础滚动容器占位组件。

## 基础用法

```vue
<template>
  <BzScroll label="滚动区域内容" />
</template>
```

## 插槽用法

```vue
<template>
  <BzScroll>
    <div>这里可以放自定义内容</div>
  </BzScroll>
</template>
```

## Props

| 参数  | 说明         | 类型     | 默认值 |
| ----- | ------------ | -------- | ------ |
| label | 默认展示文案 | `string` | `''`   |
