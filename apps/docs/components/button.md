# Button 按钮

`BzButton` 用于触发常见操作。

## 基础用法

```vue
<template>
  <BzButton label="Primary Button" />
  <BzButton type="success" plain>Success Plain</BzButton>
</template>
```

## Props

| 参数     | 说明         | 类型                                                        | 默认值      |
| -------- | ------------ | ----------------------------------------------------------- | ----------- |
| type     | 按钮类型     | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'primary'` |
| size     | 按钮尺寸     | `'small' \| 'medium' \| 'large'`                            | `'medium'`  |
| disabled | 是否禁用     | `boolean`                                                   | `false`     |
| plain    | 是否朴素按钮 | `boolean`                                                   | `false`     |
| round    | 是否圆角按钮 | `boolean`                                                   | `false`     |
| circle   | 是否圆形按钮 | `boolean`                                                   | `false`     |
| label    | 默认文案     | `string`                                                    | `''`        |
