<script setup lang="ts">
import { ElScrollbar } from 'element-plus'

import type { ScrollProps, ScrollbarDirection } from '../props'

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
 * @description 除了自定义事件，也透传 Element Plus Scrollbar 的所有事件
 */
const emit = defineEmits<{
  /** 滚动到底部时触发 */
  'end-bottom': []
}>()

/**
 * 处理滚动到达边界事件
 * @param direction - 滚动到达的边界方向
 */
function handleEndReached(direction: ScrollbarDirection) {
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

<script lang="ts">
/**
 * Vue 组件选项
 * @description 设置 inheritAttrs: false，避免属性被自动应用到根元素
 */
export default {
  inheritAttrs: false,
}
</script>

<template>
  <ElScrollbar
    v-bind="$attrs"
    :height="props.height"
    :class="[props.class, 'bz-scroll']"
    :distance="props.distance"
    @end-reached="handleEndReached"
  >
    <slot />
  </ElScrollbar>
</template>
