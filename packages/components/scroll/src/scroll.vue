<script setup lang="ts">
import type { ScrollProps } from '../props'

withDefaults(defineProps<ScrollProps>(), {
  label: '',
})
</script>

<template>
  <div class="bz-scroll">
    <slot>{{ label }}</slot>
  </div>
</template>
