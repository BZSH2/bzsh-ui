<script setup lang="ts">
import { BzButton } from '@bzsh-ui/components'

import type { ButtonActionItem, ButtonActionProps } from '../props'

/**
 * 按钮组组件 Props
 */
const props = withDefaults(defineProps<ButtonActionProps>(), {
  items: () => [],
  size: 'medium',
  disabled: false,
})

/**
 * 按钮组组件事件
 */
const emit = defineEmits<{
  /**
   * 按钮点击事件
   * @param item - 被点击的按钮数据项
   */
  click: [item: ButtonActionItem]
}>()

/**
 * 处理按钮点击
 * @param item - 被点击的按钮数据项
 */
function handleButtonClick(item: ButtonActionItem) {
  // 优先调用 item 自身的 onClick
  if (item.onClick) {
    item.onClick(item)
  }
  // 同时触发组件的 click 事件
  emit('click', item)
}
</script>

<script lang="ts">
/**
 * Vue 组件选项
 */
export default {
  name: 'BzButtonAction',
}
</script>

<template>
  <div class="bz-button-action">
    <BzButton
      v-for="item in items"
      :key="item.key"
      :type="item.type"
      :size="item.size || props.size"
      :disabled="item.disabled ?? props.disabled"
      :plain="item.plain"
      :round="item.round"
      :circle="item.circle"
      @click="handleButtonClick(item)"
    >
      {{ item.label }}
    </BzButton>
  </div>
</template>

<style scoped lang="scss">
.bz-button-action {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}
</style>
