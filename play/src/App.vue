<script setup lang="ts">
import { BzText } from '@bzsh-ui/components'
import { ref } from 'vue'

const text = ref(
  '这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本这是一个测试文本'
)
</script>

<template>
  <div>
    <div>111111111111</div>
    <div class="w-100px">
      <BzText v-model="text" class="w-100px bg-red" :tool-tip-line="2" />
    </div>
  </div>
</template>
