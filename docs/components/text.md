<script setup lang="ts">
const text = '这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本'

const basicSource = `<template>
  <div style="width: 200px">
    <BzText model-value="这是一段很长的文本内容超出容器宽度时显示省略号并可通过tooltip查看完整内容" />
  </div>
</template>`

const multilineSource = `<template>
  <div style="width: 200px">
    <BzText
      model-value="这是一段很长的文本内容这是一段很长的文本内容这是一段很长的文本内容这是一段很长的文本内容"
      :tool-tip-line="2"
    />
  </div>
</template>`

const toolTipSizeSource = `<template>
  <div style="width: 200px">
    <BzText
      model-value="超长文本超长文本超长文本超长文本超长文本超长文本超长文本超长文本超长文本"
      :tool-tip-max-width="300"
      :tool-tip-max-height="200"
    />
  </div>
</template>`

const disabledSource = `<template>
  <div style="width: 300px">
    <BzText model-value="正常显示的文字，超出部分仅显示省略号无tooltip" :tool-tip="false" />
  </div>
</template>`

const lineHeightSource = `<template>
  <div style="width: 200px">
    <BzText
      model-value="设置行高后多行省略的效果设置行高后多行省略的效果设置行高后多行省略的效果"
      :tool-tip-line="3"
      :line-height="28"
    />
  </div>
</template>`

const slotSource = `<template>
  <div style="width: 200px">
    <BzText model-value="完整文本用于tooltip显示" :tool-tip-line="2">
      <b>自定义渲染的加粗文本内容超出时显示省略号</b>
    </BzText>
  </div>
</template>`
</script>

# Text 文字溢出提示

`BzText` 是一个智能的文字展示组件：文字不满时正常显示，超出容器宽度时自动显示省略号并通过 tooltip 查看完整内容。支持单行和多行省略。

## 基础用法

文字超出容器宽度时自动省略，hover 显示完整内容。

<DemoBlock title="基础用法" :source="basicSource">
  <div style="width: 200px">
    <BzText model-value="这是一段很长的文本内容超出容器宽度时显示省略号并可通过tooltip查看完整内容" />
  </div>
</DemoBlock>

## 多行省略

通过 `tool-tip-line` 设置显示行数，超出部分省略。

<DemoBlock title="多行省略" :source="multilineSource">
  <div style="width: 200px">
    <BzText
      model-value="这是一段很长的文本内容这是一段很长的文本内容这是一段很长的文本内容这是一段很长的文本内容"
      :tool-tip-line="2"
    />
  </div>
</DemoBlock>

## 自定义 Tooltip 大小

通过 `tool-tip-max-width` 和 `tool-tip-max-height` 控制 tooltip 弹窗的尺寸。

<DemoBlock title="自定义 Tooltip 大小" :source="toolTipSizeSource">
  <div style="width: 200px">
    <BzText
      model-value="超长文本超长文本超长文本超长文本超长文本超长文本超长文本超长文本超长文本"
      :tool-tip-max-width="300"
      :tool-tip-max-height="200"
    />
  </div>
</DemoBlock>

## 禁用 Tooltip

设置 `:tool-tip="false"` 关闭 tooltip，文字超出后仅显示省略号。

<DemoBlock title="禁用 Tooltip" :source="disabledSource">
  <div style="width: 300px">
    <BzText model-value="正常显示的文字，超出部分仅显示省略号无tooltip" :tool-tip="false" />
  </div>
</DemoBlock>

## 自定义行高

<DemoBlock title="自定义行高" :source="lineHeightSource">
  <div style="width: 200px">
    <BzText
      model-value="设置行高后多行省略的效果设置行高后多行省略的效果设置行高后多行省略的效果"
      :tool-tip-line="3"
      :line-height="28"
    />
  </div>
</DemoBlock>

## 插槽用法

当需要自定义文字样式（如加粗、颜色）时，可使用默认插槽。`model-value` 仍作为 tooltip 的显示内容。

<DemoBlock title="默认插槽" :source="slotSource">
  <div style="width: 200px">
    <BzText model-value="完整文本用于tooltip显示" :tool-tip-line="2">
      <b>自定义渲染的加粗文本内容超出时显示省略号</b>
    </BzText>
  </div>
</DemoBlock>

## Props

| 参数             | 说明                                 | 类型                                                   | 默认值 |
| ---------------- | ------------------------------------ | ------------------------------------------------------ | ------ |
| modelValue       | 展示文字                             | `string`                                               | `''`   |
| toolTip          | 是否开启 tooltip，内容不满时自动隐藏 | `boolean`                                              | `true` |
| toolTipLine      | 展示几行省略                         | `number`                                               | `1`    |
| toolTipMaxWidth  | tooltip 的最大宽度                   | `100 \| 200 \| 300 \| 400 \| 500 \| 600 \| 700 \| 800` | `600`  |
| toolTipMaxHeight | tooltip 的最大高度                   | `100 \| 200 \| 300 \| 400 \| 500 \| 600 \| 700 \| 800` | `300`  |
| lineHeight       | 文字行高                             | `number`                                               | `20`   |

## Slots

| 插槽名  | 说明                                |
| ------- | ----------------------------------- |
| default | 自定义文字内容，优先于 `modelValue` |
