<script setup lang="ts">
const props = defineProps({
  width: {
    type: Number,
    default: 40
  },
  height: {
    type: Number,
    default: 40
  }
})
</script>

<template>
  <span class="loader" :style="{ width: `${width}px`, height: `${height}px` }"></span>
</template>

<style scoped lang="sass">
.loader
  display: flex
  border-radius: 50%
  background: radial-gradient(farthest-side,#3f5efb 94%,#0000) top/4px 4px no-repeat, conic-gradient(#0000 30%,#3f5efb)
  -webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - 4px),#000 0)
  animation: spinner-ub 0.8s infinite linear

@keyframes spinner-ub
  100%
    transform: rotate(1turn)
</style>
