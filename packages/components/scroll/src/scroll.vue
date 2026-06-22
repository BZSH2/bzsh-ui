<script setup lang="ts">
import { ElScrollbar } from 'element-plus'

import type { ScrollDirection, ScrollProps } from '../props'

/**
 * 滚动组件 Props，包含默认值
 * @description 基于 Element Plus Scrollbar 封装的滚动容器组件
 */
const props = withDefaults(defineProps<ScrollProps>(), {
  height: '100%',
  class: '',
  label: '',
  distance: 0,
})

/**
 * 滚动组件事件
 */
const emit = defineEmits<{
  /** 滚动到底部时触发 */
  'end-bottom': []
}>()

/**
 * 处理滚动到达边界事件
 * @param direction - 滚动到达的边界方向
 */
function handleEndReached(direction: ScrollDirection) {
  switch (direction) {
    case 'bottom':
      handleScrollEndBottom()
      break
    default:
      break
  }
}

/**
 * 处理滚动到底部事件，对外触发 end-bottom 事件
 */
function handleScrollEndBottom() {
  emit('end-bottom')
}
</script>

<template>
  <ElScrollbar
    :height="props.height"
    :class="props.class"
    :distance="props.distance"
    class="bz-scroll"
    @end-reached="handleEndReached"
  >
    <slot />
  </ElScrollbar>
</template>
