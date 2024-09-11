<script setup lang="ts">
import MorphBlob from '@/components/MorphBlob/MorphBlob.vue'
</script>

<template>
  <header class="header">
    <div class="header__wrapper">
      <MorphBlob />
      <h1 class="header__title">Тестовое задание для Программного продукта</h1>
    </div>
  </header>
</template>

<style scoped lang="sass">
$header-font-family: 'PressStart2P', Arial, Helvetica, sans-serif

.header
  padding-top: 20px
  font-family: $header-font-family
  position: sticky
  top: 0
  background-color: #181818
  z-index: 2
  @media screen and (max-width: 768px)
    justify-content: center
  &__wrapper
    width: 90%
    max-width: 1280px
    margin: 0 auto 20px
    display: flex
    gap: 20px
    align-items: center
  &__title
    font-size: 26px
    line-height: 1.2
    @media screen and (max-width: 768px)
      display: none
</style>
