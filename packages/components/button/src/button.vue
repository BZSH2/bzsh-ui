<template>
  <ElButton
    class="bz-button"
    :type="buttonType"
    :size="buttonSize"
    :disabled="disabled"
    :plain="plain"
    :round="round"
    :circle="circle"
    @click="handleClick"
  >
    <span class="bz-button__content">
      <slot>{{ label }}</slot>
    </span>
  </ElButton>
</template>

<script setup lang="ts">
import { ElButton } from 'element-plus'
import { computed } from 'vue'

import type { ButtonProps } from '../props'

/**
 * 组件属性，包含默认值
 */
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'medium',
  disabled: false,
  plain: false,
  round: false,
  circle: false,
  label: '',
})

/**
 * 组件事件
 */
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

/**
 * 按钮类型计算属性
 */
const buttonType = computed(() => props.type)

/**
 * 按钮尺寸计算属性，将 'medium' 映射为 Element Plus 的 'default'
 */
const buttonSize = computed(() => (props.size === 'medium' ? 'default' : props.size))

/**
 * 按钮点击事件处理
 * @param event 鼠标点击事件
 */
const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>
