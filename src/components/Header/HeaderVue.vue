<script setup lang="ts">
import MorphBlob from '@/components/MorphBlob/MorphBlob.vue'
</script>

<template>
  <header class="header">
    <MorphBlob />
    <h1 class="header__title">Тестовое задание для Программного продукта</h1>
  </header>
</template>

<style scoped lang="sass">
$header-font-family: 'PressStart2P', Arial, Helvetica, sans-serif

.header
  font-family: $header-font-family
  display: flex
  gap: 20px
  align-items: center
  @media screen and (max-width: 768px)
    justify-content: center
  &__title
    font-size: 26px
    line-height: 1.2
    @media screen and (max-width: 768px)
      display: none
</style>
