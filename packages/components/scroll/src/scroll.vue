<template>
  <div class="bz-scroll">
    测试自动发布
    <slot>{{ label }}</slot>
  </div>
</template>

<script setup lang="ts">
import type { ScrollProps } from '../props'

withDefaults(defineProps<ScrollProps>(), {
  label: ''
})
</script>
