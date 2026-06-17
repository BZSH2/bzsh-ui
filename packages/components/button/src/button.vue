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

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'medium',
  disabled: false,
  plain: false,
  round: false,
  circle: false,
  label: '',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonType = computed(() => props.type)
const buttonSize = computed(() => (props.size === 'medium' ? 'default' : props.size))

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>
