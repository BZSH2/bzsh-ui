<script setup lang="ts">
import type { ScrollProps } from '../props'

/**
 * 滚动组件属性，包含默认值
 */
withDefaults(defineProps<ScrollProps>(), {
  label: '',
})
</script>

<template>
  <div class="bz-scroll">
    <slot>{{ label }}</slot>
  </div>
</template>
