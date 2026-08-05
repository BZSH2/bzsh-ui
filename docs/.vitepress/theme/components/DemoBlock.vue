<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

const props = defineProps<{
  source: string
  title?: string
}>()

const expanded = ref(false)
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

const copyButtonText = computed(() => (copied.value ? '已复制' : '复制代码'))
const sourceButtonText = computed(() => (expanded.value ? '收起源码' : '查看源码'))

function resetCopyState() {
  if (copyTimer) {
    clearTimeout(copyTimer)
    copyTimer = undefined
  }

  copied.value = false
}

async function copySource() {
  try {
    await navigator.clipboard.writeText(props.source)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = props.source
    textarea.setAttribute('readonly', 'true')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  copied.value = true
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copied.value = false
  }, 1500)
}

function toggleSource() {
  expanded.value = !expanded.value
}

onBeforeUnmount(() => {
  resetCopyState()
})
</script>

<template>
  <div class="demo-block">
    <div class="demo-block__preview">
      <div class="demo-block__header">
        <div v-if="title" class="demo-block__title">
          {{ title }}
        </div>
        <div class="demo-block__meta"> Vue Demo </div>
      </div>
      <div class="demo-block__content">
        <slot />
      </div>
    </div>

    <div class="demo-block__actions">
      <div class="demo-block__actions-left">
        <span class="demo-block__hint">可直接复制并在项目中使用</span>
      </div>
      <div class="demo-block__actions-right">
        <button class="demo-block__button" type="button" @click="copySource">
          {{ copyButtonText }}
        </button>
        <button class="demo-block__button" type="button" @click="toggleSource">
          {{ sourceButtonText }}
        </button>
      </div>
    </div>

    <div v-show="expanded" class="demo-block__source">
      <pre><code>{{ source }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.demo-block {
  margin: 20px 0 28px;
  overflow: hidden;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgb(15 23 42 / 0.06);
}

.demo-block__preview {
  padding: 20px 20px 24px;
  background:
    linear-gradient(180deg, rgb(64 158 255 / 0.04) 0%, rgb(64 158 255 / 0) 80%), var(--vp-c-bg);
}

.demo-block__header {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.demo-block__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.demo-block__meta {
  flex-shrink: 0;
  padding: 4px 8px;
  font-size: 12px;
  line-height: 1;
  color: var(--vp-c-brand-1);
  background: rgb(64 158 255 / 0.08);
  border: 1px solid rgb(64 158 255 / 0.2);
  border-radius: 999px;
}

.demo-block__content {
  overflow-x: auto;
}

.demo-block__actions {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
}

.demo-block__actions-left {
  min-width: 0;
}

.demo-block__actions-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.demo-block__hint {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.demo-block__button {
  padding: 7px 12px;
  font-size: 13px;
  line-height: 1;
  color: var(--vp-c-text-2);
  cursor: pointer;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.demo-block__button:hover {
  color: var(--vp-c-brand-1);
  background: rgb(64 158 255 / 0.06);
  border-color: var(--vp-c-brand-1);
}

.demo-block__source {
  background: var(--vp-code-block-bg);
  border-top: 1px solid var(--vp-c-divider);
}

.demo-block__source pre {
  padding: 16px 20px;
  margin: 0;
  overflow-x: auto;
}

.demo-block__source code {
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.7;
  color: var(--vp-code-color);
  white-space: pre;
}

@media (width <= 640px) {
  .demo-block__header,
  .demo-block__actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .demo-block__actions-right {
    width: 100%;
  }
}
</style>
