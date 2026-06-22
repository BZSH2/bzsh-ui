<script setup lang="ts">
import { BzScroll } from '@bzsh-ui/components'
</script>

<template>
  <BzScroll :distance="100">
    <div v-for="item in 100" :key="item">Bz - {{ item }}</div>
  </BzScroll>
</template>
