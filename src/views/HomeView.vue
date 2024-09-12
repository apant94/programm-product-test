<script setup lang="ts">
import ColumnsList from '@/components/ColumnsList/ColumnsList.vue'
</script>

<template>
  <main class="main">
    <ColumnsList />
  </main>
</template>

<style lang="sass" scoped>
.main
  display: flex
  gap: 10px
  width: 90%
  max-width: 1280px
  margin: 0 auto 20px
  @media screen and (max-width: 768px)
    margin: 0 auto 10px
    width: calc(100% - 20px)
</style>
