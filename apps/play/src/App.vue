<template>
  <main class="playground">
    <section class="playground__section">
      <h1>bzsh-ui Playground</h1>
      <p>使用示例组件验证组件库导出、样式和交互链路。</p>
    </section>

    <section class="playground__section playground__actions">
      <BzButton label="Primary Button" @click="count += 1" />
      <BzButton type="success" plain>Success Plain</BzButton>
      <BzButton type="warning" size="large">Large Warning</BzButton>
      <BzButton type="danger" :disabled="true">Disabled</BzButton>
    </section>

    <section class="playground__section">
      <p>点击次数: {{ count }}</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<style scoped lang="scss">
.playground {
  min-height: 100vh;
  padding: 48px;
}

.playground__section {
  margin-bottom: 24px;
}

.playground__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
