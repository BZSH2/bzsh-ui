<template>
  <button
    class="bz-button"
    :class="buttonClasses"
    :disabled="disabled"
    type="button"
    @click="handleClick"
  >
    <span class="bz-button__content">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { ButtonProps } from '../props'

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'medium',
  disabled: false,
  plain: false,
  round: false,
  circle: false,
  label: ''
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => ({
  [`bz-button--${props.type}`]: props.type,
  [`bz-button--${props.size}`]: props.size,
  'is-disabled': props.disabled,
  'is-plain': props.plain,
  'is-round': props.round,
  'is-circle': props.circle
}))

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }

  emit('click', event)
}
</script>
