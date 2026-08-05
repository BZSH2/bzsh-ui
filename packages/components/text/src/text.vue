<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { ElTooltip } from 'element-plus'
import { ref, onMounted, watch, nextTick, computed } from 'vue'

import type { TextProps } from '../props'

const props = withDefaults(defineProps<TextProps>(), {
  modelValue: '',
  toolTip: true,
  toolTipLine: 1,
  toolTipMaxWidth: 600,
  toolTipMaxHeight: 300,
  lineHeight: 20,
})

const textRef = ref<HTMLElement>()
const isOverflow = ref(false)

/** 文本样式：动态行高 + 单行/多行省略 */
const textStyle = computed(() => {
  const base: Record<string, string | number> = {
    lineHeight: `${props.lineHeight}px`,
    overflow: 'hidden',
  }
  if (props.toolTipLine === 1) {
    base.whiteSpace = 'nowrap'
    base.textOverflow = 'ellipsis'
  } else {
    base.display = '-webkit-box'
    base.webkitLineClamp = props.toolTipLine
    base.webkitBoxOrient = 'vertical'
  }
  return base
})

/** tooltip popper 样式 */
const popperStyle = computed(() => ({
  maxWidth: `${props.toolTipMaxWidth}px`,
  maxHeight: `${props.toolTipMaxHeight}px`,
}))

/**
 * 检测文本是否溢出
 * - 单行：比较 scrollWidth 与 clientWidth
 * - 多行：比较 scrollHeight 与 clientHeight
 */
function checkOverflow() {
  const el = textRef.value
  if (!el) return
  if (props.toolTipLine === 1) {
    isOverflow.value = el.scrollWidth > el.clientWidth
  } else {
    isOverflow.value = el.scrollHeight > el.clientHeight
  }
}

/** 是否显示 tooltip：toolTip 开启 且 文本溢出 */
const showTooltip = computed(() => props.toolTip && isOverflow.value)

onMounted(() => {
  nextTick(checkOverflow)
})

watch(
  () => props.modelValue,
  () => {
    nextTick(checkOverflow)
  }
)

watch(
  () => props.toolTipLine,
  () => {
    nextTick(checkOverflow)
  }
)
</script>

<template>
  <ElTooltip
    :disabled="!showTooltip"
    :content="props.modelValue"
    :popper-style="popperStyle"
    placement="top"
  >
    <span ref="textRef" v-bind="$attrs" class="bz-text" :style="textStyle">
      <slot>{{ props.modelValue }}</slot>
    </span>
  </ElTooltip>
</template>
